/**
 * middleware/validate.js
 *
 * Reusable express-validator result handler.
 * Import this and add it AFTER your validation chain in any route.
 *
 * Usage:
 *   router.post('/', [...validationRules], validate, controller.create);
 */

const { validationResult } = require('express-validator');

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, errors: errors.array().map((e) => e.msg) });
  }
  next();
}

module.exports = validate;
