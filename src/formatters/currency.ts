import type { LocaleCurrencyConfig } from "../types";
import { COMMON_LOCALE_CURRENCIES } from "../constants";
import { isSmallNumber } from "../utils";
import { formatSmallNumber } from "../helpers/small-numbers";

export function formatCurrency(
  value: number,
  decimals: number,
  compact: boolean,
  showSign: boolean,
  significantDigits?: number,
  localeCurrency: LocaleCurrencyConfig = COMMON_LOCALE_CURRENCIES.USD_US
): string {
  // Special case: zero
  if (value === 0) {
    return formatZeroAsCurrency(decimals, localeCurrency);
  }

  // Special case: small number
  if (isSmallNumber(value) && !compact) {
    return formatSmallNumberAsCurrency(value, showSign, significantDigits, localeCurrency);
  }

  // Normal case
  return formatRegularNumberAsCurrency(value, decimals, compact, showSign, localeCurrency);
}

function formatZeroAsCurrency(decimals: number, localeCurrency: LocaleCurrencyConfig): string {
  return new Intl.NumberFormat(localeCurrency.locale, {
    style: "currency",
    currency: localeCurrency.currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(0);
}

function formatSmallNumberAsCurrency(
  value: number,
  showSign: boolean,
  significantDigits?: number,
  localeCurrency: LocaleCurrencyConfig = COMMON_LOCALE_CURRENCIES.USD_US
): string {
  const formattedValue = formatSmallNumber(value, significantDigits);
  const formattedValueWithoutSign = formattedValue.startsWith("-") ? formattedValue.slice(1) : formattedValue;

  // Get currency symbol from Intl
  const currencySymbol = new Intl.NumberFormat(localeCurrency.locale, {
    style: "currency",
    currency: localeCurrency.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(0)
    .replace(/[\d,]/g, "")
    .trim();

  if (value > 0 && showSign) {
    return `+${currencySymbol}${formattedValueWithoutSign}`;
  } else if (value < 0) {
    return `-${currencySymbol}${formattedValueWithoutSign}`;
  }
  return `${currencySymbol}${formattedValue}`;
}

function formatRegularNumberAsCurrency(
  value: number,
  decimals: number,
  compact: boolean,
  showSign: boolean,
  localeCurrency: LocaleCurrencyConfig
): string {
  const sign = showSign && value > 0 ? "+" : "";

  const formatter = new Intl.NumberFormat(localeCurrency.locale, {
    style: "currency",
    currency: localeCurrency.currency,
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
    notation: compact ? "compact" : "standard",
  });

  return sign + formatter.format(value);
}
