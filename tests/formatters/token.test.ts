import { formatToken } from "../../src/formatters/token";

const SampleTokens = {
  WBTC: "WBTC",
  WETH: "WETH",
};

describe("formatToken", () => {
  describe("basic token formatting", () => {
    it("formats without symbol", () => {
      expect(formatToken(123456789, 2, "", false, false)).toBe("123,456,789.00");
    });

    it("formats with symbol", () => {
      expect(formatToken(123456789, 2, SampleTokens.WBTC, false, false)).toBe(`123,456,789.00 ${SampleTokens.WBTC}`);
    });

    it("formats zero correctly", () => {
      expect(formatToken(0, 2, SampleTokens.WBTC, false, false)).toBe(`0.00 ${SampleTokens.WBTC}`);
      expect(formatToken(0, 0, SampleTokens.WBTC, false, false)).toBe(`0 ${SampleTokens.WBTC}`);
    });
  });

  describe("compact notation", () => {
    it("formats with compact notation", () => {
      expect(formatToken(1234567, 2, SampleTokens.WBTC, true, false)).toBe(`1.23M ${SampleTokens.WBTC}`);
      expect(formatToken(12345, 2, SampleTokens.WBTC, true, false)).toBe(`12.35K ${SampleTokens.WBTC}`);
    });
  });

  describe("sign display", () => {
    it("shows positive sign when requested", () => {
      expect(formatToken(10.5, 2, SampleTokens.WBTC, false, true)).toBe(`+10.50 ${SampleTokens.WBTC}`);
    });

    it("shows negative sign correctly", () => {
      expect(formatToken(-10.5, 2, SampleTokens.WBTC, false, true)).toBe(`-10.50 ${SampleTokens.WBTC}`);
    });
  });

  describe("decimal places", () => {
    it("respects decimal places", () => {
      expect(formatToken(10.5, 0, SampleTokens.WBTC, false, false)).toBe(`11 ${SampleTokens.WBTC}`);
      expect(formatToken(10.5, 3, SampleTokens.WBTC, false, false)).toBe(`10.500 ${SampleTokens.WBTC}`);
    });
  });

  describe("small numbers", () => {
    it("handles small numbers correctly", () => {
      expect(formatToken(0.0000123, 2, SampleTokens.WETH, false, false)).toBe(`0.0000123 ${SampleTokens.WETH}`);
    });

    it("handles small numbers with significant digits", () => {
      expect(formatToken(0.0000123, 2, SampleTokens.WETH, false, false, 2)).toBe(`0.000012 ${SampleTokens.WETH}`);
    });

    it("handles rounded small numbers", () => {
      expect(formatToken(0.0000123, 2, SampleTokens.WETH, false, false, undefined, true)).toBe(`0.00 ${SampleTokens.WETH}`);
    });
  });

  describe("full decimals", () => {
    it("preserves full precision when requested", () => {
      expect(formatToken(123456789, 2, SampleTokens.WETH, false, false, undefined, false, true, "123456789.123456789")).toBe(
        `123,456,789.123456789 ${SampleTokens.WETH}`
      );
    });

    it("handles full decimals with sign", () => {
      expect(formatToken(123456789, 2, SampleTokens.WETH, false, true, undefined, false, true, "123456789.123456789")).toBe(
        `+123,456,789.123456789 ${SampleTokens.WETH}`
      );
    });
  });
});
