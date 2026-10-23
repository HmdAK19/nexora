import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { en as layoutEn, fa as layoutFa } from '@app/layouts/locales';
import { en as adminEn, fa as adminFa } from '@features/admin/locales';
import { en as authEn, fa as authFa } from '@features/auth/locales';
import { en as buyEn, fa as buyFa } from '@features/buy/locales';
import { en as cardsEn, fa as cardsFa } from '@features/cards/locales';
import { en as convertEn, fa as convertFa } from '@features/convert/locales';
import { en as dashboardEn, fa as dashboardFa } from '@features/dashboard/locales';
import { en as marketEn, fa as marketFa } from '@features/markets/locales';
import { en as ordersEn, fa as ordersFa } from '@features/orders/locales';
import { en as referralsEn, fa as referralsFa } from '@features/referrals/locales';
import { en as settingsEn, fa as settingsFa } from '@features/settings/locales';
import { en as supportEn, fa as supportFa } from '@features/support/locales';
import { en as tradeEn, fa as tradeFa } from '@features/trade/locales';
import { en as verificationEn, fa as verificationFa } from '@features/verification/locales';
import { en as walletEn, fa as walletFa } from '@features/wallet/locales';
import { DEFAULT_LANGUAGE } from '@shared/constants';
import { en as commonEn, fa as commonFa } from '@shared/locales';

import { NAMESPACES } from './namespaces';

const legacyResources = {
  en: {
    admin: adminEn,
    common: commonEn,
    nav: layoutEn,
    auth: authEn,
    buy: buyEn,
    cards: cardsEn,
    convert: convertEn,
    dashboard: dashboardEn,
    market: marketEn,
    trade: tradeEn,
    wallet: walletEn,
    orders: ordersEn,
    referrals: referralsEn,
    settings: settingsEn,
    support: supportEn,
    verification: verificationEn,
  },
  fa: {
    admin: adminFa,
    common: commonFa,
    nav: layoutFa,
    auth: authFa,
    buy: buyFa,
    cards: cardsFa,
    convert: convertFa,
    dashboard: dashboardFa,
    market: marketFa,
    trade: tradeFa,
    wallet: walletFa,
    orders: ordersFa,
    referrals: referralsFa,
    settings: settingsFa,
    support: supportFa,
    verification: verificationFa,
  },
} as const;

export const resources = {
  en: {
    translation: legacyResources.en,
    [NAMESPACES.admin]: adminEn,
    [NAMESPACES.auth]: authEn,
    [NAMESPACES.buy]: buyEn,
    [NAMESPACES.cards]: cardsEn,
    [NAMESPACES.common]: commonEn,
    [NAMESPACES.convert]: convertEn,
    [NAMESPACES.dashboard]: dashboardEn,
    [NAMESPACES.layout]: layoutEn,
    [NAMESPACES.market]: marketEn,
    [NAMESPACES.orders]: ordersEn,
    [NAMESPACES.referrals]: referralsEn,
    [NAMESPACES.settings]: settingsEn,
    [NAMESPACES.support]: supportEn,
    [NAMESPACES.trade]: tradeEn,
    [NAMESPACES.verification]: verificationEn,
    [NAMESPACES.wallet]: walletEn,
  },
  fa: {
    translation: legacyResources.fa,
    [NAMESPACES.admin]: adminFa,
    [NAMESPACES.auth]: authFa,
    [NAMESPACES.buy]: buyFa,
    [NAMESPACES.cards]: cardsFa,
    [NAMESPACES.common]: commonFa,
    [NAMESPACES.convert]: convertFa,
    [NAMESPACES.dashboard]: dashboardFa,
    [NAMESPACES.layout]: layoutFa,
    [NAMESPACES.market]: marketFa,
    [NAMESPACES.orders]: ordersFa,
    [NAMESPACES.referrals]: referralsFa,
    [NAMESPACES.settings]: settingsFa,
    [NAMESPACES.support]: supportFa,
    [NAMESPACES.trade]: tradeFa,
    [NAMESPACES.verification]: verificationFa,
    [NAMESPACES.wallet]: walletFa,
  },
} as const;

void i18n.use(initReactI18next).init({
  defaultNS: 'translation',
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: { escapeValue: false },
  lng: DEFAULT_LANGUAGE,
  ns: ['translation', ...Object.values(NAMESPACES)],
  resources,
  returnNull: false,
});

export default i18n;
