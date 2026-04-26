/**
 * __tests__/expense.test.js
 *
 * Integration tests using Jest + Supertest.
 * Imports app.js directly — no HTTP server port needed.
 *
 * Run: npm test
 */

require('dotenv').config();
const mongoose  = require('mongoose');
const request   = require('supertest');
const { v4: uuidv4 } = require('uuid');

const app     = require('../app');
const Expense = require('../models/Expense');
const User    = require('../models/User');

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/expense-tracker-test';

/* ── DB lifecycle ─────────────────────────────────────────────────────────── */

beforeAll(async () => {
  await mongoose.connect(MONGO_URI);
});

afterEach(async () => {
  await Expense.deleteMany({});
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

/* ── Auth helpers ─────────────────────────────────────────────────────────── */

const testUser = {
  name:     'Test User',
  email:    'test@example.com',
  password: 'password123',
};

/**
 * Register a user and return { token, userId }.
 */
async function registerUser(overrides = {}) {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ ...testUser, ...overrides });
  return { token: res.body.token, userId: res.body.user?.id, res };
}

/**
 * Helper to create an expense as an authenticated user.
 */
async function createExpense(token, overrides = {}, idempotencyKey) {
  const base = {
    title:    'Lunch',
    amount:   '12.50',
    category: 'Food',
    date:     '2024-06-15',
    description: 'Test expense entry',
  };

  const req = request(app)
    .post('/api/expenses')
    .set('Authorization', `Bearer ${token}`)
    .send({ ...base, ...overrides });

  if (idempotencyKey) req.set('Idempotency-Key', idempotencyKey);

  return req;
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* AUTH TESTS                                                                  */
/* ═══════════════════════════════════════════════════════════════════════════ */

describe('POST /api/auth/register', () => {
  it('registers a new user and returns a JWT', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(testUser.email);
    expect(res.body.user.password).toBeUndefined(); // never expose password
  });

  it('returns 400 for missing email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Alice', password: 'password123' });
    expect(res.status).toBe(400);
  });

  it('returns 400 for short password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...testUser, password: '123' });
    expect(res.status).toBe(400);
  });

  it('returns 409 for duplicate email', async () => {
    await registerUser();
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    expect(res.status).toBe(409);
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await registerUser();
  });

  it('logs in with correct credentials and returns a JWT', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  it('returns 401 for wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'wrongpass' });
    expect(res.status).toBe(401);
  });

  it('returns 401 for unknown email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'password123' });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/auth/me', () => {
  it('returns the logged-in user profile', async () => {
    const { token } = await registerUser();

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(testUser.email);
  });

  it('returns 401 without a token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('returns 401 with a malformed token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer not.a.valid.token');
    expect(res.status).toBe(401);
  });
});

/* ═══════════════════════════════════════════════════════════════════════════ */
/* EXPENSE TESTS (all require auth)                                            */
/* ═══════════════════════════════════════════════════════════════════════════ */

describe('POST /api/expenses', () => {
  it('creates an expense and returns 201', async () => {
    const { token } = await registerUser();
    const res = await createExpense(token);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Lunch');
    expect(res.body.data.amount).toBe('12.50');
  });

  it('returns 401 without a token', async () => {
    const res = await request(app)
      .post('/api/expenses')
      .send({ title: 'Lunch', amount: '12.50', category: 'Food' });
    expect(res.status).toBe(401);
  });

  it('returns 400 for missing title', async () => {
    const { token } = await registerUser();
    const res = await createExpense(token, { title: '' });
    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid amount', async () => {
    const { token } = await registerUser();
    const res = await createExpense(token, { amount: '-5.00' });
    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid category', async () => {
    const { token } = await registerUser();
    const res = await createExpense(token, { category: 'Gambling' });
    expect(res.status).toBe(400);
  });

  it('is idempotent — duplicate key returns same 201 without creating extra doc', async () => {
    const { token } = await registerUser();
    const key = uuidv4();

    const res1 = await createExpense(token, {}, key);
    const res2 = await createExpense(token, {}, key);

    expect(res1.status).toBe(201);
    expect(res2.status).toBe(201);
    expect(res2.body.data._id).toBe(res1.body.data._id);
    expect(await Expense.countDocuments()).toBe(1);
  });
});

