import type { FormatNumbersOptions } from '../types';
import { DEFAULT_DECIMALS, DEFAULT_COMPACT_THRESHOLD } from '../constants';
import { parseInputValue, determineIfCompactShouldBeUsed, formatNaN } from '../utils';
import { formatCurrency } from './currency';
import { formatPercentage, formatToken, formatRaw } from '..';

// Main function that delegates to specific functions
export function format(amount: number | string, options?: FormatNumbersOptions): string {
  if (amount === undefined || (typeof amount !== 'string' && typeof amount !== 'number')) {
    return '';
  }
  if (isNaN(+amount)) {
    return formatNaN(options?.type ?? 'currency', options?.tokenSymbol ?? '');
  }

  // Default values
  const {
    type = 'currency',
    decimals = DEFAULT_DECIMALS,
    compact = false,
    autoCompact = false,
    compactThreshold = DEFAULT_COMPACT_THRESHOLD,
    tokenSymbol = '',
    significantDigits,
    showSign = false,
    rounded = false,
    fullDecimals = false,
    locale = 'en-US',
    currency = 'USD',
  } = options ?? {};
  const value = parseInputValue(amount);
  const rawValue = amount.toString();
  const shouldUseCompact = determineIfCompactShouldBeUsed(value, compact, autoCompact, compactThreshold);

  switch (type) {
    case 'percentage':
      return formatPercentage(value, decimals, shouldUseCompact, showSign, significantDigits, rounded);
    case 'token':
      return formatToken(value, decimals, tokenSymbol, shouldUseCompact, showSign, significantDigits, rounded, fullDecimals, rawValue);
    case 'raw':
      return formatRaw(value);
    default: // "currency"
      return formatCurrency(value, decimals, shouldUseCompact, showSign, significantDigits, { locale, currency });
  }
}
