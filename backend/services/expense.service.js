/**
 * services/expense.service.js
 *
 * Business logic layer — no Express imports here.
 * Functions in this file are pure: they receive plain JS objects and return
 * plain JS objects (or throw errors).  This makes them trivially unit-testable
 * without an HTTP server.
 *
 * All DB queries live here, controllers stay thin.
 */

const Expense = require('../models/Expense');
const { toDecimal128 } = require('../utils/money');

/* ── Create ──────────────────────────────────────────────────────────────── */

/**
 * Create a new expense document.
 * @param {object} data  Validated request body + optional idempotencyKey + ownerId
 * @returns {Promise<Expense>}
 */
async function createExpense(data) {
  const { title, amount, category, date, description, idempotencyKey, ownerId } = data;

  const expense = new Expense({
    title,
    amount: toDecimal128(amount),
    category,
    date: date ? new Date(date) : undefined,
    description,
    idempotencyKey,
    owner: ownerId,
  });

  return expense.save();
}

/* ── Read ────────────────────────────────────────────────────────────────── */

/**
 * Fetch a paginated, filtered, sorted list of expenses.
 *
 * @param {object} query
 * @param {string}  query.ownerId       Required — only return this user's expenses
 * @param {string}  [query.category]    Filter by category
 * @param {string}  [query.startDate]   ISO date string
 * @param {string}  [query.endDate]     ISO date string
 * @param {number}  [query.page=1]      1-based page number
 * @param {number}  [query.limit=20]    Items per page (max 100)
 * @param {string}  [query.sort='-date'] Mongoose sort string
 * @returns {Promise<{ expenses: Expense[], total: number, page: number, pages: number }>}
 */
async function getExpenses(query = {}) {
  const {
    ownerId,
    category,
    startDate,
    endDate,
    page = 1,
    limit = 20,
    sort = 'date_desc',
  } = query;

  const filter = { owner: ownerId };

  if (category) filter.category = category;

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate)   filter.date.$lte = new Date(endDate);
  }

  const resolvedSort = resolveSort(sort);

  const safePage  = Math.max(1, parseInt(page, 10));
  const safeLimit = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const skip = (safePage - 1) * safeLimit;

  const [expenses, total] = await Promise.all([
    Expense.find(filter).sort(resolvedSort).skip(skip).limit(safeLimit).lean({ virtuals: true }),
    Expense.countDocuments(filter),
  ]);

  // Convert Decimal128 → string for lean() docs (toJSON transform doesn't run)
  const serialised = expenses.map(serializeExpense);

  return {
    expenses: serialised,
    total,
    page: safePage,
    pages: Math.ceil(total / safeLimit),
  };
}

/**
 * Fetch a single expense by its MongoDB ObjectId.
 * Only returns the expense if it belongs to the requesting user.
 * @param {string} id
 * @param {string} ownerId
 * @returns {Promise<Expense>}
 */
async function getExpenseById(id, ownerId) {
  const expense = await Expense.findOne({ _id: id, owner: ownerId });
  if (!expense) {
    const err = new Error('Expense not found');
    err.statusCode = 404;
    throw err;
  }
  return expense;
}

/* ── Update ──────────────────────────────────────────────────────────────── */

/**
 * Update an existing expense (partial update — PATCH semantics).
 * Only updates if the expense belongs to the requesting user.
 * @param {string} id
 * @param {string} ownerId
 * @param {object} updates  Fields to update
 * @returns {Promise<Expense>}
 */
async function updateExpense(id, ownerId, updates) {
  if (updates.amount !== undefined) {
    updates.amount = toDecimal128(updates.amount);
  }
  if (updates.date !== undefined) {
    updates.date = new Date(updates.date);
  }

  const expense = await Expense.findOneAndUpdate(
    { _id: id, owner: ownerId },
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!expense) {
    const err = new Error('Expense not found');
    err.statusCode = 404;
    throw err;
  }

  return expense;
}

/* ── Delete ──────────────────────────────────────────────────────────────── */

/**
 * Delete an expense by id.
 * Only deletes if the expense belongs to the requesting user.
 * @param {string} id
 * @param {string} ownerId
 * @returns {Promise<void>}
 */
async function deleteExpense(id, ownerId) {
  const expense = await Expense.findOneAndDelete({ _id: id, owner: ownerId });
  if (!expense) {
    const err = new Error('Expense not found');
    err.statusCode = 404;
    throw err;
  }
}

/* ── Summary ─────────────────────────────────────────────────────────────── */

/**
 * Return aggregated totals grouped by category.
 * Scoped to the authenticated user.
 *
 * @param {string} ownerId
 * @returns {Promise<Array<{ category: string, total: string, count: number }>>}
 */
async function getSummary(ownerId) {
  const result = await Expense.aggregate([
    { $match: { owner: new (require('mongoose').Types.ObjectId)(ownerId) } },
    {
      $group: {
        _id: { category: '$category', currency: { $ifNull: ['$currency', 'INR'] } },
        total: { $sum: { $toDouble: '$amount' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { total: -1 } },
  ]);

  return result.map((r) => ({
    category: r._id.category,
    currency: r._id.currency,
    total: r.total.toFixed(2),
    count: r.count,
  }));
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */

/** Convert a lean() document's Decimal128 amount to a string. */
function serializeExpense(doc) {
  if (doc.amount && typeof doc.amount === 'object' && doc.amount.toString) {
    doc.amount = doc.amount.toString();
  }
  return doc;
}

function resolveSort(sort) {
  if (sort === 'date_desc' || sort === '-date') return '-date';
  if (sort === 'date_asc' || sort === 'date') return 'date';
  return '-date';
}

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getSummary,
};
