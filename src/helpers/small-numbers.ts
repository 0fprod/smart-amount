export function formatSmallNumber(value: number, significantDigits?: number): string {
  if (value === 0) return '0';

  // Case: specific precision requested
  if (significantDigits) {
    return formatWithSignificantDigits(value, significantDigits);
  }

  // Case: extremely small number
  if (Math.abs(value) < 1e-10) {
    return convertScientificToDecimal(value.toExponential());
  }

  // Case: small number but not extremely small
  return formatSmallButNotTinyNumber(value);
}

function formatWithSignificantDigits(value: number, digits: number): string {
  const precisionStr = value.toPrecision(digits);
  if (precisionStr.includes('e')) {
    return convertScientificToDecimal(precisionStr);
  }
  return precisionStr;
}

function convertScientificToDecimal(scientificNotation: string): string {
  const isNegative = scientificNotation.startsWith('-');
  const notation = isNegative ? scientificNotation.slice(1) : scientificNotation;
  const [mantissa, exponent] = notation.split('e');
  const exponentValue = parseInt(exponent);

  if (exponentValue < 0) {
    const absExponent = Math.abs(exponentValue);
    const cleanMantissa = mantissa.replace('.', '');
    const decimalString = '0.' + '0'.repeat(absExponent - 1) + cleanMantissa;
    return (isNegative ? '-' : '') + decimalString;
  }

  const [base, exp] = scientificNotation.split('e+');
  const num = parseFloat(base);
  const power = parseInt(exp, 10);
  let result = num;
  for (let i = 0; i < power; i++) {
    result *= 10;
  }
  return result.toString();
}

function formatSmallButNotTinyNumber(value: number): string {
  let tempValue = value;
  let decimalPlaces = 0;

  while (tempValue !== 0 && Math.abs(tempValue) < 1) {
    tempValue *= 10;
    decimalPlaces++;
  }

  const formatted = value.toFixed(decimalPlaces + 2);

  // Remove trailing zeros and decimal point if there are no decimals
  return formatted.replace(/\.?0+$/, '');
}
