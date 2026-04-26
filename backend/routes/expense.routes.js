/**
 * routes/expense.routes.js
 *
 * Maps HTTP verbs + paths → middleware → controller actions.
 * Validation rules (express-validator) live here alongside idempotency
 * middleware so every route's requirements are visible in one file.
 */

const { Router } = require('express');
const { body, param } = require('express-validator');

const controller     = require('../controllers/expense.controller');
const idempotency    = require('../middleware/idempotency');
const validate       = require('../middleware/validate');
const { protect }    = require('../middleware/protect');

const router = Router();

/* ── Validation rule sets ─────────────────────────────────────────────────── */

const VALID_CATEGORIES = [
  'Food', 'Transport', 'Entertainment', 'Health',
  'Shopping', 'Utilities', 'Education', 'Other',
];

const VALID_CURRENCIES = ['INR', 'USD', 'EUR', 'GBP'];

const createRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('amount')
    .notEmpty().withMessage('Amount is required')
    .matches(/^\d+(\.\d+)?$/).withMessage('Amount must be a positive decimal number'),
  body('currency')
    .optional()
    .isIn(VALID_CURRENCIES).withMessage(`Currency must be one of: ${VALID_CURRENCIES.join(', ')}`),
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(VALID_CATEGORIES).withMessage(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`),
  body('date')
    .notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Date must be a valid ISO 8601 date'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
];

const updateRules = [
  param('id').isMongoId().withMessage('Invalid expense ID'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('amount')
    .optional()
    .matches(/^\d+(\.\d+)?$/).withMessage('Amount must be a positive decimal number'),
  body('currency')
    .optional()
    .isIn(VALID_CURRENCIES).withMessage(`Currency must be one of: ${VALID_CURRENCIES.join(', ')}`),
  body('category')
    .optional()
    .isIn(VALID_CATEGORIES).withMessage(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`),
  body('date')
    .optional()
    .isISO8601().withMessage('Date must be a valid ISO 8601 date'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
];

const idRule = [
  param('id').isMongoId().withMessage('Invalid expense ID'),
];

/* ── Routes ──────────────────────────────────────────────────────────────── */

// All expense routes require a valid JWT (protect middleware)
// Summary must come before /:id so Express doesn't treat "summary" as an id
router.get('/summary',  protect, controller.getSummary);

router.get('/',         protect, controller.getAll);

router.post(
  '/',
  protect,
  idempotency(),   // check / store idempotency key
  createRules,
  validate,
  controller.create
);

router.get('/:id',    protect, idRule, validate, controller.getOne);

router.patch('/:id',  protect, updateRules, validate, controller.update);

router.delete('/:id', protect, idRule, validate, controller.remove);

module.exports = router;
