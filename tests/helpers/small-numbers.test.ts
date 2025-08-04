import { formatSmallNumber } from '../../src/helpers/small-numbers';

describe('formatSmallNumber', () => {
  describe('basic formatting', () => {
    it('formats zero correctly', () => {
      expect(formatSmallNumber(0)).toBe('0');
    });

    it('formats normal small numbers', () => {
      expect(formatSmallNumber(0.001)).toBe('0.001');
      expect(formatSmallNumber(0.123)).toBe('0.123');
    });
  });

  describe('significant digits', () => {
    it('respects significant digits', () => {
      expect(formatSmallNumber(0.0000123, 2)).toBe('0.000012');
      expect(formatSmallNumber(0.0000123, 3)).toBe('0.0000123');
    });

    it('handles scientific notation with significant digits', () => {
      expect(formatSmallNumber(1e-20, 2)).toBe('0.000000000000000000010');
    });
  });

  describe('extremely small numbers', () => {
    it('handles extremely small numbers', () => {
      expect(formatSmallNumber(1e-20)).toBe('0.00000000000000000001');
      expect(formatSmallNumber(1e-15)).toBe('0.000000000000001');
    });
  });

  describe('negative numbers', () => {
    it('handles negative small numbers', () => {
      expect(formatSmallNumber(-0.001)).toBe('-0.001');
      expect(formatSmallNumber(-0.0000123, 2)).toBe('-0.000012');
    });
  });
});
