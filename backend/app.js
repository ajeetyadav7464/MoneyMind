/**
 * app.js — Express application factory.
 * Does NOT connect to MongoDB and does NOT call app.listen().
 * This makes it trivially importable in Jest tests via Supertest.
 */

const express = require('express');
const cors = require('cors');
const expenseRoutes = require('./routes/expense.routes');
const authRoutes    = require('./routes/auth.routes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// ── Global middleware ──────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/expenses', expenseRoutes);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// ── Centralised error handler (must be last) ──────────────────────────────────
app.use(errorHandler);

module.exports = app;
