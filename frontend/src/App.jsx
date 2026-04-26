import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import AddExpense from './pages/AddExpense';
import Insights from './pages/Insights';
import Vault from './pages/Vault';
import EditExpense from './pages/EditExpense';
import Profile from './pages/Profile';

const queryClient = new QueryClient();

function ProtectedRoute({ children }) {
  const { isAuth, isBootstrapping } = useAuth();
  if (isBootstrapping) return null;
  return isAuth ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { isAuth, isBootstrapping } = useAuth();
  if (isBootstrapping) return null;
  return !isAuth ? children : <Navigate to="/" replace />;
}

function AppContent() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
      <Route path="/vault" element={<ProtectedRoute><Vault /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/add" element={<ProtectedRoute><AddExpense /></ProtectedRoute>} />
      <Route path="/expense/:id/edit" element={<ProtectedRoute><EditExpense /></ProtectedRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
