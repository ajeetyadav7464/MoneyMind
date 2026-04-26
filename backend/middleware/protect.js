/**
 * middleware/protect.js
 *
 * JWT authentication guard.
 * Attach this middleware to any route that requires a logged-in user.
 *
 * Expected header:
 *   Authorization: Bearer <token>
 *
 * On success:  populates `req.user` with { id, role } and calls next().
 * On failure:  responds 401 immediately — no further middleware runs.
 */

const User = require('../models/User');
const { verifyToken } = require('../utils/jwt');

async function protect(req, res, next) {
  try {
    // 1. Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ success: false, message: 'Not authorised — no token provided' });
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify & decode
    const decoded = verifyToken(token);

    // 3. Ensure user still exists in DB (handles deleted-user edge case)
    const user = await User.findById(decoded.id).select('_id role');
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'User no longer exists' });
    }

    // 4. Attach lightweight user object to request
    req.user = { id: user._id.toString(), role: user.role };

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res
        .status(401)
        .json({ success: false, message: 'Token expired — please log in again' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid token' });
    }
    next(err);
  }
}

/**
 * Role-based access guard. Must be chained AFTER protect().
 * Usage:  router.delete('/:id', protect, authorize('admin'), controller.remove)
 *
 * @param {...string} roles  Allowed roles e.g. 'admin'
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not permitted to perform this action`,
      });
    }
    next();
  };
}

module.exports = { protect, authorize };
