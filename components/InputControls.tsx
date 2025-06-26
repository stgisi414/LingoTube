import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MicIcon, StopCircleIcon, SendIcon } from '../constants';
import { SpeechRecognition, AppStatus, SentenceTemplate } from '../types';
import { SENTENCE_TEMPLATES } from '../data/searchTemplateOptions';

interface InputControlsProps {
  onSubmit: (topic: string) => void;
  isProcessing: boolean;
  setAppStatus: (status: AppStatus) => void;
}



export const InputControls: React.FC<InputControlsProps> = ({ onSubmit, isProcessing, setAppStatus }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<SentenceTemplate>(SENTENCE_TEMPLATES[0]);
  const [blankValues, setBlankValues] = useState<Record<string, string>>({});
  const [customTopic, setCustomTopic] = useState('');
  const [useCustomInput, setUseCustomInput] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState<SpeechRecognition | null>(null);
  const [micPermissionError, setMicPermissionError] = useState<string | null>(null);

  const isRecordingRef = useRef(isRecording);

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  // Initialize blank values when template changes
  useEffect(() => {
    const initialValues: Record<string, string> = {};
    selectedTemplate.blanks.forEach(blank => {
      initialValues[blank.id] = '';
    });
    setBlankValues(initialValues);
  }, [selectedTemplate]);

  // Speech recognition setup
  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognitionInstance: SpeechRecognition | null = null;

    if (SpeechRecognitionAPI) {
      recognitionInstance = new SpeechRecognitionAPI();
      recognitionInstance.continuous = false;
      recognitionInstance.lang = 'en-US';
      recognitionInstance.interimResults = false;
      recognitionInstance.maxAlternatives = 1;

      recognitionInstance.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        setCustomTopic(speechResult);
        setIsRecording(false);
        setAppStatus(AppStatus.IDLE);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        let errorMsg = 'Speech recognition error: ' + event.error;
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          errorMsg = "Microphone access denied. Please enable microphone permissions in your browser settings.";
          setMicPermissionError(errorMsg);
        } else if (event.error === 'no-speech') {
          errorMsg = "No speech detected. Please try again.";
        } else {
          setMicPermissionError(errorMsg);
        }
        setIsRecording(false);
        setAppStatus(AppStatus.ERROR);
      };

      recognitionInstance.onend = () => {
        if (isRecordingRef.current) {
          setIsRecording(false);
          setAppStatus(AppStatus.IDLE);
        }
      };
      setSpeechRecognition(recognitionInstance);
    } else {
      console.warn('Speech Recognition API not supported in this browser.');
    }

    return () => {
      if (recognitionInstance) {
        recognitionInstance.abort();
        recognitionInstance.onresult = null;
        recognitionInstance.onerror = null;
        recognitionInstance.onend = null;
      }
    };
  }, [setAppStatus]);

  const handleMicClick = useCallback(async () => {
    if (!speechRecognition) {
      setMicPermissionError("Speech recognition is not supported by your browser.");
      setAppStatus(AppStatus.ERROR);
      return;
    }

    if (isRecording) {
      speechRecognition.stop();
    } else {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicPermissionError(null);
        speechRecognition.start();
        setIsRecording(true);
        setAppStatus(AppStatus.RECOGNIZING_SPEECH);
      } catch (err) {
        console.error("Error accessing microphone:", err);
        let msg = "Microphone access denied or microphone not found. Please check permissions and hardware.";
        if (err instanceof Error && err.name === 'NotFoundError') {
          msg = "No microphone found. Please connect a microphone and try again.";
        }
        setMicPermissionError(msg);
        setAppStatus(AppStatus.ERROR);
        setIsRecording(false);
      }
    }
  }, [speechRecognition, isRecording, setAppStatus]);

  const generateTopicFromTemplate = useCallback(() => {
    let topic = selectedTemplate.template;
    selectedTemplate.blanks.forEach(blank => {
      const value = blankValues[blank.id] || blank.placeholder;
      topic = topic.replace(`{${blank.id}}`, value);
    });
    return topic;
  }, [selectedTemplate, blankValues]);

  const isTemplateComplete = useCallback(() => {
    return selectedTemplate.blanks.every(blank => blankValues[blank.id]?.trim());
  }, [selectedTemplate, blankValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalTopic = '';
    if (useCustomInput) {
      finalTopic = customTopic.trim();
    } else {
      if (!isTemplateComplete()) return;
      finalTopic = generateTopicFromTemplate();
    }

    if (finalTopic && !isProcessing) {
      onSubmit(finalTopic);
    }
  };

  const updateBlankValue = (blankId: string, value: string) => {
    setBlankValues(prev => ({
      ...prev,
      [blankId]: value
    }));
  };

  return (
    <div className="bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl border border-slate-700">
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Toggle between template and custom input */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          <button
            type="button"
            onClick={() => setUseCustomInput(false)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              !useCustomInput ? 'bg-yellow-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Guided Templates
          </button>
          <button
            type="button"
            onClick={() => setUseCustomInput(true)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              useCustomInput ? 'bg-yellow-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Free Input
          </button>
        </div>

        {!useCustomInput ? (
          /* Template-based input */
          <div className="space-y-4">
            {/* Template selector */}
            <div>
              <label className="block text-sm font-medium text-yellow-300 mb-2">
                Choose a lesson template:
              </label>
              <select
                value={selectedTemplate.id}
                onChange={(e) => {
                  const template = SENTENCE_TEMPLATES.find(t => t.id === e.target.value);
                  if (template) setSelectedTemplate(template);
                }}
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                disabled={isProcessing || isRecording}
              >
                {SENTENCE_TEMPLATES.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.example}
                  </option>
                ))}
              </select>
            </div>

            {/* Template builder */}
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="text-lg text-slate-200 mb-4 leading-relaxed">
                {selectedTemplate.template.split(/(\{[^}]+\})/).map((part, index) => {
                  const blankMatch = part.match(/\{([^}]+)\}/);
                  if (blankMatch) {
                    const blankId = blankMatch[1];
                    const blank = selectedTemplate.blanks.find(b => b.id === blankId);
                    if (!blank) return part;

                    return (
                      <span key={index} className="inline-block mx-1">
                        {blank.options ? (
                          <select
                            value={blankValues[blankId] || ''}
                            onChange={(e) => updateBlankValue(blankId, e.target.value)}
                            className="bg-yellow-600 text-white px-2 py-1 rounded border-none focus:ring-2 focus:ring-yellow-400 min-w-[120px] max-w-[200px] truncate"
                            disabled={isProcessing || isRecording}
                          >
                            <option value="">{blank.placeholder}</option>
                            {blank.options.map(option => (
                              <option key={option} value={option} className="truncate">{option}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={blankValues[blankId] || ''}
                            onChange={(e) => updateBlankValue(blankId, e.target.value)}
                            placeholder={blank.placeholder}
                            className="bg-yellow-600 text-white px-2 py-1 rounded border-none focus:ring-2 focus:ring-yellow-400 min-w-[120px] max-w-[200px]"
                            disabled={isProcessing || isRecording}
                          />
                        )}
                      </span>
                    );
                  }
                  return <span key={index}>{part}</span>;
                })}
              </div>

              {/* Preview */}
              <div className="text-sm text-slate-400 border-t border-slate-600 pt-3">
                <strong>Preview:</strong> {generateTopicFromTemplate()}
              </div>
            </div>
          </div>
        ) : (
          /* Custom input */
          <div>
            <label htmlFor="custom-topic" className="block text-sm font-medium text-yellow-300 mb-1">
              What do you want to learn about today?
            </label>
            <textarea
              id="custom-topic"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="e.g., The basics of Quantum Physics, History of the Roman Empire, How to bake sourdough bread..."
              rows={4}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-shadow placeholder-slate-500"
              disabled={isProcessing || isRecording}
              aria-label="Topic to learn"
            />
          </div>
        )}

        {micPermissionError && (
          <p className="text-sm text-red-400" role="alert">{micPermissionError}</p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          {useCustomInput && (
            <button
              type="button"
              onClick={handleMicClick}
              disabled={isProcessing || !speechRecognition}
              className={`flex items-center justify-center px-4 py-2.5 border rounded-lg transition-all duration-150 ease-in-out w-full sm:w-auto
                          ${isRecording 
                              ? 'bg-red-600 hover:bg-red-700 border-red-500 text-white animate-pulse' 
                              : 'bg-slate-600 hover:bg-slate-500 border-slate-500 text-slate-200'}
                          ${isProcessing || !speechRecognition ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-pressed={isRecording}
              aria-label={isRecording ? "Stop voice input" : "Start voice input"}
            >
              {isRecording ? StopCircleIcon : MicIcon}
              <span className="ml-2">{isRecording ? 'Stop Recording...' : 'Use Voice Input'}</span>
            </button>
          )}

          <button
            type="submit"
            disabled={
              isProcessing || 
              isRecording || 
              (useCustomInput ? !customTopic.trim() : !isTemplateComplete())
            }
            className="flex items-center justify-center px-6 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition-colors duration-150 ease-in-out w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Generate lesson based on the entered topic"
          >
            <span className="mr-2">Generate Lesson</span>
            {SendIcon}
          </button>
        </div>

        {!useCustomInput && !speechRecognition && window.SpeechRecognition === undefined && window.webkitSpeechRecognition === undefined && (
          <p className="text-xs text-slate-500 text-center sm:text-left pt-2">Voice input is not supported by your browser.</p>
        )}
      </form>
    </div>
  );
};