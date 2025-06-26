
import React from 'react';
import { useTranslation, SupportedLanguage } from '../services/translationService';

interface LanguageSelectorProps {
  className?: string;
}

const languageFlags: Record<SupportedLanguage, string> = {
  en: '🇺🇸',
  ko: '🇰🇷',
  zh: '🇨🇳',
  ja: '🇯🇵',
  es: '🇪🇸',
  it: '🇮🇹',
  de: '🇩🇪',
  fr: '🇫🇷'
};

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = '' }) => {
  const { currentLanguage, setLanguage, availableLanguages, getLanguageName } = useTranslation();

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = event.target.value as SupportedLanguage;
    setLanguage(newLanguage);
  };

  return (
    <div className={`language-selector ${className}`}>
      <select
        value={currentLanguage}
        onChange={handleLanguageChange}
        className="px-4 py-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black font-semibold rounded-lg border-2 border-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-200 shadow-lg hover:from-yellow-300 hover:via-yellow-400 hover:to-yellow-500 transition-all duration-200 cursor-pointer"
      >
        {availableLanguages.map((lang) => (
          <option key={lang} value={lang} className="bg-white text-black">
            {languageFlags[lang]} {getLanguageName(lang)}
          </option>
        ))}
      </select>
    </div>
  );
};
