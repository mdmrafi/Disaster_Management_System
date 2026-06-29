import axios from 'axios';
import { getToken } from '../auth/auth.js';

/**
 * Shared Axios instance.
 *
 * Vite's dev server proxies /api/* to http://localhost:8080, so the
 * default baseURL '/api' works out of the box for `npm run dev`. In
 * production builds we read VITE_API_URL (set in render.yaml for the
 * Render static site) so the SPA talks to the deployed Spring Boot
 * service. If VITE_API_URL is unset, we fall back to '/api' which works
 * for setups where the API is reverse-proxied on the same origin.
 */
const baseURL = import.meta.env.VITE_API_URL || '/api';

const client = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

/* ---------- Request interceptor ----------
 * Attach the JWT (if any) to every outbound request except /auth/login.
 * `getToken()` reads from localStorage on each call so a login that happens
 * after the client was created is picked up automatically.
 */
client.interceptors.request.use((config) => {
  const token = getToken();
  const url = config.url || '';
  if (token && !url.includes('/auth/login')) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ---------- Response interceptor ----------
 * Backend's GlobalExceptionHandler returns envelopes of the form
 *   { timestamp, status, error, message, path, details }
 * We unpack `message` (and `details` if present) so callers can do
 *   try { await api.get(...) }
 *   catch (e) { toast.error(e.message) }
 */
client.interceptors.response.use(
  (resp) => resp,
  (error) => {
    const data = error?.response?.data;
    if (data && typeof data === 'object') {
      const parts = [];
      if (data.message) parts.push(data.message);
      if (Array.isArray(data.details) && data.details.length) {
        parts.push(data.details.join('; '));
      }
      if (parts.length) {
        error.message = parts.join(' — ');
      }
    }
    return Promise.reject(error);
  },
);

export default client;
