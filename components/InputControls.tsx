
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MicIcon, StopCircleIcon, SendIcon } from '../constants';
import { SpeechRecognition, AppStatus } from '../types'; // Import AppStatus and SpeechRecognition type

interface InputControlsProps {
  onSubmit: (topic: string) => void;
  isProcessing: boolean;
  setAppStatus: (status: AppStatus) => void; // Use imported AppStatus
}

export const InputControls: React.FC<InputControlsProps> = ({ onSubmit, isProcessing, setAppStatus }) => {
  const [topic, setTopic] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState<SpeechRecognition | null>(null);
  const [micPermissionError, setMicPermissionError] = useState<string | null>(null);

  const isRecordingRef = useRef(isRecording);

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

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
        setTopic(speechResult);
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
            // Set specific error for no speech, or let user retry
        } else {
            setMicPermissionError(errorMsg); // Set general speech error
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
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [setAppStatus, setTopic, setIsRecording, setMicPermissionError, setSpeechRecognition]); // All setters are stable, effect runs once.

  const handleMicClick = useCallback(async () => {
    if (!speechRecognition) {
      setMicPermissionError("Speech recognition is not supported by your browser.");
      setAppStatus(AppStatus.ERROR);
      return;
    }

    if (isRecording) {
      speechRecognition.stop();
      // setIsRecording(false); // onend should handle this
      // setAppStatus(AppStatus.IDLE); // onend should handle this
    } else {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true }); // Check mic permission
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
  }, [speechRecognition, isRecording, setAppStatus, setIsRecording, setMicPermissionError]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && !isProcessing) {
      onSubmit(topic.trim());
    }
  };

  return (
    <div className="bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl border border-slate-700">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-purple-300 mb-1">
            What do you want to learn about today?
          </label>
          <textarea
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., The basics of Quantum Physics, History of the Roman Empire, How to bake sourdough bread..."
            rows={4}
            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow placeholder-slate-500"
            disabled={isProcessing || isRecording}
            aria-label="Topic to learn"
          />
        </div>

        {micPermissionError && (
            <p className="text-sm text-red-400" role="alert">{micPermissionError}</p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
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
          
          <button
            type="submit"
            disabled={isProcessing || isRecording || !topic.trim()}
            className="flex items-center justify-center px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-colors duration-150 ease-in-out w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Generate lesson based on the entered topic"
          >
            <span className="mr-2">Generate Lesson</span>
            {SendIcon}
          </button>
        </div>
        {!speechRecognition && window.SpeechRecognition === undefined && window.webkitSpeechRecognition === undefined && (
             <p className="text-xs text-slate-500 text-center sm:text-left pt-2">Voice input is not supported by your browser.</p>
        )}
      </form>
    </div>
  );
};