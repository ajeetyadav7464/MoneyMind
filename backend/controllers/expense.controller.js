/**
 * controllers/expense.controller.js
 *
 * Thin HTTP adapter layer.
 * Responsibilities:
 *   • Extract data from req (params, body, query, headers)
 *   • Pass req.user.id (ownerId) to every service call
 *   • Send the HTTP response
 *
 * No business logic lives here — keep it in services/expense.service.js.
 */

const expenseService = require('../services/expense.service');

/* ── POST /api/expenses ──────────────────────────────────────────────────── */
async function create(req, res, next) {
  try {
    const idempotencyKey = req.headers['idempotency-key'] || undefined;
    const expense = await expenseService.createExpense({
      ...req.body,
      idempotencyKey,
      ownerId: req.user.id,
    });
    res.status(201).json({ success: true, data: expense });
  } catch (err) {
    next(err);
  }
}

/* ── GET /api/expenses ───────────────────────────────────────────────────── */
async function getAll(req, res, next) {
  try {
    const result = await expenseService.getExpenses({
      ...req.query,
      ownerId: req.user.id,
    });
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

/* ── GET /api/expenses/summary ───────────────────────────────────────────── */
async function getSummary(req, res, next) {
  try {
    const data = await expenseService.getSummary(req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

/* ── GET /api/expenses/:id ───────────────────────────────────────────────── */
async function getOne(req, res, next) {
  try {
    const expense = await expenseService.getExpenseById(req.params.id, req.user.id);
    res.json({ success: true, data: expense });
  } catch (err) {
    next(err);
  }
}

/* ── PATCH /api/expenses/:id ─────────────────────────────────────────────── */
async function update(req, res, next) {
  try {
    const expense = await expenseService.updateExpense(
      req.params.id,
      req.user.id,
      req.body
    );
    res.json({ success: true, data: expense });
  } catch (err) {
    next(err);
  }
}

/* ── DELETE /api/expenses/:id ────────────────────────────────────────────── */
async function remove(req, res, next) {
  try {
    await expenseService.deleteExpense(req.params.id, req.user.id);
    res.json({ success: true, message: 'Expense deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { create, getAll, getSummary, getOne, update, remove };
