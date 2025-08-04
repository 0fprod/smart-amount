const MAX_SMALL_VALUE = 0.01;
const DEFAULT_DECIMALS = 2;
const DEFAULT_COMPACT_THRESHOLD = 10000;

// Type definitions for multi-currency support
type CurrencyCode = "USD" | "EUR" | "GBP" | "AED" | "INR" | "NGN";
type LocaleCode = "en-US" | "en-GB" | "de-DE" | "es-ES" | "fr-FR" | "it-IT" | "ar-AE" | "hi-IN" | "en-NG";

interface LocaleCurrencyConfig {
  locale: LocaleCode;
  currency: CurrencyCode;
}

// Helper function to create locale currency configurations
function createLocaleCurrency(locale: LocaleCode, currency: CurrencyCode): LocaleCurrencyConfig {
  return { locale, currency };
}

// Predefined common combinations
export const COMMON_LOCALE_CURRENCIES = {
  // Main currencies
  USD_US: createLocaleCurrency("en-US", "USD"),
  GBP_GB: createLocaleCurrency("en-GB", "GBP"),
  GBP_US: createLocaleCurrency("en-US", "GBP"),

  // EUR in different countries
  EUR_US: createLocaleCurrency("en-US", "EUR"),
  EUR_DE: createLocaleCurrency("de-DE", "EUR"),
  EUR_ES: createLocaleCurrency("es-ES", "EUR"),
  EUR_FR: createLocaleCurrency("fr-FR", "EUR"),
  EUR_IT: createLocaleCurrency("it-IT", "EUR"),

  // UAE Dirham
  AED_AE: createLocaleCurrency("ar-AE", "AED"),
  AED_US: createLocaleCurrency("en-US", "AED"),

  // India Rupee
  INR_IN: createLocaleCurrency("hi-IN", "INR"),
  INR_US: createLocaleCurrency("en-US", "INR"),

  // Nigeria Naira
  NGN_NG: createLocaleCurrency("en-NG", "NGN"),
  NGN_US: createLocaleCurrency("en-US", "NGN"),
} as const;

export interface FormatNumbersOptions {
  type?: "currency" | "percentage" | "token" | "raw";
  decimals?: number;
  compact?: boolean;
  autoCompact?: boolean;
  compactThreshold?: number;
  tokenSymbol?: string;
  significantDigits?: number;
  showSign?: boolean;
  rounded?: boolean;
  fullDecimals?: boolean;
  localeCurrency?: LocaleCurrencyConfig; // New option
}

// Main function that delegates to specific functions
export function format(amount: number | string, options?: FormatNumbersOptions): string {
  if (amount === undefined || (typeof amount !== "string" && typeof amount !== "number")) {
    return "";
  }
  if (isNaN(+amount)) {
    return formatNaN(options?.type ?? "currency", options?.tokenSymbol ?? "");
  }

  // Default values
  const {
    type = "currency",
    decimals = DEFAULT_DECIMALS,
    compact = false,
    autoCompact = false,
    compactThreshold = DEFAULT_COMPACT_THRESHOLD,
    tokenSymbol = "",
    significantDigits,
    showSign = false,
    rounded = false,
    fullDecimals = false,
    localeCurrency = COMMON_LOCALE_CURRENCIES.USD_US,
  } = options ?? {};
  const value = parseInputValue(amount);
  const rawValue = amount.toString();
  const shouldUseCompact = determineIfCompactShouldBeUsed(value, compact, autoCompact, compactThreshold);

  switch (type) {
    case "percentage":
      return formatPercentage(value, decimals, shouldUseCompact, showSign, significantDigits, rounded);
    case "token":
      return formatToken(value, decimals, tokenSymbol, shouldUseCompact, showSign, significantDigits, rounded, fullDecimals, rawValue);
    case "raw":
      return formatRaw(value);
    default: // "currency"
      return formatCurrency(value, decimals, shouldUseCompact, showSign, significantDigits, localeCurrency);
  }
}

function parseInputValue(amount: number | string): number {
  return typeof amount === "string" ? parseFloat(amount) : amount;
}

function determineIfCompactShouldBeUsed(value: number, compact: boolean, autoCompact: boolean, compactThreshold: number): boolean {
  return compact || (autoCompact && Math.abs(value) >= compactThreshold);
}

function formatNaN(type: string, tokenSymbol: string): string {
  return type === "currency" ? "$NaN" : type === "percentage" ? "NaN%" : `NaN ${tokenSymbol}`.trim();
}
function formatPercentage(
  value: number,
  decimals: number,
  compact: boolean,
  showSign: boolean,
  significantDigits?: number,
  rounded?: boolean
): string {
  // Special case: zero
  if (value === 0) {
    return formatZeroAsPercentage(decimals);
  }

  // Special case: small number
  if (isSmallNumber(value) && !compact && !rounded) {
    return formatSmallNumberWithSuffix(value, showSign, significantDigits, "%");
  }

  // if its very small and its rounded should return zero. for example 0.00005% should return 0.00%
  if (rounded && isSmallNumber(value)) {
    return formatZeroAsPercentage(decimals);
  }

  // Normal case
  return formatRegularNumberWithSuffix(value, decimals, compact, showSign, "%", shouldShowDecimals(value, decimals));
}

