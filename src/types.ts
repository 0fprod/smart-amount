// Type definitions for multi-currency support
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'AED' | 'INR' | 'NGN';
export type LocaleCode = 'en-US' | 'en-GB' | 'de-DE' | 'es-ES' | 'fr-FR' | 'it-IT' | 'ar-AE' | 'hi-IN' | 'en-NG';

export interface LocaleCurrencyConfig {
  locale: LocaleCode;
  currency: CurrencyCode;
}

export interface FormatNumbersOptions {
  type?: 'currency' | 'percentage' | 'token' | 'raw';
  decimals?: number;
  compact?: boolean;
  autoCompact?: boolean;
  compactThreshold?: number;
  tokenSymbol?: string;
  significantDigits?: number;
  showSign?: boolean;
  rounded?: boolean;
  fullDecimals?: boolean;
  localeCurrency?: LocaleCurrencyConfig;
}
