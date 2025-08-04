import { isSmallNumber } from "../utils";
import { formatSmallNumber } from "../helpers/small-numbers";

export function formatRaw(value: number): string {
  // Special case: zero
  if (value === 0) {
    return "0";
  }

  // Special case: small number
  if (isSmallNumber(value)) {
    return formatSmallNumber(value);
  }

  // Normal case
  return value.toString();
}
