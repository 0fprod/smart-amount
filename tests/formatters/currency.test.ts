import { formatCurrency } from '../../src/formatters/currency';
import { normalizeSpaces } from '../normalzeSpace';

describe('formatCurrency', () => {
  describe('basic formatting', () => {
    it('should format USD correctly', () => {
      expect(formatCurrency(1234.56, 2, false, false, undefined, { locale: 'en-US', currency: 'USD' })).toBe('$1,234.56');
    });

    it('should format EUR with US locale', () => {
      expect(formatCurrency(1234.56, 2, false, false, undefined, { locale: 'en-US', currency: 'EUR' })).toBe('€1,234.56');
    });

    it('should format EUR with German locale', () => {
      const result = formatCurrency(1234.56, 2, false, false, undefined, { locale: 'de-DE', currency: 'EUR' });
      expect(normalizeSpaces(result)).toBe('1.234,56 €');
    });

    it('should format GBP with UK locale', () => {
      expect(formatCurrency(1234.56, 2, false, false, undefined, { locale: 'en-GB', currency: 'GBP' })).toBe('£1,234.56');
    });
  });

  describe('zero values', () => {
    it('should format zero with decimals', () => {
      expect(formatCurrency(0, 2, false, false, undefined, { locale: 'en-US', currency: 'USD' })).toBe('$0.00');
    });

    it('should format zero without decimals', () => {
      expect(formatCurrency(0, 0, false, false, undefined, { locale: 'en-US', currency: 'USD' })).toBe('$0');
    });
  });

  describe('compact notation', () => {
    it('should format large numbers in compact notation', () => {
      expect(formatCurrency(1234567, 2, true, false, undefined, { locale: 'en-US', currency: 'USD' })).toBe('$1.23M');
    });

    it('should format EUR in compact notation', () => {
      expect(formatCurrency(1234567, 2, true, false, undefined, { locale: 'en-US', currency: 'EUR' })).toBe('€1.23M');
    });
  });

  describe('sign display', () => {
    it('should show positive sign when requested', () => {
      expect(formatCurrency(1234.56, 2, false, true, undefined, { locale: 'en-US', currency: 'USD' })).toBe('+$1,234.56');
    });

    it('should show negative sign correctly', () => {
      expect(formatCurrency(-1234.56, 2, false, true, undefined, { locale: 'en-US', currency: 'USD' })).toBe('-$1,234.56');
    });
  });

  describe('decimal handling', () => {
    it('should round to specified decimals', () => {
      expect(formatCurrency(1234.56, 0, false, false, undefined, { locale: 'en-US', currency: 'USD' })).toBe('$1,235');
    });

    it('should show more decimals when requested', () => {
      expect(formatCurrency(1234.56, 3, false, false, undefined, { locale: 'en-US', currency: 'USD' })).toBe('$1,234.560');
    });
  });

  describe('small numbers', () => {
    it('should format very small numbers', () => {
      expect(formatCurrency(0.0000123, 2, false, false, undefined, { locale: 'en-US', currency: 'USD' })).toBe('$0.0000123');
    });

    it('should format small numbers with significant digits', () => {
      expect(formatCurrency(0.0000123, 2, false, false, 2, { locale: 'en-US', currency: 'USD' })).toBe('$0.000012');
    });
  });

  describe('other currencies', () => {
    it('should format AED correctly', () => {
      const result = formatCurrency(1234.56, 2, false, false, undefined, { locale: 'en-US', currency: 'AED' });
      expect(normalizeSpaces(result)).toBe('AED 1,234.56');
    });

    it('should format INR correctly', () => {
      expect(formatCurrency(1234.56, 2, false, false, undefined, { locale: 'en-US', currency: 'INR' })).toBe('₹1,234.56');
    });

    it('should format NGN correctly', () => {
      const result = formatCurrency(1234.56, 2, false, false, undefined, { locale: 'en-US', currency: 'NGN' });
      expect(normalizeSpaces(result)).toBe('NGN 1,234.56');
    });
  });
});
