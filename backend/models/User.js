const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema
 *
 * Design decisions:
 * • Password is hashed with bcrypt (salt rounds = 12) in a pre-save hook —
 *   plain-text passwords NEVER touch the database.
 * • `comparePassword` is an instance method so controllers never import bcrypt.
 * • `role` supports future admin/user separation without a schema migration.
 */

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // never returned in queries by default
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  { timestamps: true }
);

/* ── Pre-save hook: hash password before storing ──────────────────────────── */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/* ── Instance method: compare a candidate password against the stored hash ── */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
