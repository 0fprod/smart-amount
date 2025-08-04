export function parseInputValue(amount: number | string): number {
  return typeof amount === 'string' ? parseFloat(amount) : amount;
}

export function determineIfCompactShouldBeUsed(value: number, compact: boolean, autoCompact: boolean, compactThreshold: number): boolean {
  return compact || (autoCompact && Math.abs(value) >= compactThreshold);
}

export function formatNaN(type: string, tokenSymbol: string): string {
  return type === 'currency' ? '$NaN' : type === 'percentage' ? 'NaN%' : `NaN ${tokenSymbol}`.trim();
}

export function isSmallNumber(value: number): boolean {
  return Math.abs(value) < 0.01;
}

export function shouldShowDecimals(value: number, decimals: number): number {
  const hasDecimals = value % 1 !== 0;
  return hasDecimals ? decimals : 0;
}
