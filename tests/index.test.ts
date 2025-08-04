import { format, COMMON_LOCALE_CURRENCIES } from "../src";

const SampleTokens = {
  WBTC: "WBTC",
  WETH: "WETH",
};

// Helper function to normalize spaces for testing
function normalizeSpaces(str: string): string {
  return str.replace(/\u00A0/g, " "); // Replace non-breaking space with normal space
}

describe("format - Integration Tests", () => {
  describe("API integration", () => {
    it("formats currency with default options", () => {
      expect(format(1234.56, { type: "currency" })).toBe("$1,234.56");
    });

    it("formats percentage with default options", () => {
      expect(format(25.5, { type: "percentage" })).toBe("25.50%");
    });

    it("formats token with default options", () => {
      expect(format(1234.56, { type: "token", tokenSymbol: SampleTokens.WBTC })).toBe(`1,234.56 ${SampleTokens.WBTC}`);
    });

    it("formats raw with default options", () => {
      expect(format(1234.56, { type: "raw" })).toBe("1234.56");
    });
  });

  describe("multi-currency integration", () => {
    it("formats USD correctly", () => {
      expect(format(1234.56, { localeCurrency: COMMON_LOCALE_CURRENCIES.USD_US })).toBe("$1,234.56");
    });

    it("formats EUR with different locales", () => {
      expect(format(1234.56, { localeCurrency: COMMON_LOCALE_CURRENCIES.EUR_US })).toBe("€1,234.56");
      const result = format(1234.56, { localeCurrency: COMMON_LOCALE_CURRENCIES.EUR_DE });
      expect(normalizeSpaces(result)).toBe("1.234,56 €");
    });

    it("formats GBP correctly", () => {
      expect(format(1234.56, { localeCurrency: COMMON_LOCALE_CURRENCIES.GBP_GB })).toBe("£1,234.56");
    });
  });

  describe("edge cases integration", () => {
    it("handles undefined input", () => {
      expect(format(undefined as any)).toBe("");
    });

    it("handles null input", () => {
      expect(format(null as any)).toBe("");
    });

    it("handles NaN input", () => {
      expect(format(NaN)).toBe("$NaN");
    });

    it("handles invalid string input", () => {
      expect(format("abc", { type: "currency" })).toBe("$NaN");
      expect(format("abc", { type: "percentage" })).toBe("NaN%");
      expect(format("abc", { type: "token", tokenSymbol: SampleTokens.WBTC })).toBe(`NaN ${SampleTokens.WBTC}`);
    });
  });

  describe("string input integration", () => {
    it("handles string numbers correctly", () => {
      expect(format("1234.56", { type: "currency" })).toBe("$1,234.56");
      expect(format("25.5", { type: "percentage" })).toBe("25.50%");
      expect(format("1234.56", { type: "token", tokenSymbol: SampleTokens.WBTC })).toBe(`1,234.56 ${SampleTokens.WBTC}`);
    });
  });

  describe("options integration", () => {
    it("handles compact notation", () => {
      expect(format(1234567, { type: "currency", compact: true })).toBe("$1.23M");
      expect(format(1234567, { type: "percentage", compact: true })).toBe("1.23M%");
    });

    it("handles auto-compact", () => {
      expect(format(1234567, { type: "currency", autoCompact: true })).toBe("$1.23M");
      expect(format(1000, { type: "currency", autoCompact: true })).toBe("$1,000.00");
    });

    it("handles showSign", () => {
      expect(format(1234.56, { type: "currency", showSign: true })).toBe("+$1,234.56");
      expect(format(1234.56, { type: "percentage", showSign: true })).toBe("+1,234.56%");
    });

    it("handles custom decimals", () => {
      expect(format(1234.56, { type: "currency", decimals: 0 })).toBe("$1,235");
      expect(format(1234.56, { type: "percentage", decimals: 3 })).toBe("1,234.560%");
    });

    it("handles significant digits", () => {
      expect(format(0.0000123, { type: "currency", significantDigits: 2 })).toBe("$0.000012");
    });
  });
});
