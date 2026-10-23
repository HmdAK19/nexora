import { useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

import { DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY, SUPPORTED_LANGUAGES } from '@shared/constants';
import { getDirection } from '@shared/lib';
import type { Language } from '@shared/model';

import i18n from '../../i18n/config';
import { LanguageContext, type LanguageContextValue } from './languageContext';

const isLanguage = (value: string | null): value is Language =>
  SUPPORTED_LANGUAGES.some((language) => language === value);

const alternateLanguage: Record<Language, Language> = {
  en: 'fa',
  fa: 'en',
};

const getInitialLanguage = (): Language => {
  try {
    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);

    return isLanguage(storedLanguage) ? storedLanguage : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
};

export function LanguageProvider({ children }: PropsWithChildren) {
  const [lang, setLang] = useState<Language>(getInitialLanguage);
  const dir = getDirection(lang);

  const changeLanguage = useCallback((language: Language) => {
    setLang(language);
    void i18n.changeLanguage(language);

    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // Storage can be unavailable in private or restricted browser contexts.
    }
  }, []);

  const toggleLanguage = useCallback(() => changeLanguage(alternateLanguage[lang]), [changeLanguage, lang]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;

    if (i18n.language !== lang) void i18n.changeLanguage(lang);
  }, [dir, lang]);

  const value = useMemo<LanguageContextValue>(
    () => ({ changeLanguage, dir, lang, toggleLanguage }),
    [changeLanguage, dir, lang, toggleLanguage]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
