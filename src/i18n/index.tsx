import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { languageStorageKey, resources } from './resources';
import { Language, LanguageContextValue, TranslationKey, TranslationParams } from './types';

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const isLanguage = (value: string | null): value is Language => value === 'en' || value === 'ar';

const interpolate = (template: string, params?: TranslationParams) => {
  if (!params) return template;

  return Object.entries(params).reduce((current, [key, value]) => current.replaceAll(`{${key}}`, String(value)), template);
};

const fallbackLabel = (value: string) =>
  value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const storedLanguage = localStorage.getItem(languageStorageKey);
    return isLanguage(storedLanguage) ? storedLanguage : 'en';
  });

  const setLanguage = (nextLanguage: Language) => {
    localStorage.setItem(languageStorageKey, nextLanguage);
    setLanguageState(nextLanguage);
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const value = useMemo<LanguageContextValue>(() => {
    const t = (key: TranslationKey, params?: TranslationParams) => interpolate(resources[language][key] ?? resources.en[key] ?? key, params);
    const formatNumber = (input = 0) =>
      new Intl.NumberFormat('en-EG', {
        maximumFractionDigits: 0
      }).format(Number.isFinite(input) ? input : 0);

    return {
      language,
      isRtl: language === 'ar',
      setLanguage,
      t,
      formatNumber,
      formatCurrency: (input = 0) => (language === 'ar' ? `${formatNumber(input)} جنيه` : `EGP ${formatNumber(input)}`),
      formatDate: (input?: string) => {
        if (!input) return t('common.notAvailable');

        const date = new Date(input);
        if (Number.isNaN(date.getTime())) return t('common.notAvailable');

        return new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-EG', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }).format(date);
      },
      formatStatus: (input: string) => t(`status.${input}`) === `status.${input}` ? fallbackLabel(input) : t(`status.${input}`)
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
}
