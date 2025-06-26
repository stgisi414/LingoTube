
import { translations, TranslationKeys, SupportedLanguage } from '../data/translations';
import { useState, useEffect } from 'react';

/**
 * Detects the user's browser language and returns the appropriate supported language
 */
export function detectBrowserLanguage(): SupportedLanguage {
  // Check if user has previously selected a language
  const savedLanguage = localStorage.getItem('ailingo-language');
  if (savedLanguage && savedLanguage in translations) {
    return savedLanguage as SupportedLanguage;
  }

  // Get the browser's language
  const browserLang = navigator.language || navigator.languages?.[0] || 'en';

  // Extract the primary language code (e.g., 'en-US' -> 'en')
  const primaryLang = browserLang.split('-')[0].toLowerCase();

  // Check if we support this language
  if (primaryLang in translations) {
    return primaryLang as SupportedLanguage;
  }

  // Fallback to English
  return 'en';
}

/**
 * Translation service class with event emission for React updates
 */
class TranslationService {
  private currentLanguage: SupportedLanguage;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.currentLanguage = detectBrowserLanguage();
    console.log(`🌍 Translation service initialized with language: ${this.currentLanguage}`);
  }

  /**
   * Subscribe to language changes
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all listeners of language change
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }

  /**
   * Get translation for a specific key
   */
  t(key: keyof TranslationKeys): string {
    return translations[this.currentLanguage][key] || translations.en[key] || key;
  }

  /**
   * Get current language
   */
  getCurrentLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }

  /**
   * Set language manually
   */
  setLanguage(language: SupportedLanguage): void {
    if (this.currentLanguage !== language) {
      this.currentLanguage = language;
      localStorage.setItem('ailingo-language', language);
      console.log(`🌍 Language changed to: ${language}`);
      this.notifyListeners();
    }
  }

  /**
   * Get all available languages
   */
  getAvailableLanguages(): SupportedLanguage[] {
    return Object.keys(translations) as SupportedLanguage[];
  }

  /**
   * Get language name in its native script
   */
  getLanguageName(language: SupportedLanguage): string {
    const languageNames: Record<SupportedLanguage, string> = {
      en: 'English',
      ko: '한국어',
      zh: '中文',
      ja: '日本語',
      es: 'Español',
      it: 'Italiano',
      de: 'Deutsch',
      fr: 'Français'
    };
    return languageNames[language];
  }
}

// Create and export a singleton instance
export const translationService = new TranslationService();

// Export the translation function for convenience
export const t = (key: keyof TranslationKeys): string => translationService.t(key);

// Hook for React components with reactive updates
export function useTranslation() {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const unsubscribe = translationService.subscribe(() => {
      forceUpdate({}); // Force re-render when language changes
    });
    return unsubscribe;
  }, []);

  return {
    t: translationService.t.bind(translationService),
    currentLanguage: translationService.getCurrentLanguage(),
    setLanguage: translationService.setLanguage.bind(translationService),
    availableLanguages: translationService.getAvailableLanguages(),
    getLanguageName: translationService.getLanguageName.bind(translationService)
  };
}

// Re-export types for convenience
export type { SupportedLanguage, TranslationKeys };
