import axios from 'axios';

/**
 * Shared Axios instance.
 *
 * Vite's dev server proxies /api/* to http://localhost:8080, so we use
 * a relative baseURL in development. In production builds, the same
 * relative path resolves against the same origin serving the SPA.
 */
const client = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
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