describe('GET /api/expenses', () => {
  let token;

  beforeEach(async () => {
    ({ token } = await registerUser());
    // Insert 3 expenses for this user
    await createExpense(token, { title: 'Bus',    amount: '2.50',  category: 'Transport' });
    await createExpense(token, { title: 'Lunch',  amount: '12.50', category: 'Food' });
    await createExpense(token, { title: 'Cinema', amount: '8.00',  category: 'Entertainment' });
  });

  it('returns only this user\'s expenses', async () => {
    const res = await request(app)
      .get('/api/expenses')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.total).toBe(3);
  });

  it('isolates data — another user cannot see these expenses', async () => {
    const { token: token2 } = await registerUser({ email: 'other@example.com' });
    const res = await request(app)
      .get('/api/expenses')
      .set('Authorization', `Bearer ${token2}`);

    expect(res.status).toBe(200);
    expect(res.body.total).toBe(0);
  });

  it('filters by category', async () => {
    const res = await request(app)
      .get('/api/expenses?category=Food')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.expenses).toHaveLength(1);
    expect(res.body.expenses[0].title).toBe('Lunch');
  });

  it('returns 401 without a token', async () => {
    const res = await request(app).get('/api/expenses');
    expect(res.status).toBe(401);
  });
});

describe('GET /api/expenses/summary', () => {
  it('returns category totals for authenticated user', async () => {
    const { token } = await registerUser();

    await createExpense(token, { amount: '10.00', category: 'Food' });
    await createExpense(token, { amount: '5.00',  category: 'Food' });
    await createExpense(token, { amount: '3.00',  category: 'Transport' });

    const res = await request(app)
      .get('/api/expenses/summary')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    const food = res.body.data.find((d) => d.category === 'Food');
    expect(food.total).toBe('15.00');
    expect(food.count).toBe(2);
  });
});

describe('GET /api/expenses/:id', () => {
  it('returns a single expense owned by the user', async () => {
    const { token } = await registerUser();
    const created = await createExpense(token);
    const id = created.body.data._id;

    const res = await request(app)
      .get(`/api/expenses/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data._id).toBe(id);
  });

  it('returns 404 for another user\'s expense', async () => {
    const { token: t1 } = await registerUser();
    const { token: t2 } = await registerUser({ email: 'other@example.com' });

    const created = await createExpense(t1);
    const id = created.body.data._id;

    const res = await request(app)
      .get(`/api/expenses/${id}`)
      .set('Authorization', `Bearer ${t2}`);

    expect(res.status).toBe(404);
  });

  it('returns 400 for invalid id format', async () => {
    const { token } = await registerUser();
    const res = await request(app)
      .get('/api/expenses/not-an-id')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(400);
  });
});

describe('PATCH /api/expenses/:id', () => {
  it('updates an expense', async () => {
    const { token } = await registerUser();
    const created = await createExpense(token);
    const id = created.body.data._id;

    const res = await request(app)
      .patch(`/api/expenses/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Dinner', amount: '25.00' });

    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('Dinner');
    expect(res.body.data.amount).toBe('25.00');
  });

  it('cannot update another user\'s expense', async () => {
    const { token: t1 } = await registerUser();
    const { token: t2 } = await registerUser({ email: 'other@example.com' });

    const created = await createExpense(t1);
    const id = created.body.data._id;

    const res = await request(app)
      .patch(`/api/expenses/${id}`)
      .set('Authorization', `Bearer ${t2}`)
      .send({ title: 'Hacked' });

    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/expenses/:id', () => {
  it('deletes an expense and verifies it is gone', async () => {
    const { token } = await registerUser();
    const created = await createExpense(token);
    const id = created.body.data._id;

    const res = await request(app)
      .delete(`/api/expenses/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const check = await request(app)
      .get(`/api/expenses/${id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(check.status).toBe(404);
  });

  it('cannot delete another user\'s expense', async () => {
    const { token: t1 } = await registerUser();
    const { token: t2 } = await registerUser({ email: 'other@example.com' });

    const created = await createExpense(t1);
    const id = created.body.data._id;

    const res = await request(app)
      .delete(`/api/expenses/${id}`)
      .set('Authorization', `Bearer ${t2}`);

    expect(res.status).toBe(404);
  });
});
