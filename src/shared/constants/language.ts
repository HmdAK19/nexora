import type { Language } from '@shared/model';

export const SUPPORTED_LANGUAGES = ['en', 'fa'] as const;
export const RTL_LANGUAGES: readonly Language[] = ['fa'];
export const DEFAULT_LANGUAGE: Language = 'en';
export const LANGUAGE_STORAGE_KEY = 'nexora-language';
export const LANGUAGE_LABELS: Record<Language, string> = {
  en: 'English',
  fa: 'فارسی',
};
