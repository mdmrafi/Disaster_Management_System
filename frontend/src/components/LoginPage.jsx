import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '../auth/auth.js';

/**
 * Centered login card. On success, navigates to `from` (or `/`).
 * The seed admin created by the backend's DataInitializer is:
 *   admin@resilience.local / admin123
 */
export default function LoginPage() {
  const nav      = useNavigate();
  const loc      = useLocation();
  const from     = loc.state?.from?.pathname || '/';
  const [email, setEmail]       = useState('admin@resilience.local');
  const [password, setPassword] = useState('admin123');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      nav(from, { replace: true });
    } catch (e2) {
      setError(e2.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-sm ring-1 ring-slate-200 p-6">
        <h1 className="text-lg font-semibold text-slate-800">Disaster Management</h1>
        <p className="text-xs text-slate-500 mb-4">Sign in to continue</p>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 ring-1 ring-red-200 px-3 py-2 text-xs text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full disabled:opacity-50"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-4 text-[11px] text-slate-400">
          Seed credentials are pre-filled for local development.
        </p>
      </div>
    </div>
  );
}
