/**
 * utils/jwt.js
 *
 * Centralised JWT helpers so the secret and expiry are configured once.
 * Import these instead of calling `jsonwebtoken` directly anywhere else.
 */

const jwt = require('jsonwebtoken');

const SECRET  = process.env.JWT_SECRET;
const EXPIRES = process.env.JWT_EXPIRE || '7d';

/**
 * Sign a JWT containing the user's id and role.
 * @param {{ id: string, role: string }} payload
 * @returns {string} signed JWT
 */
function signToken(payload) {
  if (!SECRET) throw new Error('JWT_SECRET is not set in environment variables');
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES });
}

/**
 * Verify and decode a JWT.
 * Throws JsonWebTokenError / TokenExpiredError on failure.
 * @param {string} token
 * @returns {{ id: string, role: string, iat: number, exp: number }}
 */
function verifyToken(token) {
  if (!SECRET) throw new Error('JWT_SECRET is not set in environment variables');
  return jwt.verify(token, SECRET);
}

module.exports = { signToken, verifyToken };
