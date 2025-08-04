import { formatPercentage } from '../../src/formatters/percentage';

describe('formatPercentage', () => {
  describe('basic percentage formatting', () => {
    it('formats whole numbers correctly', () => {
      expect(formatPercentage(25, 2, false, false)).toBe('25%');
      expect(formatPercentage(100, 2, false, false)).toBe('100%');
    });

    it('formats decimal numbers correctly', () => {
      expect(formatPercentage(25.5, 2, false, false)).toBe('25.50%');
      expect(formatPercentage(12.34, 2, false, false)).toBe('12.34%');
    });

    it('formats zero correctly', () => {
      expect(formatPercentage(0, 2, false, false)).toBe('0.00%');
      expect(formatPercentage(0, 0, false, false)).toBe('0%');
    });
  });

  describe('compact notation', () => {
    it('formats with compact notation', () => {
      expect(formatPercentage(1234567, 2, true, false)).toBe('1.23M%');
      expect(formatPercentage(12345, 2, true, false)).toBe('12.35K%');
    });
  });

  describe('sign display', () => {
    it('shows positive sign when requested', () => {
      expect(formatPercentage(25.5, 2, false, true)).toBe('+25.50%');
    });

    it('shows negative sign correctly', () => {
      expect(formatPercentage(-25.5, 2, false, true)).toBe('-25.50%');
    });
  });

  describe('decimal places', () => {
    it('respects decimal places', () => {
      expect(formatPercentage(25.5, 0, false, false)).toBe('25%');
      expect(formatPercentage(25.5, 3, false, false)).toBe('25.500%');
    });
  });

  describe('small numbers', () => {
    it('handles small numbers correctly', () => {
      expect(formatPercentage(0.0000123, 2, false, false)).toBe('0.0000123%');
    });

    it('handles small numbers with significant digits', () => {
      expect(formatPercentage(0.0000123, 2, false, false, 2)).toBe('0.000012%');
    });

    it('handles rounded small numbers', () => {
      expect(formatPercentage(0.0000123, 2, false, false, undefined, true)).toBe('0.00%');
    });
  });

  describe('truncation behavior', () => {
    it('truncates instead of rounding', () => {
      expect(formatPercentage(149.99, 2, false, false)).toBe('149.99%');
      expect(formatPercentage(149.999, 2, false, false)).toBe('149.99%');
    });
  });
});
