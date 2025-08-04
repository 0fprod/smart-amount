import { isSmallNumber, shouldShowDecimals } from "../utils";
import { formatSmallNumber } from "../helpers/small-numbers";

export function formatPercentage(
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
