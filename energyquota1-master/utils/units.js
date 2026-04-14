/**
 * High-precision energy units: avoid floating-point errors and "free energy" from rounding.
 *
 * WHY HIGH-PRECISION DECIMALS ARE REQUIRED:
 * - JavaScript Number is IEEE 754 double; repeated add/subtract of small values (e.g. 0.00000001 kWh)
 *   accumulates rounding errors. Over time this can result in unbilled consumption ("free energy").
 * - Small loads (LED, standby) consume tiny amounts per interval; we must bill them correctly.
 * - We never round or truncate during calculations or before saving; only at presentation (2 decimals).
 */

const Decimal = require("decimal.js");

/** Minimum supported precision: values down to 0.00000001 kWh (8 decimal places). */
const DECIMALS_STORAGE = 10;
/** Presentation layer: display max 2 decimal places for usability. */
const DECIMALS_DISPLAY = 2;

/**
 * Parse a value (string/number) into a Decimal. Never use Number() for arithmetic.
 */
function parseDecimal(value) {
  if (value == null || value === "") return new Decimal(0);
  try {
    return new Decimal(value);
  } catch {
    return new Decimal(0);
  }
}

/**
 * Subtract usage from balance (deduction). High-precision; no rounding.
 * Used when device reports consumption: remaining -= units_used, used += units_used.
 */
function subtractUsage(balance, usage) {
  return parseDecimal(balance).minus(parseDecimal(usage));
}

/**
 * Add units to balance (recharge). High-precision; no rounding.
 */
function addUnits(balance, units) {
  return parseDecimal(balance).plus(parseDecimal(units));
}

/**
 * Store value as string with fixed decimal places. Never round before saving.
 * Used when persisting to DB so we keep at least 8 decimal places (we use 10).
 */
function toStorageString(value) {
  const d = parseDecimal(value);
  return d.toFixed(DECIMALS_STORAGE);
}

/**
 * Presentation only: format for frontend/API display. Max 2 decimal places.
 * Internal values remain unchanged and precise.
 */
function toDisplay(value) {
  const d = parseDecimal(value);
  return d.toFixed(DECIMALS_DISPLAY);
}

/**
 * Sum an array of stored values with high precision (e.g. aggregating all tenants).
 */
function sumStored(values) {
  return values.reduce((acc, v) => acc.plus(parseDecimal(v)), new Decimal(0));
}

module.exports = {
  Decimal: require("decimal.js"),
  parseDecimal,
  subtractUsage,
  addUnits,
  toStorageString,
  toDisplay,
  sumStored,
  DECIMALS_STORAGE,
  DECIMALS_DISPLAY,
  // Backward-compat names
  toDecimal10: toStorageString,
  toDisplay2: toDisplay,
};
