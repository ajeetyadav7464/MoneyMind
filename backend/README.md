# Fenmo Expense Tracker – MERN Backend

A production-ready, secure Express + Mongoose REST API for the Expense Tracker application.

---

## 🏗️ Folder Structure

```
backend/
├── app.js                        # Express config (test-importable, no DB connection)
├── server.js                     # Entry point: connects to MongoDB & starts HTTP server
├── .env                          # Environment variables (DB URI, JWT secret)
├── package.json
│
├── models/
│   ├── User.js                   # Mongoose schema: user data + bcrypt password hashing
│   └── Expense.js                # Mongoose schema: Decimal128 for money + idempotency key
│
├── routes/
│   ├── auth.routes.js            # Authentication routes (login, register, me)
│   └── expense.routes.js         # Expense CRUD routes + express-validator rules
│
├── controllers/
│   ├── auth.controller.js        # Thin adapter for auth HTTP requests
│   └── expense.controller.js     # Thin adapter for expense HTTP requests
│
├── services/
│   ├── auth.service.js           # Auth business logic (JWT signing, password checks)
│   └── expense.service.js        # Expense business logic & DB queries (scoped per user)
│
├── middleware/
│   ├── protect.js                # JWT authentication guard
│   ├── idempotency.js            # Prevents duplicate POSTs on retry/refresh
│   ├── errorHandler.js           # Centralised Express error handler
│   └── validate.js               # express-validator result checker
│
├── utils/
│   ├── money.js                  # Decimal128 ↔ string currency converters
│   └── jwt.js                    # JWT sign and verify helpers
│
└── __tests__/
    └── expense.test.js           # Jest + Supertest integration tests (30+ test cases)
```

---

## 🚀 Setup & Installation

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Create or edit the `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/expense_tracker_db
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_string
JWT_EXPIRE=7d
```
*(Note: Ensure your current IP is whitelisted in MongoDB Atlas Network Access if you encounter SSL/TLS errors).*

### 3. Start the Server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

### 4. Run Integration Tests
Tests use a separate in-memory database configuration and Supertest to simulate HTTP requests.
```bash
npm test
```

---

## 🛠️ Key Architectural & Design Decisions

1. **`Decimal128` for Financial Data**: JavaScript floats are notoriously inaccurate for money math (e.g., `0.1 + 0.2 !== 0.3`). The `Expense` model uses MongoDB's `Decimal128` to store exact decimal values. The `utils/money.js` centralises all conversions.
2. **Idempotent Creations**: The `POST /api/expenses` endpoint uses an `Idempotency-Key` header (UUID sent by frontend). If a network timeout occurs and the user retries, the middleware catches the duplicate key and replays the original `201` response without creating a duplicate charge. This is reinforced by a sparse unique index on the database layer.
3. **Controller-Service Separation**: Controllers are extremely thin (only handling `req` and `res`). All business logic and Mongoose queries live in the `services/` layer. This makes the code highly modular and unit-testable.
4. **Data Isolation (Multi-tenancy)**: Every expense is tied to a user (`owner`). The `protect` middleware extracts the user ID from the JWT, and the service layer strictly scopes all `find`, `update`, and `delete` operations to that specific `ownerId`.
5. **Security**: Passwords are never stored in plain text. They are hashed using `bcryptjs` with a cost factor of 12 before saving. Passwords are also excluded from default queries (`select: false`).

---

## 📚 Detailed API Reference

### 🔐 Authentication Endpoints

#### 1. Register a New User
* **URL:** `POST /api/auth/register`
* **Access:** Public
* **Body:**
  ```json
  {
    "name": "Ajeet Yadav",
    "email": "ajeet@example.com",
    "password": "password123"
  }
  ```
* **Response (201 Created):**
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1...",
    "user": { "id": "...", "name": "Ajeet Yadav", "email": "ajeet@example.com", "role": "user" }
  }
  ```

#### 2. Login
* **URL:** `POST /api/auth/login`
* **Access:** Public
* **Body:**
  ```json
  {
    "email": "ajeet@example.com",
    "password": "password123"
  }
  ```
* **Response (200 OK):** Returns JWT token and user profile.

#### 3. Get Current User Profile
* **URL:** `GET /api/auth/me`
* **Access:** Protected (Requires `Authorization: Bearer <token>`)
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "user": { "id": "...", "name": "Ajeet Yadav", "email": "ajeet@example.com", "role": "user" }
  }
  ```

---

### 💸 Expense Endpoints

> **⚠️ IMPORTANT:** All Expense endpoints are **Protected** and require the JWT header:
> `Authorization: Bearer <your_jwt_token>`

#### 4. Create an Expense
* **URL:** `POST /api/expenses`
* **Headers:** 
  * `Authorization: Bearer <token>`
  * `Idempotency-Key: <uuid-v4>` *(Required for safe retries)*
* **Body:**
  ```json
  {
    "title": "Team Lunch",
    "amount": "450.00",
    "category": "Food",
    "date": "2024-06-15",
    "description": "Lunch with the team"
  }
  ```
* **Response (201 Created):** Returns the created expense object.

#### 5. Get All Expenses (Paginated & Filtered)
* **URL:** `GET /api/expenses`
* **Query Parameters:**
  * `category` (string): Filter by category (e.g., `Food`).
  * `startDate` (ISO Date): Filter expenses from this date.
  * `endDate` (ISO Date): Filter expenses up to this date.
  * `page` (number): Pagination page (default: 1).
  * `limit` (number): Results per page (default: 20).
  * `sort` (string): Sort order (default: `-date`).
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "expenses": [ ... ],
    "total": 45,
    "page": 1,
    "pages": 3
  }
  ```

#### 6. Get Expense Summary
* **URL:** `GET /api/expenses/summary`
* **Description:** Returns aggregated total amounts grouped by category for the logged-in user. Powered by a MongoDB Aggregation Pipeline for maximum performance.
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      { "category": "Food", "total": "1250.00", "count": 5 },
      { "category": "Transport", "total": "400.00", "count": 2 }
    ]
  }
  ```

#### 7. Get Single Expense
* **URL:** `GET /api/expenses/:id`
* **Response (200 OK):** Returns the specific expense document. Returns 404 if it doesn't belong to the user.

#### 8. Update an Expense
* **URL:** `PATCH /api/expenses/:id`
* **Body:** Only send the fields you want to update (e.g., `{"amount": "500.00"}`).
* **Response (200 OK):** Returns the updated expense.

#### 9. Delete an Expense
* **URL:** `DELETE /api/expenses/:id`
* **Response (200 OK):** `{"success": true, "message": "Expense deleted"}`

---

## 🎯 Supported Categories
When creating or updating an expense, the `category` must be one of the following exact strings:
`Food`, `Transport`, `Entertainment`, `Health`, `Shopping`, `Utilities`, `Education`, `Other`

---

## 🧪 Postman Testing Workflow
To test the APIs seamlessly in Postman:
1. Create a **POST** request to `/api/auth/register` to create a user.
2. Copy the `token` from the response.
3. In Postman, go to your Collection Variables or Environment Variables and set a variable named `token` with this value.
4. For all `/api/expenses` requests, go to the **Authorization** tab, select **Bearer Token**, and set the value to `{{token}}`.
5. For the `POST /api/expenses` route, remember to add `Idempotency-Key` in the Headers tab with a random UUID.
