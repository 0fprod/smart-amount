import { formatCurrency } from '../../src/formatters/currency';
import { COMMON_LOCALE_CURRENCIES } from '../../src/constants';

// Helper function to normalize spaces for testing
function normalizeSpaces(str: string): string {
  return str.replace(/\u00A0/g, ' '); // Replace non-breaking space with normal space
}

describe('formatCurrency', () => {
  describe('basic currency formatting', () => {
    it('formats USD correctly', () => {
      expect(formatCurrency(1234.56, 2, false, false, undefined, COMMON_LOCALE_CURRENCIES.USD_US)).toBe('$1,234.56');
    });

    it('formats EUR with US locale', () => {
      expect(formatCurrency(1234.56, 2, false, false, undefined, COMMON_LOCALE_CURRENCIES.EUR_US)).toBe('€1,234.56');
    });

    it('formats EUR with German locale', () => {
      const result = formatCurrency(1234.56, 2, false, false, undefined, COMMON_LOCALE_CURRENCIES.EUR_DE);
      expect(normalizeSpaces(result)).toBe('1.234,56 €');
    });

    it('formats GBP with UK locale', () => {
      expect(formatCurrency(1234.56, 2, false, false, undefined, COMMON_LOCALE_CURRENCIES.GBP_GB)).toBe('£1,234.56');
    });

    it('formats zero correctly', () => {
      expect(formatCurrency(0, 2, false, false, undefined, COMMON_LOCALE_CURRENCIES.USD_US)).toBe('$0.00');
      expect(formatCurrency(0, 0, false, false, undefined, COMMON_LOCALE_CURRENCIES.USD_US)).toBe('$0');
    });
  });

  describe('compact notation', () => {
    it('formats with compact notation', () => {
      expect(formatCurrency(1234567, 2, true, false, undefined, COMMON_LOCALE_CURRENCIES.USD_US)).toBe('$1.23M');
      expect(formatCurrency(1234567, 2, true, false, undefined, COMMON_LOCALE_CURRENCIES.EUR_US)).toBe('€1.23M');
    });
  });

  describe('sign display', () => {
    it('shows positive sign when requested', () => {
      expect(formatCurrency(1234.56, 2, false, true, undefined, COMMON_LOCALE_CURRENCIES.USD_US)).toBe('+$1,234.56');
    });

    it('shows negative sign correctly', () => {
      expect(formatCurrency(-1234.56, 2, false, true, undefined, COMMON_LOCALE_CURRENCIES.USD_US)).toBe('-$1,234.56');
    });
  });

  describe('decimal places', () => {
    it('respects decimal places', () => {
      expect(formatCurrency(1234.56, 0, false, false, undefined, COMMON_LOCALE_CURRENCIES.USD_US)).toBe('$1,235');
      expect(formatCurrency(1234.56, 3, false, false, undefined, COMMON_LOCALE_CURRENCIES.USD_US)).toBe('$1,234.560');
    });
  });

  describe('small numbers', () => {
    it('handles small numbers correctly', () => {
      expect(formatCurrency(0.0000123, 2, false, false, undefined, COMMON_LOCALE_CURRENCIES.USD_US)).toBe('$0.0000123');
    });

    it('handles small numbers with significant digits', () => {
      expect(formatCurrency(0.0000123, 2, false, false, 2, COMMON_LOCALE_CURRENCIES.USD_US)).toBe('$0.000012');
    });
  });

  describe('multi-currency support', () => {
    it('formats AED correctly', () => {
      const result = formatCurrency(1234.56, 2, false, false, undefined, COMMON_LOCALE_CURRENCIES.AED_US);
      expect(normalizeSpaces(result)).toBe('AED 1,234.56');
    });

    it('formats INR correctly', () => {
      expect(formatCurrency(1234.56, 2, false, false, undefined, COMMON_LOCALE_CURRENCIES.INR_US)).toBe('₹1,234.56');
    });

    it('formats NGN correctly', () => {
      const result = formatCurrency(1234.56, 2, false, false, undefined, COMMON_LOCALE_CURRENCIES.NGN_US);
      expect(normalizeSpaces(result)).toBe('NGN 1,234.56');
    });
  });
});
