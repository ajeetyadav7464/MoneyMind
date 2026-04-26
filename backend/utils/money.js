/**
 * utils/money.js
 *
 * Centralised currency helpers.
 * Every conversion between a raw string/number and MongoDB Decimal128
 * goes through here.  One place to fix if a precision bug is ever found.
 */

const mongoose = require('mongoose');

/**
 * Convert a string or number to a Mongoose Decimal128 value.
 * Throws a descriptive error if the value is not a finite positive number.
 *
 * @param {string|number} value  e.g. "12.50" or 12.5
 * @returns {mongoose.Types.Decimal128}
 */
function toDecimal128(value) {
  const str = String(value).trim();

  if (!/^\d+(\.\d+)?$/.test(str)) {
    throw new TypeError(`Invalid amount: "${str}" is not a valid positive decimal`);
  }

  const num = parseFloat(str);
  if (!isFinite(num) || num <= 0) {
    throw new TypeError(`Invalid amount: "${str}" must be a finite positive number`);
  }

  return mongoose.Types.Decimal128.fromString(str);
}

/**
 * Convert a Decimal128 (or anything with a toString()) to a plain JS string.
 * Safe to call on values that are already strings.
 *
 * @param {mongoose.Types.Decimal128|string|number} value
 * @returns {string}  e.g. "12.50"
 */
function fromDecimal128(value) {
  if (value == null) return '0.00';
  return value.toString();
}

/**
 * Format a Decimal128/string amount as a locale currency string.
 * Defaults to en-IN / INR — adjust the locale/currency as needed.
 *
 * @param {mongoose.Types.Decimal128|string|number} value
 * @param {string} [currency='INR']
 * @param {string} [locale='en-IN']
 * @returns {string}  e.g. "₹12.50"
 */
function formatCurrency(value, currency = 'INR', locale = 'en-IN') {
  const num = parseFloat(fromDecimal128(value));
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(num);
}

module.exports = { toDecimal128, fromDecimal128, formatCurrency };
