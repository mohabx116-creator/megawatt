export type Language = 'en' | 'ar';

export type TranslationKey = string;

export type TranslationParams = Record<string, string | number>;

export type LanguageContextValue = {
  language: Language;
  isRtl: boolean;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, params?: TranslationParams) => string;
  formatCurrency: (value?: number) => string;
  formatDate: (value?: string) => string;
  formatNumber: (value?: number) => string;
  formatStatus: (value: string) => string;
};
