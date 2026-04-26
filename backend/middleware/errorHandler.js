/**
 * middleware/errorHandler.js
 *
 * Centralised Express error handler.
 * Must be registered as the LAST middleware in app.js.
 *
 * Handles:
 *   • Mongoose ValidationError  → 400
 *   • Mongoose CastError        → 400 (e.g. invalid ObjectId)
 *   • Duplicate key (code 11000) → 409 (idempotency double-write)
 *   • Everything else           → 500
 */

function errorHandler(err, _req, res, _next) {
  console.error('[ErrorHandler]', err.message);

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, errors: messages });
  }

  // Invalid Mongoose ObjectId
  if (err.name === 'CastError') {
    return res
      .status(400)
      .json({ success: false, message: `Invalid ${err.path}: ${err.value}` });
  }

  // MongoDB duplicate key (idempotencyKey unique index)
  if (err.code === 11000) {
    return res
      .status(409)
      .json({ success: false, message: 'Duplicate request detected' });
  }

  // Generic server error
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(status).json({ success: false, message });
}

module.exports = { errorHandler };
