# Fenmo Frontend

A production-ready, beautiful, and highly responsive React frontend for the Fenmo Expense Tracker, designed with the premium **"Nocturnal Atelier"** aesthetic. 

## 🚀 Tech Stack & Libraries

This frontend is built for performance, stunning UI, and exceptional developer experience:

- **Core**: [React 19](https://react.dev/) powered by [Vite](https://vitejs.dev/) for blazing-fast hot module replacement.
- **Routing**: [React Router DOM v7](https://reactrouter.com/) (Client-side routing with protected routes).
- **State & Data Fetching**: [TanStack React Query v5](https://tanstack.com/query/latest) (For caching, re-fetching, and remote state management).
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/) (Utility-first CSS paired with custom global glassmorphism tokens).
- **Animations**: [Framer Motion](https://www.framer.com/motion/) (For smooth page transitions, micro-interactions, and modal overlays).
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) integrated with [Zod](https://zod.dev/) for strict client-side validation.
- **Icons & Typography**: Google Material Symbols Outlined, Noto Serif (Headings), Manrope (Body).

---

## 📁 Folder Structure

The project is modularized by feature and responsibility:

```
src/
├── api/             # Pure Axios functions calling the backend endpoints
├── components/      # Reusable UI elements (Layout, Navbar, Footer, ExpenseModal)
├── context/         # React Context providers (AuthContext for global user state)
├── hooks/           # Custom React Query hooks (useExpenses, useSummary, useDeleteExpense)
├── lib/             # Utilities (Currency formatting, Zod schemas, Idempotency generators)
├── pages/           # Route-level components (Dashboard, Vault, AddExpense, Login, Profile)
├── index.css        # Global Tailwind setup, Custom "Nocturnal" tokens, and CSS classes
└── App.jsx          # Main Router and protected route definitions
```

---

## ✨ Key Features

### 1. The "Nocturnal Atelier" Design System
A custom aesthetic defined by deep stone textures, warm primary glows (`#f0a047`), and glassmorphism panels (`backdrop-filter: blur()`). It feels premium, intimate, and secure.

### 2. Full CRUD Capabilities
- **Create**: Beautiful, pre-validated Add Expense form with **Idempotency Keys** injected to prevent duplicate network submissions.
- **Read**: Dashboard for quick summaries and "The Vault" for deep pagination and filtering of the master ledger.
- **Update**: Full-page forms that pre-fill existing data to safely modify transactions.
- **Delete**: Quick-access delete button inside the sleek view modal, connected to React Query's `invalidateQueries` for instant UI updates.

### 3. Advanced State Management
Zero `useEffect` data fetching! Everything is handled by `React Query`, ensuring:
- Background refetching.
- Stale-time management (less strain on the backend).
- Instant UI syncing across pages when an expense is added or deleted.

### 4. JWT Authentication Flow
Seamless routing that intercepts unauthenticated users, redirects them to `/login`, and maintains session state via `localStorage` and `useAuth` context. 

---

## ⚙️ Setup & Installation

### 1. Prerequisites
- Node.js (v18+ recommended)
- The Fenmo Backend running locally on port 5000.

### 2. Install Dependencies
Navigate into the `frontend` directory and install the packages:

```bash
cd frontend
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root of the `frontend` folder:

```env
# Points to your running backend API
VITE_API_URL=http://localhost:5000/api
```

### 4. Run Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000` (or `5173` depending on your Vite config).

---

## 🎨 Design Tokens & Classes (For Developers)
If you are extending the UI, you can use these custom classes defined in `index.css`:
- `.glass-card` / `.glass-panel`: Applies dark translucent backgrounds with blur.
- `.stone-texture`: A rich, noisy background image overlay.
- `.glowing-primary`: Adds an ambient, luxurious shadow to components.
- `.premium-shadow`: A deep drop-shadow for floating modals.

## 🤝 Credits
Designed and Developed with ❤️ by **Ajeet**.
