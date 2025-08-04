# Smart Amount

[![CI](https://github.com/0fprod/smart-amount/actions/workflows/ci.yml/badge.svg)](https://github.com/0fprod/smart-amount/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@0fprod/smart-amount?color=blue)](https://www.npmjs.com/package/@0fprod/smart-amount)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

A flexible TypeScript library for formatting numbers as currency, percentages, tokens, and raw values with intelligent small number handling and multi-currency support.

## Installation

```bash
npm install @0fprod/smart-amount
```

## Usage

```typescript
import { format, COMMON_LOCALE_CURRENCIES } from '@0fprod/smart-amount';

// Currency formatting with multi-currency support
format(1234.56, { type: 'currency' });
// Output: "$1,234.56"

format(1234.56, { localeCurrency: COMMON_LOCALE_CURRENCIES.EUR_US });
// Output: "€1,234.56"

format(1234.56, { localeCurrency: COMMON_LOCALE_CURRENCIES.EUR_DE });
// Output: "1.234,56 €"

format(1234.56, { localeCurrency: COMMON_LOCALE_CURRENCIES.GBP_GB });
// Output: "£1,234.56"

// Percentage formatting
format(0.12, { type: 'percentage' });
// Output: "0.12%"

format(25.5, { type: 'percentage' });
// Output: "25.50%"

format(1234567, { type: 'percentage', compact: true });
// Output: "123.46M%"

// Token formatting
format(0.00001234, { type: 'token', tokenSymbol: 'ETH' });
// Output: "0.00001234 ETH"

format(1234567, { type: 'token', tokenSymbol: 'BTC', compact: true });
// Output: "1.23M BTC"

// Raw number formatting
format(1234567, { type: 'raw' });
// Output: "1234567"

// Small numbers with intelligent handling
format(0.000000123, { type: 'currency' });
// Output: "$0.000000123"

format(0.000000123, { type: 'token', tokenSymbol: 'ETH' });
// Output: "0.000000123 ETH"

// Compact notation for large numbers
format(1234567, { type: 'currency', compact: true });
// Output: "$1.23M"

format(1234567, { type: 'percentage', compact: true });
// Output: "1.23M%"

// Auto-compact based on threshold
format(1234567, { type: 'currency', autoCompact: true });
// Output: "$1.23M"

format(1000, { type: 'currency', autoCompact: true });
// Output: "$1,000.00"

// Show signs for positive values
format(1234.56, { type: 'currency', showSign: true });
// Output: "+$1,234.56"

format(1234.56, { type: 'percentage', showSign: true });
// Output: "+1,234.56%"

// Custom decimal places
format(1234.56, { type: 'currency', decimals: 0 });
// Output: "$1,235"

format(1234.56, { type: 'percentage', decimals: 3 });
// Output: "1,234.560%"

// Significant digits for small numbers
format(0.0000123, { type: 'currency', significantDigits: 2 });
// Output: "$0.000012"

// Full decimals for tokens (preserves precision)
format("123456789.123456789", { type: 'token', tokenSymbol: 'ETH', fullDecimals: true });
// Output: "123,456,789.123456789 ETH"
```

## Supported Currencies and Locales

The library supports multiple currencies with their respective locales:

```typescript
import { COMMON_LOCALE_CURRENCIES } from '@0fprod/smart-amount';

// Available currency-locale combinations:
COMMON_LOCALE_CURRENCIES.USD_US  // $1,234.56
COMMON_LOCALE_CURRENCIES.EUR_US  // €1,234.56
COMMON_LOCALE_CURRENCIES.EUR_DE  // 1.234,56 €
COMMON_LOCALE_CURRENCIES.EUR_ES  // 1.234,56 €
COMMON_LOCALE_CURRENCIES.EUR_FR  // 1 234,56 €
COMMON_LOCALE_CURRENCIES.EUR_IT  // 1.234,56 €
COMMON_LOCALE_CURRENCIES.GBP_GB  // £1,234.56
COMMON_LOCALE_CURRENCIES.GBP_US  // £1,234.56
COMMON_LOCALE_CURRENCIES.AED_US  // AED 1,234.56
COMMON_LOCALE_CURRENCIES.INR_US  // ₹1,234.56
COMMON_LOCALE_CURRENCIES.NGN_US  // NGN 1,234.56
```

## Features

- **Multiple format types**: Currency, percentage, token, and raw number formatting
- **Multi-currency support**: USD, EUR, GBP, AED, INR, NGN with proper locale formatting
- **Intelligent small number handling**: Automatically switches to scientific notation for very small numbers
- **Compact notation**: K, M, B suffixes for large numbers
- **Auto-compact**: Automatically applies compact notation based on threshold
- **Sign display**: Option to show + sign for positive values
- **Custom precision**: Configurable decimal places and significant digits
- **Full decimals**: Preserve full precision for token amounts
- **Internationalization support**: Uses Intl API for locale-aware formatting
- **TypeScript support**: Full type definitions included
- **Zero dependencies**: Lightweight and fast
- **Comprehensive testing**: 80+ tests covering all functionality
- **Modular architecture**: Clean separation of concerns with dedicated formatters

## Project Structure

The library is organized with a clean, modular architecture:

```
src/
├── index.ts              # Main entry point (re-exports everything)
├── types.ts              # TypeScript interfaces and types
├── constants.ts          # Constants and configurations
├── utils.ts              # Utility functions
├── formatters/
│   ├── index.ts          # Main format function
│   ├── currency.ts       # Currency formatting logic
│   ├── percentage.ts     # Percentage formatting logic
│   ├── token.ts          # Token formatting logic
│   └── raw.ts           # Raw number formatting logic
└── helpers/
    └── small-numbers.ts  # Small number handling logic
```

## API

### `format(value: number | string, options?: FormatNumbersOptions): string`

Formats a number according to the specified options.

#### Options

- `type`: The format type ('currency', 'percentage', 'token', 'raw')
- `localeCurrency`: Currency-locale configuration (e.g., `COMMON_LOCALE_CURRENCIES.EUR_US`)
- `decimals`: Number of decimal places (default: 2)
- `compact`: Use compact notation for large numbers
- `autoCompact`: Automatically apply compact notation based on threshold
- `compactThreshold`: Threshold for auto-compact (default: 10000)
- `tokenSymbol`: Token symbol for token formatting
- `significantDigits`: Number of significant digits for small numbers
- `showSign`: Show + sign for positive values and - for negative values
- `rounded`: Round small numbers to zero
- `fullDecimals`: Preserve full decimal precision for tokens

## Development

### Running Tests

```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

### Building

```bash
npm run build         # Build for production
npm run dev           # Build in watch mode
```

## License

MIT 