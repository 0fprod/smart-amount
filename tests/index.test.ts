import { format, COMMON_LOCALE_CURRENCIES } from "../src";

const SampleTokens = {
  WBTC: "WBTC",
  WETH: "WETH",
};

// Helper function to get actual format for testing
function getActualFormat(value: number, locale: string, currency: string): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

describe("formatAmount", () => {
  describe("formats numbers", () => {
    describe("to currency", () => {
      it("with USD symbol ($123,456,789.00)", () => {
        expect(format(123456789, { type: "currency" })).toBe("$123,456,789.00");
      });

      it("with USD symbol compact ($123.46M, $12.35K)", () => {
        expect(format(123456789, { type: "currency", compact: true })).toBe("$123.46M");
        expect(format(12345, { type: "currency", compact: true })).toBe("$12.35K");
      });

      it("with USD symbol compact auto ($123.46M, $12.35K, $1,000.00)", () => {
        expect(format(123456789, { type: "currency", autoCompact: true })).toBe("$123.46M");
        expect(format(12345, { type: "currency", autoCompact: true })).toBe("$12.35K");
        expect(format(1000, { type: "currency", autoCompact: true })).toBe("$1,000.00");
      });

      it("with small numbers ($0.0000123, $0.000000123)", () => {
        expect(format(0.0000123, { type: "currency" })).toBe("$0.0000123");
        expect(format(0.0000123, { type: "currency", rounded: true })).toBe("$0.0000123");
        expect(format(0.000000123, { type: "currency" })).toBe("$0.000000123");
      });

      it("with small numbers and significant digits ($0.000012, $0.00000012)", () => {
        expect(format(0.0000123, { type: "currency", significantDigits: 2 })).toBe("$0.000012");
        expect(format(0.000000123, { type: "currency", significantDigits: 2 })).toBe("$0.00000012");
      });
    });

    describe("to percentage", () => {
      it("with standard format (123,456,789%, 25%, 25.50%)", () => {
        expect(format(123456789, { type: "percentage" })).toBe("123,456,789%");
        expect(format(25, { type: "percentage" })).toBe("25%");
        expect(format(25.5, { type: "percentage" })).toBe("25.50%");
      });

      it("with compact format (123.46M%, 12.35K%, 25%)", () => {
        expect(format(123456789, { type: "percentage", compact: true })).toBe("123.46M%");
        expect(format(12345, { type: "percentage", compact: true })).toBe("12.35K%");
        expect(format(25, { type: "percentage", compact: true })).toBe("25%");
      });

      it("with compact auto format (123.46M%, 12.35K%, 1,000%)", () => {
        expect(format(123456789, { type: "percentage", autoCompact: true })).toBe("123.46M%");
        expect(format(12345, { type: "percentage", autoCompact: true })).toBe("12.35K%");
        expect(format(1000, { type: "percentage", autoCompact: true })).toBe("1,000%");
      });
    });

    describe("to token", () => {
      it("without symbol (123,456,789.00)", () => {
        expect(format(123456789, { type: "token" })).toBe("123,456,789.00");
      });

      it("with symbol (123,456,789.00 WBTC)", () => {
        expect(format(123456789, { type: "token", tokenSymbol: SampleTokens.WBTC })).toBe(`123,456,789.00 ${SampleTokens.WBTC}`);
      });

      it("with symbol compact (123.46M WBTC)", () => {
        expect(format(123456789, { type: "token", tokenSymbol: SampleTokens.WBTC, compact: true })).toBe(`123.46M ${SampleTokens.WBTC}`);
      });

      it("with symbol compact auto (123.46M WBTC, 1,000.00 WBTC)", () => {
        expect(format(123456789, { type: "token", tokenSymbol: SampleTokens.WBTC, autoCompact: true })).toBe(
          `123.46M ${SampleTokens.WBTC}`
        );
        expect(format(1000, { type: "token", tokenSymbol: SampleTokens.WBTC, autoCompact: true })).toBe(`1,000.00 ${SampleTokens.WBTC}`);
      });

      it("with small numbers (0.0000123 ETH, 0.000000123 ETH)", () => {
        expect(format(0.0000123, { type: "token", tokenSymbol: SampleTokens.WETH })).toBe(`0.0000123 ${SampleTokens.WETH}`);
        expect(format(0.000000123, { type: "token", tokenSymbol: SampleTokens.WETH })).toBe(`0.000000123 ${SampleTokens.WETH}`);
      });

      it("with small numbers and significant digits (0.000012 ETH, 0.00000012 ETH)", () => {
        expect(format(0.0000123, { type: "token", tokenSymbol: SampleTokens.WETH, significantDigits: 2 })).toBe(
          `0.000012 ${SampleTokens.WETH}`
        );
        expect(format(0.000000123, { type: "token", tokenSymbol: SampleTokens.WETH, significantDigits: 2 })).toBe(
          `0.00000012 ${SampleTokens.WETH}`
        );
      });
    });

    describe("to raw", () => {
      it("with 0 (0)", () => {
        expect(format(0, { type: "raw" })).toBe("0");
      });

      it("with small number (0.00000000000000000001)", () => {
        expect(format(0.00000000000000000001, { type: "raw" })).toBe("0.00000000000000000001");
      });

      it("with normal number (123456789)", () => {
        expect(format(123456789, { type: "raw" })).toBe("123456789");
      });
    });
  });

  describe("formats strings", () => {
    describe("to currency", () => {
      it("with USD symbol ($123,456,789.00)", () => {
        expect(format("123456789", { type: "currency" })).toBe("$123,456,789.00");
      });

      it("with USD symbol compact ($123.46M, $12.35K)", () => {
        expect(format("123456789", { type: "currency", compact: true })).toBe("$123.46M");
        expect(format("12345", { type: "currency", compact: true })).toBe("$12.35K");
      });

      it("with USD symbol compact auto ($123.46M, $12.35K, $1,000.00)", () => {
        expect(format("123456789", { type: "currency", autoCompact: true })).toBe("$123.46M");
        expect(format("12345", { type: "currency", autoCompact: true })).toBe("$12.35K");
        expect(format("1000", { type: "currency", autoCompact: true })).toBe("$1,000.00");
      });

      it("with small numbers ($0.0000123, $0.000000123)", () => {
        expect(format("0.0000123", { type: "currency" })).toBe("$0.0000123");
        expect(format("0.000000123", { type: "currency" })).toBe("$0.000000123");
      });

      it("with small numbers and significant digits ($0.000012, $0.00000012)", () => {
        expect(format("0.0000123", { type: "currency", significantDigits: 2 })).toBe("$0.000012");
        expect(format("0.000000123", { type: "currency", significantDigits: 2 })).toBe("$0.00000012");
      });
    });

    describe("to percentage", () => {
      it("with standard format (123,456,789%, 25%, 25.50%)", () => {
        expect(format("123456789", { type: "percentage" })).toBe("123,456,789%");
        expect(format(25, { type: "percentage" })).toBe("25%");
        expect(format(25.5, { type: "percentage" })).toBe("25.50%");
      });

      it("with compact format (123.46M%, 12.35K%, 25%)", () => {
        expect(format("123456789", { type: "percentage", compact: true })).toBe("123.46M%");
        expect(format("12345", { type: "percentage", compact: true })).toBe("12.35K%");
        expect(format(25, { type: "percentage", compact: true })).toBe("25%");
      });

      it("with compact auto format (123.46M%, 12.35K%, 1,000%)", () => {
        expect(format("123456789", { type: "percentage", autoCompact: true })).toBe("123.46M%");
        expect(format("12345", { type: "percentage", autoCompact: true })).toBe("12.35K%");
        expect(format("1000", { type: "percentage", autoCompact: true })).toBe("1,000%");
      });

      it("with rounded percentage (123.46M%, 12.35K%, 1,000%)", () => {
        expect(format("150", { type: "percentage", rounded: true })).toBe("150%");
        expect(format("0.000005", { type: "percentage", rounded: true })).toBe("0.00%");
      });

      it("with not rounded percentage (149.999 149.91879872934)", () => {
        expect(format(149.9906094190047, { type: "percentage" })).toBe("149.99%");
        expect(format("149.9906094190047", { type: "percentage", rounded: false, decimals: 2 })).toBe("149.99%");
        expect(format("149.9906094190047", { type: "percentage", rounded: false, decimals: 1 })).toBe("149.9%");
        expect(format("149.9906094190047", { type: "percentage" })).toBe("149.99%");
        expect(format("149.9901094190047", { type: "percentage" })).toBe("149.99%");
        expect(format("149.9996094190047", { type: "percentage" })).toBe("149.99%");
        expect(format("150.000054808431", { type: "percentage", rounded: false, decimals: 2 })).toBe("150.00%");
        expect(format(150.0000548084, { type: "percentage", rounded: false, decimals: 2 })).toBe("150.00%");
        expect(format("160", { type: "percentage", rounded: false, decimals: 0 })).toBe("160%");
        expect(format("160.00", { type: "percentage", rounded: false, decimals: 1, fullDecimals: false })).toBe("160%");
        expect(format("150.1", { type: "percentage", rounded: false, decimals: 2 })).toBe("150.10%");
        expect(format("150.21", { type: "percentage", rounded: false, decimals: 2 })).toBe("150.21%");
        expect(format("1.12", { type: "percentage", rounded: false, decimals: 2 })).toBe("1.12%");
        expect(format("1.1", { type: "percentage", rounded: false, decimals: 2 })).toBe("1.10%");
        expect(format("1.00", { type: "percentage", rounded: false, decimals: 2 })).toBe("1%");
        expect(format("0.00", { type: "percentage", rounded: false, decimals: 2 })).toBe("0.00%");
        expect(format("0.1", { type: "percentage", rounded: false, decimals: 2 })).toBe("0.10%");
        expect(format("0.98", { type: "percentage", rounded: false, decimals: 2 })).toBe("0.98%");
        expect(format("29.98", { type: "percentage", rounded: false, decimals: 2 })).toBe("29.98%");
        expect(format("29.8", { type: "percentage", rounded: false, decimals: 2 })).toBe("29.80%");
        expect(format("29.0", { type: "percentage", rounded: false, decimals: 2 })).toBe("29%");
        expect(format("29", { type: "percentage", rounded: false, decimals: 2 })).toBe("29%");
        expect(format("29", { type: "percentage", rounded: false, decimals: 0 })).toBe("29%");
        expect(format("29", { type: "percentage", rounded: false, decimals: 1 })).toBe("29%");
        expect(format("3450", { type: "percentage", rounded: false, decimals: 1 })).toBe("3,450%");
        expect(format("2972394723", { type: "percentage", rounded: false, decimals: 1 })).toBe("2,972,394,723%");
        expect(format("0", { type: "percentage", rounded: false, decimals: 1 })).toBe("0.0%");
      });
    });

    describe("to token", () => {
      it("without symbol (123,456,789.00)", () => {
        expect(format("123456789", { type: "token" })).toBe("123,456,789.00");
      });

      it("with symbol (123,456,789.00 BTC)", () => {
        expect(format("123456789", { type: "token", tokenSymbol: SampleTokens.WBTC })).toBe(`123,456,789.00 ${SampleTokens.WBTC}`);
      });

      it("with symbol compact (123.46M BTC)", () => {
        expect(format("123456789", { type: "token", tokenSymbol: SampleTokens.WBTC, compact: true })).toBe(`123.46M ${SampleTokens.WBTC}`);
      });

      it("with symbol compact auto (123.46M BTC, 1,000.00 BTC)", () => {
        expect(format("123456789", { type: "token", tokenSymbol: SampleTokens.WBTC, autoCompact: true })).toBe(
          `123.46M ${SampleTokens.WBTC}`
        );
        expect(format("1000", { type: "token", tokenSymbol: SampleTokens.WBTC, autoCompact: true })).toBe(`1,000.00 ${SampleTokens.WBTC}`);
      });

      it("with small numbers (0.0000123 ETH, 0.000000123 ETH)", () => {
        expect(format("0.0000123", { type: "token", tokenSymbol: SampleTokens.WETH })).toBe(`0.0000123 ${SampleTokens.WETH}`);
        expect(format("0.000000123", { type: "token", tokenSymbol: SampleTokens.WETH })).toBe(`0.000000123 ${SampleTokens.WETH}`);
      });

      it("with small numbers and significant digits (0.000012 ETH, 0.00000012 ETH)", () => {
        expect(format("0.0000123", { type: "token", tokenSymbol: SampleTokens.WETH, significantDigits: 2 })).toBe(
          `0.000012 ${SampleTokens.WETH}`
        );
        expect(format("0.000000123", { type: "token", tokenSymbol: SampleTokens.WETH, significantDigits: 2 })).toBe(
          `0.00000012 ${SampleTokens.WETH}`
        );
      });
    });
  });

  describe("handles edge cases", () => {
    it("handles special values ($NaN, $∞, -$∞)", () => {
      expect(format(NaN)).toBe("$NaN");
      expect(format(Infinity)).toBe("$∞");
      expect(format(-Infinity)).toBe("-$∞");
      expect(format(undefined as any)).toBe("");
      expect(format(null as any)).toBe("");
      expect(format(BigInt(0) as any)).toBe("");
    });

    it("handles extremely small positive values ($0.00000000000000000001)", () => {
      expect(format(1e-20, { type: "currency" })).toBe("$0.00000000000000000001");
    });

    it("handles extremely small negative values ($0.00000000000000000001)", () => {
      expect(format(-1e-20, { type: "currency" })).toBe("-$0.00000000000000000001");
    });

    it("handles token amount with many decimals (only for token passed as string to not lose precision)", () => {
      expect(format("123456789.123456789", { type: "token", tokenSymbol: SampleTokens.WETH, fullDecimals: true })).toBe(
        `123,456,789.123456789 ${SampleTokens.WETH}`
      );
      expect(format("1", { type: "token", tokenSymbol: SampleTokens.WETH, fullDecimals: true })).toBe(`1.00 ${SampleTokens.WETH}`);
    });

    it("handles zero with different options ($0.00, $0.00, $0, 0%, 0.00 BTC)", () => {
      expect(format(0, { type: "currency" })).toBe("$0.00");
      expect(format(0, { type: "currency", significantDigits: 2 })).toBe("$0.00");
      expect(format(0, { type: "currency", decimals: 0 })).toBe("$0");
      expect(format(0, { type: "percentage" })).toBe("0.00%");
      expect(format(0, { type: "token", tokenSymbol: SampleTokens.WBTC })).toBe(`0.00 ${SampleTokens.WBTC}`);
    });

    it("handles invalid string inputs ($NaN, NaN%, NaN BTC)", () => {
      expect(format("abc", { type: "currency" })).toBe("$NaN");
      expect(format("abc", { type: "percentage" })).toBe("NaN%");
      expect(format("abc", { type: "token", tokenSymbol: SampleTokens.WBTC })).toBe(`NaN ${SampleTokens.WBTC}`);
      expect(format("123abc", { type: "currency" })).toBe("$NaN");
      expect(format("123abc", { type: "percentage" })).toBe("NaN%");
      expect(format("123abc", { type: "token", tokenSymbol: SampleTokens.WBTC })).toBe(`NaN ${SampleTokens.WBTC}`);
    });
  });

  describe("handles sign display", () => {
    it("shows sign for positive currency values when requested (+$123.45, $123.45, -$123.45, -$123.45, $0.00)", () => {
      expect(format(123.45, { type: "currency", showSign: true })).toBe("+$123.45");
      expect(format(123.45, { type: "currency" })).toBe("$123.45");
      expect(format(-123.45, { type: "currency", showSign: true })).toBe("-$123.45");
      expect(format(-123.45, { type: "currency" })).toBe("-$123.45");
      expect(format(0, { type: "currency", showSign: true })).toBe("$0.00");
    });

    it("shows sign for positive percentage values when requested (+50%, 50%, -50%, -50%, 0%)", () => {
      expect(format(50, { type: "percentage", showSign: true })).toBe("+50%");
      expect(format(50, { type: "percentage" })).toBe("50%");
      expect(format(-50, { type: "percentage", showSign: true })).toBe("-50%");
      expect(format(-50, { type: "percentage" })).toBe("-50%");
      expect(format(0, { type: "percentage", showSign: true })).toBe("0.00%");
    });

    it("shows sign for positive token values when requested (+10.50 BTC, 10.50 BTC, -10.50 BTC, -10.50 BTC, 0.00 BTC)", () => {
      expect(format(10.5, { type: "token", tokenSymbol: SampleTokens.WBTC, showSign: true })).toBe(`+10.50 ${SampleTokens.WBTC}`);
      expect(format(10.5, { type: "token", tokenSymbol: SampleTokens.WBTC })).toBe(`10.50 ${SampleTokens.WBTC}`);
      expect(format(-10.5, { type: "token", tokenSymbol: SampleTokens.WBTC, showSign: true })).toBe(`-10.50 ${SampleTokens.WBTC}`);
      expect(format(-10.5, { type: "token", tokenSymbol: SampleTokens.WBTC })).toBe(`-10.50 ${SampleTokens.WBTC}`);
      expect(format(0, { type: "token", tokenSymbol: SampleTokens.WBTC, showSign: true })).toBe(`0.00 ${SampleTokens.WBTC}`);
    });

    it("works with compact notation (+$1.23M, -$1.23M, +1.23M%, +1.23M BTC)", () => {
      expect(format(1234567, { type: "currency", compact: true, showSign: true })).toBe("+$1.23M");
      expect(format(-1234567, { type: "currency", compact: true, showSign: true })).toBe("-$1.23M");
      expect(format(1234567, { type: "percentage", compact: true, showSign: true })).toBe("+1.23M%");
      expect(format(1234567, { type: "token", tokenSymbol: SampleTokens.WBTC, compact: true, showSign: true })).toBe(
        `+1.23M ${SampleTokens.WBTC}`
      );
    });

    it("works with small numbers (+$0.0000123, -$0.0000123, +0.0000123%, +0.0000123 ETH)", () => {
      expect(format(0.0000123, { type: "currency", showSign: true })).toBe("+$0.0000123");
      expect(format(-0.0000123, { type: "currency", showSign: true })).toBe("-$0.0000123");
      expect(format(0.0000123, { type: "percentage", showSign: true })).toBe("+0.0000123%");
      expect(format(0.0000123, { type: "token", tokenSymbol: SampleTokens.WETH, showSign: true })).toBe(`+0.0000123 ${SampleTokens.WETH}`);
      expect(format(0.009, { type: "token", tokenSymbol: SampleTokens.WBTC, showSign: true })).toBe(`+0.009 ${SampleTokens.WBTC}`);
    });
  });

  describe("multi-currency support", () => {
    it("formats USD correctly", () => {
      expect(format(1234.56, { localeCurrency: COMMON_LOCALE_CURRENCIES.USD_US })).toBe("$1,234.56");
    });

    it("formats GBP correctly", () => {
      expect(format(1234.56, { localeCurrency: COMMON_LOCALE_CURRENCIES.GBP_GB })).toBe("£1,234.56");
    });

    it("formats EUR in different locales", () => {
      expect(format(1234.56, { localeCurrency: COMMON_LOCALE_CURRENCIES.EUR_US })).toBe("€1,234.56");

      // Get actual format for German locale
      const actualEUR_DE = getActualFormat(1234.56, "de-DE", "EUR");
      expect(format(1234.56, { localeCurrency: COMMON_LOCALE_CURRENCIES.EUR_DE })).toBe(actualEUR_DE);

      // Get actual format for Spanish locale
      const actualEUR_ES = getActualFormat(1234.56, "es-ES", "EUR");
      expect(format(1234.56, { localeCurrency: COMMON_LOCALE_CURRENCIES.EUR_ES })).toBe(actualEUR_ES);

      // Get actual format for French locale
      const actualEUR_FR = getActualFormat(1234.56, "fr-FR", "EUR");
      expect(format(1234.56, { localeCurrency: COMMON_LOCALE_CURRENCIES.EUR_FR })).toBe(actualEUR_FR);

      // Get actual format for Italian locale
      const actualEUR_IT = getActualFormat(1234.56, "it-IT", "EUR");
      expect(format(1234.56, { localeCurrency: COMMON_LOCALE_CURRENCIES.EUR_IT })).toBe(actualEUR_IT);
    });

    it("formats AED correctly", () => {
      // Get actual format for AED
      const actualAED_US = getActualFormat(1234.56, "en-US", "AED");
      expect(format(1234.56, { localeCurrency: COMMON_LOCALE_CURRENCIES.AED_US })).toBe(actualAED_US);
    });

    it("formats INR correctly", () => {
      expect(format(1234.56, { localeCurrency: COMMON_LOCALE_CURRENCIES.INR_US })).toBe("₹1,234.56");
    });

    it("formats NGN correctly", () => {
      // Get actual format for NGN
      const actualNGN_US = getActualFormat(1234.56, "en-US", "NGN");
      expect(format(1234.56, { localeCurrency: COMMON_LOCALE_CURRENCIES.NGN_US })).toBe(actualNGN_US);
    });

    it("uses USD as default", () => {
      expect(format(1234.56, { type: "currency" })).toBe("$1,234.56");
    });

    it("works with compact notation", () => {
      expect(format(1234567, { localeCurrency: COMMON_LOCALE_CURRENCIES.EUR_US, compact: true })).toBe("€1.23M");
      expect(format(1234567, { localeCurrency: COMMON_LOCALE_CURRENCIES.GBP_GB, compact: true })).toBe("£1.23M");
    });

    it("works with showSign", () => {
      expect(format(1234.56, { localeCurrency: COMMON_LOCALE_CURRENCIES.EUR_US, showSign: true })).toBe("+€1,234.56");
      expect(format(-1234.56, { localeCurrency: COMMON_LOCALE_CURRENCIES.GBP_GB, showSign: true })).toBe("-£1,234.56");
    });

    it("works with different decimals", () => {
      expect(format(1234.56, { localeCurrency: COMMON_LOCALE_CURRENCIES.EUR_US, decimals: 0 })).toBe("€1,235");
      expect(format(1234.56, { localeCurrency: COMMON_LOCALE_CURRENCIES.GBP_GB, decimals: 3 })).toBe("£1,234.560");
    });

    it("shows actual formats for debugging", () => {
      console.log("Actual formats:");
      console.log("EUR_US:", getActualFormat(1234.56, "en-US", "EUR"));
      console.log("EUR_DE:", getActualFormat(1234.56, "de-DE", "EUR"));
      console.log("EUR_ES:", getActualFormat(1234.56, "es-ES", "EUR"));
      console.log("EUR_FR:", getActualFormat(1234.56, "fr-FR", "EUR"));
      console.log("EUR_IT:", getActualFormat(1234.56, "it-IT", "EUR"));
      console.log("AED_US:", getActualFormat(1234.56, "en-US", "AED"));
      console.log("NGN_US:", getActualFormat(1234.56, "en-US", "NGN"));
    });
  });
});
