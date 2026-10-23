import { createContext } from 'react';

import type { Direction, Language } from '@shared/model';

export interface LanguageContextValue {
  changeLanguage: (language: Language) => void;
  dir: Direction;
  lang: Language;
  toggleLanguage: () => void;
}

export const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);
