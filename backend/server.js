/**
 * server.js — Entry point.
 * Responsibilities:
 *   1. Load env vars
 *   2. Connect to MongoDB
 *   3. Start the HTTP server
 *
 * Deliberately kept thin so that app.js can be imported by tests
 * without triggering a real DB connection or port binding.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌  MONGO_URI is not set. Add it to your .env file.');
  process.exit(1);
}

const mongooseOptions = {
  // Mongoose 8 default — keep explicit for clarity
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};

mongoose
  .connect(MONGO_URI, mongooseOptions)
  .then(() => {
    console.log('✅  MongoDB connected');
    app.listen(PORT, () =>
      console.log(`🚀  Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error('❌  MongoDB connection error:', err.message);

    // Common SSL error = Atlas IP not whitelisted
    if (err.message.includes('SSL') || err.message.includes('tls')) {
      console.error('');
      console.error('🔒  TLS/SSL error — most likely cause:');
      console.error('    Your current IP is not whitelisted in MongoDB Atlas.');
      console.error('    Fix: Atlas Dashboard → Network Access → Add IP Address');
      console.error('    For dev, allow 0.0.0.0/0 (allow from anywhere).');
    }
    process.exit(1);
  });
