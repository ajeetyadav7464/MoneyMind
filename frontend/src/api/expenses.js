/**
 * api/expenses.js
 * Pure async functions — no React state, no hooks.
 * Called from React Query hooks only.
 */

import axiosClient from './axiosClient';

const normalizeExpenseListPayload = (payload) => {
  const source = payload?.data ?? payload ?? {};
  return {
    expenses: source.expenses ?? [],
    total: source.total ?? 0,
    pages: source.pages ?? source.totalPages ?? 1,
  };
};

/**
 * Fetch expenses with optional filters/pagination.
 * @param {object} params  { category, startDate, endDate, page, limit, sort }
 */
export const getExpenses = (params = {}) =>
  axiosClient.get('/expenses', { params }).then((r) => normalizeExpenseListPayload(r.data));

/** GET /expenses/summary */
export const getSummary = () =>
  axiosClient.get('/expenses/summary').then((r) => {
    const payload = r.data?.data ?? r.data;
    return Array.isArray(payload) ? payload : [];
  });

/** GET /expenses/:id */
export const getExpenseById = (id) =>
  axiosClient.get(`/expenses/${id}`).then((r) => r.data?.data ?? r.data);

/**
 * POST /expenses — idempotent.
 * @param {object} data            Expense fields
 * @param {string} idempotencyKey  UUID v4
 */
export const createExpense = (data, idempotencyKey) =>
  axiosClient
    .post('/expenses', data, {
      headers: { 'Idempotency-Key': idempotencyKey },
    })
    .then((r) => r.data?.data ?? r.data);

/** PATCH /expenses/:id */
export const updateExpense = (id, data) =>
  axiosClient.patch(`/expenses/${id}`, data).then((r) => r.data?.data ?? r.data);

/** DELETE /expenses/:id */
export const deleteExpense = (id) =>
  axiosClient.delete(`/expenses/${id}`).then((r) => r.data);
