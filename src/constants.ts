import type { LocaleCode, CurrencyCode } from './types';

export const MAX_SMALL_VALUE = 0.01;
export const DEFAULT_DECIMALS = 2;
export const DEFAULT_COMPACT_THRESHOLD = 10000;

function createLocaleCurrency(locale: LocaleCode, currency: CurrencyCode) {
  return { locale, currency };
}

export const COMMON_LOCALE_CURRENCIES = {
  USD_US: createLocaleCurrency('en-US', 'USD'),
  GBP_GB: createLocaleCurrency('en-GB', 'GBP'),
  GBP_US: createLocaleCurrency('en-US', 'GBP'),

  EUR_US: createLocaleCurrency('en-US', 'EUR'),
  EUR_DE: createLocaleCurrency('de-DE', 'EUR'),
  EUR_ES: createLocaleCurrency('es-ES', 'EUR'),
  EUR_FR: createLocaleCurrency('fr-FR', 'EUR'),
  EUR_IT: createLocaleCurrency('it-IT', 'EUR'),

  AED_AE: createLocaleCurrency('ar-AE', 'AED'),
  AED_US: createLocaleCurrency('en-US', 'AED'),

  INR_IN: createLocaleCurrency('hi-IN', 'INR'),
  INR_US: createLocaleCurrency('en-US', 'INR'),

  NGN_NG: createLocaleCurrency('en-NG', 'NGN'),
  NGN_US: createLocaleCurrency('en-US', 'NGN'),
} as const;
