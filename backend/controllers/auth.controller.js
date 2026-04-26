/**
 * controllers/auth.controller.js
 *
 * Thin HTTP adapter for authentication routes.
 * Business logic lives in services/auth.service.js.
 */

const authService = require('../services/auth.service');

/* ── POST /api/auth/register ─────────────────────────────────────────────── */
async function register(req, res, next) {
  try {
    const { user, token } = await authService.register(req.body);
    res.status(201).json({ success: true, token, user });
  } catch (err) {
    next(err);
  }
}

/* ── POST /api/auth/login ────────────────────────────────────────────────── */
async function login(req, res, next) {
  try {
    const { user, token } = await authService.login(req.body);
    res.json({ success: true, token, user });
  } catch (err) {
    next(err);
  }
}

/* ── GET /api/auth/me ────────────────────────────────────────────────────── */
async function getMe(req, res, next) {
  try {
    const user = await authService.getMe(req.user.id);
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, getMe };
