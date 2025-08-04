import { parseInputValue, determineIfCompactShouldBeUsed, formatNaN, isSmallNumber, shouldShowDecimals } from '../../src/utils';

describe('utils', () => {
  describe('parseInputValue', () => {
    it('parses number correctly', () => {
      expect(parseInputValue(123.45)).toBe(123.45);
    });

    it('parses string correctly', () => {
      expect(parseInputValue('123.45')).toBe(123.45);
    });
  });

  describe('determineIfCompactShouldBeUsed', () => {
    it('returns true when compact is true', () => {
      expect(determineIfCompactShouldBeUsed(1000, true, false, 10000)).toBe(true);
    });

    it('returns true when autoCompact is true and value >= threshold', () => {
      expect(determineIfCompactShouldBeUsed(15000, false, true, 10000)).toBe(true);
    });

    it('returns false when autoCompact is true but value < threshold', () => {
      expect(determineIfCompactShouldBeUsed(5000, false, true, 10000)).toBe(false);
    });

    it('returns false when neither compact nor autoCompact is true', () => {
      expect(determineIfCompactShouldBeUsed(15000, false, false, 10000)).toBe(false);
    });
  });

  describe('formatNaN', () => {
    it('formats currency NaN', () => {
      expect(formatNaN('currency', '')).toBe('$NaN');
    });

    it('formats percentage NaN', () => {
      expect(formatNaN('percentage', '')).toBe('NaN%');
    });

    it('formats token NaN', () => {
      expect(formatNaN('token', 'BTC')).toBe('NaN BTC');
    });
  });

  describe('isSmallNumber', () => {
    it('returns true for small numbers', () => {
      expect(isSmallNumber(0.001)).toBe(true);
      expect(isSmallNumber(0.009)).toBe(true);
    });

    it('returns false for normal numbers', () => {
      expect(isSmallNumber(0.01)).toBe(false);
      expect(isSmallNumber(1)).toBe(false);
      expect(isSmallNumber(100)).toBe(false);
    });

    it('handles negative numbers', () => {
      expect(isSmallNumber(-0.001)).toBe(true);
      expect(isSmallNumber(-0.01)).toBe(false);
    });
  });

  describe('shouldShowDecimals', () => {
    it('returns decimals when value has decimal part', () => {
      expect(shouldShowDecimals(123.45, 2)).toBe(2);
      expect(shouldShowDecimals(123.45, 3)).toBe(3);
    });

    it('returns 0 when value is integer', () => {
      expect(shouldShowDecimals(123, 2)).toBe(0);
      expect(shouldShowDecimals(100, 3)).toBe(0);
    });

    it('handles zero', () => {
      expect(shouldShowDecimals(0, 2)).toBe(0);
    });
  });
});
