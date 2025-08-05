// Helper function to normalize spaces (Intl.NumberFormat uses non-breaking spaces)
export function normalizeSpaces(str: string): string {
  return str.replace(/\u00A0/g, ' ');
}
