/**
 * middleware/idempotency.js
 *
 * Solves the "unreliable networks / browser refreshes / retries" requirement.
 *
 * How it works
 * ────────────
 * 1. The frontend generates a UUID v4 and sends it as the
 *    `Idempotency-Key` request header on every POST /api/expenses request.
 * 2. This middleware checks an in-memory Map (fast O(1) lookup).
 *    – If the key is NEW  → call next() and cache the response after the
 *      controller resolves.
 *    – If the key is SEEN → immediately replay the cached 201 response,
 *      no second expense is created.
 *
 * Production note: replace `idempotencyCache` with a Redis store so the
 * cache survives restarts and works across multiple server instances.
 *
 * The Expense model also stores idempotencyKey as a sparse-unique index,
 * giving defence-in-depth at the DB layer.
 */

// In-memory store: key → { status, body }
const idempotencyCache = new Map();

/**
 * @param {number} [ttlMs=86_400_000]  TTL before a key expires (default 24 h)
 */
function idempotency(ttlMs = 86_400_000) {
  return (req, res, next) => {
    const key = req.headers['idempotency-key'];

    // If no key is provided, skip idempotency logic (e.g. for GET requests)
    if (!key) return next();

    if (idempotencyCache.has(key)) {
      const cached = idempotencyCache.get(key);
      // Replay exactly the same status + body
      return res.status(cached.status).json(cached.body);
    }

    // Intercept res.json so we can cache the response before it is sent
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      if (res.statusCode === 201) {
        idempotencyCache.set(key, { status: 201, body });

        // Auto-expire the key after TTL
        setTimeout(() => idempotencyCache.delete(key), ttlMs);
      }
      return originalJson(body);
    };

    next();
  };
}

module.exports = idempotency;