function formatCurrency(
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

function formatRaw(value: number): string {
  // Special case: zero
  if (value === 0) {
    return "0";
  }

  // Special case: small number
  if (isSmallNumber(value)) {
    return formatSmallNumber(value);
  }

  // Normal case
  return value.toString();
}

function formatToken(
  value: number,
  decimals: number,
  tokenSymbol: string,
  compact: boolean,
  showSign: boolean,
  significantDigits?: number,
  rounded?: boolean,
  fullDecimals?: boolean,
  rawValue?: string // this is the raw value of the token used to format the token with full decimals
): string {
  // Special case: zero
  if (value === 0) {
    return formatZeroAsToken(decimals, tokenSymbol);
  }

  if (isSmallNumber(value) && !compact && rounded) {
    return formatZeroAsToken(decimals, tokenSymbol);
  }

  // Special case: small number
  if (isSmallNumber(value) && !compact) {
    return formatSmallNumberAsToken(value, tokenSymbol, showSign, significantDigits);
  }

  if (fullDecimals) {
    return formatTokenWithFullDecimals(rawValue, tokenSymbol, showSign);
  }

  // Normal case
  return formatRegularNumberAsToken(value, decimals, tokenSymbol, compact, showSign);
}

// Helper functions to detect special cases
function isSmallNumber(value: number): boolean {
  return Math.abs(value) < MAX_SMALL_VALUE;
}

function shouldShowDecimals(value: number, decimals: number): number {
  const hasDecimals = value % 1 !== 0;
  return hasDecimals ? decimals : 0;
}

// Functions to format specific cases
function formatZeroAsCurrency(decimals: number, localeCurrency: LocaleCurrencyConfig = COMMON_LOCALE_CURRENCIES.USD_US): string {
  return new Intl.NumberFormat(localeCurrency.locale, {
    style: "currency",
    currency: localeCurrency.currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(0);
}

function formatZeroAsToken(decimals: number, tokenSymbol: string): string {
  return `${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(0)} ${tokenSymbol}`.trim();
}

function formatZeroAsPercentage(decimals: number): string {
  return (
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(0) + "%"
  );
}

function formatSmallNumberWithSuffix(value: number, showSign: boolean, significantDigits: number | undefined, suffix: string): string {
  const sign = showSign && value > 0 ? "+" : "";
  const formattedValue = formatSmallNumber(value, significantDigits);
  return `${sign}${formattedValue}${suffix}`;
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

function formatSmallNumberAsToken(value: number, tokenSymbol: string, showSign: boolean, significantDigits?: number): string {
  const formattedValue = formatSmallNumber(value, significantDigits);
  const sign = value > 0 && showSign ? "+" : "";
  return `${sign}${formattedValue} ${tokenSymbol}`.trim();
}

function formatSmallNumber(value: number, significantDigits?: number): string {
  if (value === 0) return "0";

  // Case: specific precision requested
  if (significantDigits) {
    return formatWithSignificantDigits(value, significantDigits);
  }

  // Case: extremely small number
  if (Math.abs(value) < 1e-10) {
    return convertScientificToDecimal(value.toExponential());
  }

  // Case: small number but not extremely small
  return formatSmallButNotTinyNumber(value);
}

function formatWithSignificantDigits(value: number, digits: number): string {
  const precisionStr = value.toPrecision(digits);
  if (precisionStr.includes("e")) {
    return convertScientificToDecimal(precisionStr);
  }
  return precisionStr;
}

function convertScientificToDecimal(scientificNotation: string): string {
  const isNegative = scientificNotation.startsWith("-");
  const notation = isNegative ? scientificNotation.slice(1) : scientificNotation;
  const [mantissa, exponent] = notation.split("e");
  const exponentValue = parseInt(exponent);

  if (exponentValue < 0) {
    const absExponent = Math.abs(exponentValue);
    const cleanMantissa = mantissa.replace(".", "");
    const decimalString = "0." + "0".repeat(absExponent - 1) + cleanMantissa;
    return (isNegative ? "-" : "") + decimalString;
  }

  const [base, exp] = scientificNotation.split("e+");
  const num = parseFloat(base);
  const power = parseInt(exp, 10);
  let result = num;
  for (let i = 0; i < power; i++) {
    result *= 10;
  }
  return result.toString();
}

function formatSmallButNotTinyNumber(value: number): string {
  let tempValue = value;
  let decimalPlaces = 0;

  while (tempValue !== 0 && Math.abs(tempValue) < 1) {
    tempValue *= 10;
    decimalPlaces++;
  }

  const formatted = value.toFixed(decimalPlaces + 2);

  // Remove trailing zeros and decimal point if there are no decimals
  return formatted.replace(/\.?0+$/, "");
}

function formatRegularNumberWithSuffix(
  value: number,
  decimals: number,
  compact: boolean,
  showSign: boolean,
  suffix: string,
  minimumFractionDigits: number
): string {
  const sign = showSign && value > 0 ? "+" : "";

  // It is required to truncate the value to the number of decimals
  // because 149.99 is rounded as 150.00
  const factor = Math.pow(10, decimals);
  const truncatedValue = Math.trunc(value * factor) / factor;

  const formatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: minimumFractionDigits,
    notation: compact ? "compact" : "standard",
  });

  return `${sign}${formatter.format(truncatedValue)}${suffix}`;
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

function formatRegularNumberAsToken(value: number, decimals: number, tokenSymbol: string, compact: boolean, showSign: boolean): string {
  const sign = showSign && value > 0 ? "+" : "";

  const formatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
    notation: compact ? "compact" : "standard",
  });

  return `${sign}${formatter.format(value)} ${tokenSymbol}`.trim();
}

function formatTokenWithFullDecimals(amountStr = "", tokenSymbol: string, showSign: boolean): string {
  if (!amountStr) {
    return "";
  }
  const sign = showSign && +amountStr > 0 ? "+" : "";
  const parts = amountStr.split(".");

  const integerPart = new Intl.NumberFormat("en-US", {
    useGrouping: true,
    maximumFractionDigits: 0,
  }).format(parseInt(parts[0]));

  const decimalPart = parts.length > 1 ? `.${parts[1]}` : ".00";

  return `${sign}${integerPart}${decimalPart} ${tokenSymbol}`.trim();
}
