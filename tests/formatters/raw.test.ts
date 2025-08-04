import { formatRaw } from '../../src/formatters/raw';

describe('formatRaw', () => {
  describe('basic raw formatting', () => {
    it('formats zero correctly', () => {
      expect(formatRaw(0)).toBe('0');
    });

    it('formats normal numbers correctly', () => {
      expect(formatRaw(123456789)).toBe('123456789');
      expect(formatRaw(1234.56)).toBe('1234.56');
    });

    it('formats negative numbers correctly', () => {
      expect(formatRaw(-123456789)).toBe('-123456789');
      expect(formatRaw(-1234.56)).toBe('-1234.56');
    });
  });

  describe('small numbers', () => {
    it('handles small numbers correctly', () => {
      expect(formatRaw(0.00000000000000000001)).toBe('0.00000000000000000001');
      expect(formatRaw(0.0000123)).toBe('0.0000123');
    });

    it('handles extremely small numbers', () => {
      expect(formatRaw(1e-20)).toBe('0.00000000000000000001');
    });
  });
});
