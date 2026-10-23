import type { SUPPORTED_LANGUAGES } from '@shared/constants';

export type Language = (typeof SUPPORTED_LANGUAGES)[number];
export type Direction = 'ltr' | 'rtl';
