/**
 * api/axiosClient.js
 *
 * Single Axios instance for the entire app.
 * • Reads base URL from VITE_API_URL env var (falls back to /api via Vite proxy)
 * • Request interceptor: injects JWT from localStorage on every request
 * • Response interceptor: normalises error messages + auto-logout on 401
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: attach token ──────────────────────────────────────
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response interceptor: normalise errors ─────────────────────────────────
axiosClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.errors?.[0] ||
      error.message ||
      'Something went wrong';

    // Auto-logout on 401 (expired / invalid token)
    if (error?.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(new Error(message));
  }
);

export default axiosClient;
