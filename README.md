# Fenmo: Full-Stack Expense Tracker
Live link : https://aymoneymind.vercel.app/
This repository contains **Fenmo**, a minimal, production-ready full-stack Expense Tracker built to satisfy the personal finance tool assignment requirements.

The system is designed to handle real-world conditions like unreliable networks, browser refreshes, and duplicate submissions, while maintaining exact precision for financial data.

---

## 🎯 Assignment Fulfillment

### **1. Backend (API)**
- **`POST /api/expenses`**: Creates a new expense (amount, category, description, date). 
  - **Resilience**: It handles retries safely. The frontend generates a unique `Idempotency-Key` header. If a network drops and the client retries, the backend intercepts the duplicate key and returns the previously created expense without duplicating the database record.
- **`GET /api/expenses`**: Returns a list of expenses.
  - Supports query parameters: `category` (filters exactly) and `sort=date_desc` (sorts by newest first).
- **Data Model**: Includes `id` (`_id`), `amount`, `category`, `description`, `date`, and `createdAt`.

### **2. Frontend (UI)**
- **Add Expense Form**: Pre-validated form that submits data to the backend.
- **Expense List (The Vault)**: A master ledger displaying all records.
- **Controls**: Includes a category dropdown to filter, and a date sort toggle (newest first).
- **Total Amount**: Dynamically calculates and displays the "Total Spend" based *only* on the currently visible/filtered expenses on the Dashboard.
- **Resilience**: Client-side protection prevents multiple clicks from firing multiple requests. React Query manages loading and error states seamlessly.

### **3. Nice-to-Haves Included**
- **Authentication**: JWT-based user login/registration to ensure users only see their own private financial data.
- **Basic Validation**: React Hook Form + Zod on the frontend, and `express-validator` on the backend ensure negative amounts and missing dates are rejected.
- **Summary View**: A dedicated `Insights` page showing totals aggregated by category.
- **Multi-Currency Support**: Record and track expenses in **INR (₹), USD ($), EUR (€), and GBP (£)**. Totals are intelligently grouped and formatted per currency.
- **Automated Tests**: Integration tests built with Jest and Supertest for the backend API.

---

## 🗄️ Persistence Mechanism: Why MongoDB?

I chose **MongoDB** (with Mongoose) as the database for this project.

**Brief Explanation:**
When dealing with real money, using standard JavaScript floating-point numbers (`Number`) is dangerous due to precision loss (e.g., `0.1 + 0.2 = 0.30000000000000004`). 
MongoDB natively supports the **`Decimal128`** BSON type, which guarantees 100% exact precision for currency arithmetic. Furthermore, Mongoose provides excellent schema-level validation, and MongoDB's flexible indexing makes querying by `category` and sorting by `date` incredibly fast. It's a perfect fit for a system that might grow into a larger financial application.

---

## 🧠 Design Decisions & Trade-offs

As requested, here is a breakdown of the architectural choices made under the assignment's constraints.

### **Key Design Decisions**
1. **Idempotent Requests over Simple Throttling**: Instead of just disabling the submit button (which fails if the user hard-refreshes the page mid-flight), the frontend generates a `UUIDv4` token attached to the `Idempotency-Key` header. The backend caches this. This is the only bulletproof way to handle network retries for financial transactions.
2. **Controller/Service Architecture**: The backend is split into Routes (HTTP mapping), Controllers (req/res handling), and Services (business logic). This keeps the code highly testable and prevents "fat controllers."
3. **TanStack React Query**: Used instead of standard `useEffect` fetching. It automatically handles caching, stale-time, background refetching, and drastically simplifies complex loading/error states in the UI.

### **Trade-offs Made Because of the Timebox**
1. **In-Memory Idempotency Cache**: The backend currently stores idempotency keys in memory. In a real production environment with multiple server instances, this would need to be moved to a shared store like **Redis**. For the scope of this assignment, in-memory was faster to implement and avoids requiring reviewers to spin up a Redis container.
2. **Frontend Test Coverage**: While the backend has an automated integration suite, the frontend relies on manual verification to save time for UI polish and core logic correctness.

### **What Was Intentionally Not Done**
- **Dockerization**: Omitted to keep the setup instructions strictly to standard `npm` commands, reducing friction for reviewers.
- **End-to-End (E2E) Tests**: Cypress/Playwright tests were skipped in favor of ensuring the unit/integration layers on the backend were solid.

---

## ⚙️ How to Run the Project

### 1. Start the Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
NODE_ENV=development
JWT_SECRET=super_secret_key
JWT_EXPIRE=7d
```
Start the server:
```bash
npm run dev
```

### 2. Start the Frontend
Open a new terminal tab:
```bash
cd frontend
npm install
```
Create a `.env.local` file in the `frontend` folder:
```env
VITE_API_URL=http://localhost:5000/api
```
Start the Vite dev server:
```bash
npm run dev
```

Visit `http://localhost:3000` (or `5173`) in your browser to interact with the application!
