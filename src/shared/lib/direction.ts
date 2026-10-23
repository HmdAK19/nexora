import { RTL_LANGUAGES } from '@shared/constants';
import type { Direction, Language } from '@shared/model';

export const getDirection = (language: Language): Direction =>
  RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr';
