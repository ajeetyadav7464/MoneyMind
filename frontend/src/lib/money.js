/**
 * lib/money.js
 * Currency helpers for display — mirrors backend utils/money.js logic.
 */

/**
 * Format a numeric string or number as a specific currency.
 * @param {string|number} value
 * @param {string} currency code e.g. "INR", "USD"
 * @returns {string}  e.g. "₹1,234.56" or "$1,234.56"
 */
export function formatMoney(value, currency = 'INR') {
  const num = parseFloat(String(value));
  if (isNaN(num)) return `0.00`;
  
  const locale = currency === 'INR' ? 'en-IN' : 'en-US';
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(num);
  } catch (e) {
    return `${currency} ${num.toFixed(2)}`;
  }
}

/**
 * Parse a string amount into a number safely.
 */
export function parseAmount(value) {
  const num = parseFloat(String(value).replace(/[^0-9.]/g, ''));
  return isNaN(num) ? 0 : num;
}
