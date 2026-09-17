/**
 * services/api.js
 *
 * Central Axios instance for the ScrapSense frontend.
 * Reads the JWT from localStorage (same key used by AuthContext) and
 * attaches it as a Bearer token on every request.
 *
 * AuthContext continues to own the login/signup/logout/token-storage logic.
 * Components import this file when they need to call the backend directly.
 */
import axios from 'axios';

const api = axios.create({
  // Vite proxies /api → http://localhost:5000, so no base URL needed.
  // If you later deploy separately, set VITE_API_URL in .env.
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Item APIs ────────────────────────────────────────────────────────────────
export const itemsApi = {
  getAll: () => api.get('/items'),
  getById: (itemId) => api.get(`/items/${itemId}`),
  create: (data) => api.post('/items', data),
  update: (itemId, data) => api.patch(`/items/${itemId}`, data),
};

// ─── Inspection request APIs ───────────────────────────────────────────────
export const requestsApi = {
  submitInspection: (formData) =>
    api.post('/inspections', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getMyRequests: () => api.get('/inspections/my-requests'),
  // Manager endpoints (future use)
  getAll: () => api.get('/inspections'),
};

// ─── Inventory APIs (stubs for future tasks) ──────────────────────────────────
export const inventoryApi = {
  getCurrent: () => api.get('/inventory'),
  getLogs: () => api.get('/inventory/logs'),
};

export default api;
