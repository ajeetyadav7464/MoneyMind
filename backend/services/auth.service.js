/**
 * services/auth.service.js
 *
 * Authentication business logic — no Express imports.
 * All operations return plain objects or throw descriptive errors.
 */

const User = require('../models/User');
const { signToken } = require('../utils/jwt');

/* ── Register ────────────────────────────────────────────────────────────── */

/**
 * Register a new user.
 * Throws 409 if email is already taken.
 *
 * @param {{ name: string, email: string, password: string }} data
 * @returns {{ user: object, token: string }}
 */
async function register(data) {
  const { name, email, password } = data;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    const err = new Error('An account with that email already exists');
    err.statusCode = 409;
    throw err;
  }

  const user = await User.create({ name, email, password });

  const token = signToken({ id: user._id.toString(), role: user.role });

  return {
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token,
  };
}

/* ── Login ───────────────────────────────────────────────────────────────── */

/**
 * Authenticate a user with email + password.
 * Throws 401 for invalid credentials (intentionally vague message to
 * prevent email enumeration attacks).
 *
 * @param {{ email: string, password: string }} data
 * @returns {{ user: object, token: string }}
 */
async function login(data) {
  const { email, password } = data;

  // Explicitly select password (it has `select: false` on the schema)
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const token = signToken({ id: user._id.toString(), role: user.role });

  return {
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token,
  };
}

/* ── Get current user ────────────────────────────────────────────────────── */

/**
 * Fetch the currently authenticated user's profile.
 * @param {string} userId
 * @returns {object}
 */
async function getMe(userId) {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return { id: user._id, name: user.name, email: user.email, role: user.role };
}

module.exports = { register, login, getMe };
