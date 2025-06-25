
import React from 'react';
import { useTranslation, SupportedLanguage } from '../services/translationService';

interface LanguageSelectorProps {
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = '' }) => {
  const { currentLanguage, setLanguage, availableLanguages, getLanguageName } = useTranslation();

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = event.target.value as SupportedLanguage;
    setLanguage(newLanguage);
    // Force a page refresh to apply translations throughout the app
    window.location.reload();
  };

  return (
    <div className={`language-selector ${className}`}>
      <select
        value={currentLanguage}
        onChange={handleLanguageChange}
        className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {availableLanguages.map((lang) => (
          <option key={lang} value={lang}>
            {getLanguageName(lang)}
          </option>
        ))}
      </select>
    </div>
  );
};
