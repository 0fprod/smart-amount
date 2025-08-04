import { isSmallNumber } from "../utils";
import { formatSmallNumber } from "../helpers/small-numbers";

export function formatToken(
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

function formatZeroAsToken(decimals: number, tokenSymbol: string): string {
  return `${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(0)} ${tokenSymbol}`.trim();
}

function formatSmallNumberAsToken(value: number, tokenSymbol: string, showSign: boolean, significantDigits?: number): string {
  const formattedValue = formatSmallNumber(value, significantDigits);
  const sign = value > 0 && showSign ? "+" : "";
  return `${sign}${formattedValue} ${tokenSymbol}`.trim();
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
