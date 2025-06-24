
import React, { useState } from 'react';
import { generateMultilingualNarration } from '../services/geminiService';

interface MultilingualControlsProps {
  onMultilingualTextGenerated: (text: string) => void;
  originalText: string;
  disabled?: boolean;
}

const MultilingualControls: React.FC<MultilingualControlsProps> = ({
  onMultilingualTextGenerated,
  originalText,
  disabled = false
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['en', 'es', 'fr', 'de']);

  const supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' }
  ];

  const handleLanguageToggle = (langCode: string) => {
    setSelectedLanguages(prev => 
      prev.includes(langCode) 
        ? prev.filter(code => code !== langCode)
        : [...prev, langCode]
    );
  };

  const handleGenerateMultilingual = async () => {
    if (!originalText.trim() || selectedLanguages.length === 0) return;
    
    setIsGenerating(true);
    try {
      const multilingualText = await generateMultilingualNarration(originalText, selectedLanguages);
      onMultilingualTextGenerated(multilingualText);
    } catch (error) {
      console.error('Failed to generate multilingual content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-slate-800/50 rounded-lg p-4 mb-4 border border-slate-600">
      <h3 className="text-lg font-semibold text-purple-300 mb-3">🌍 Multilingual TTS</h3>
      
      <div className="mb-4">
        <p className="text-sm text-slate-400 mb-2">Select languages for multilingual narration:</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {supportedLanguages.map(lang => (
            <label key={lang.code} className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={selectedLanguages.includes(lang.code)}
                onChange={() => handleLanguageToggle(lang.code)}
                className="rounded text-purple-500 focus:ring-purple-500"
                disabled={disabled || isGenerating}
              />
              <span className="text-slate-300">{lang.name}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={handleGenerateMultilingual}
        disabled={disabled || isGenerating || selectedLanguages.length === 0 || !originalText.trim()}
        className={`w-full px-4 py-2 rounded-md font-medium transition-colors ${
          disabled || isGenerating || selectedLanguages.length === 0 || !originalText.trim()
            ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
            : 'bg-purple-600 hover:bg-purple-700 text-white'
        }`}
      >
        {isGenerating ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating Multilingual Content...
          </span>
        ) : (
          `Generate Multilingual Narration (${selectedLanguages.length} languages)`
        )}
      </button>
      
      {selectedLanguages.length > 0 && (
        <p className="text-xs text-slate-500 mt-2">
          Selected: {selectedLanguages.map(code => supportedLanguages.find(l => l.code === code)?.name).join(', ')}
        </p>
      )}
    </div>
  );
};

export default MultilingualControls;
