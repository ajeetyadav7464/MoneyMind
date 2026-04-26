/**
 * routes/auth.routes.js
 *
 * Public auth endpoints:
 *   POST /api/auth/register   – create account
 *   POST /api/auth/login      – get JWT
 *   GET  /api/auth/me         – get own profile (protected)
 */

const { Router } = require('express');
const { body } = require('express-validator');

const controller = require('../controllers/auth.controller');
const { protect } = require('../middleware/protect');
const validate   = require('../middleware/validate');

const router = Router();

/* ── Validation rules ─────────────────────────────────────────────────────── */

const registerRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 60 }).withMessage('Name cannot exceed 60 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
];

/* ── Routes ──────────────────────────────────────────────────────────────── */

router.post('/register', registerRules, validate, controller.register);
router.post('/login',    loginRules,    validate, controller.login);
router.get('/me',        protect,                 controller.getMe);

module.exports = router;
