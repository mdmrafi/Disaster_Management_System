/**
 * Auth helpers — token persistence in localStorage, login/logout, and a
 * subscription model so components (Header, RequireAuth) re-render when the
 * user signs in or out.
 *
 *   auth.getToken()    -> string | null
 *   auth.login(...)    -> POST /api/auth/login, store token, notify
 *   auth.logout()      -> clear token, notify
 *   auth.subscribe(fn) -> unsubscribe()
 *   auth.getUser()     -> { email, displayName, role } | null
 */

const TOKEN_KEY = 'dm.token';
const USER_KEY  = 'dm.user';

const subs = new Set();
const notify = () => subs.forEach((fn) => { try { fn(); } catch (_) { /* noop */ } });

export function getToken() {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}

export function getUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function isAuthenticated() {
  return !!getToken();
}

export function subscribe(fn) {
  subs.add(fn);
  return () => subs.delete(fn);
}

export async function login(email, password) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    // Try to extract the standard error envelope
    let msg = `Login failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.message) msg = body.message;
    } catch { /* ignore */ }
    throw new Error(msg);
  }
  const body = await res.json();
  if (!body?.token) throw new Error('Login response missing token');
  try {
    localStorage.setItem(TOKEN_KEY, body.token);
    const u = body.user;
    if (u && (u.email || u.displayName || u.role)) {
      localStorage.setItem(USER_KEY, JSON.stringify({
        id: u.id,
        email: u.email,
        displayName: u.displayName,
        role: u.role,
      }));
    }
  } catch { /* storage unavailable — token will be lost on reload */ }
  notify();
  return body;
}

export function logout() {
  try { localStorage.removeItem(TOKEN_KEY); } catch { /* noop */ }
  try { localStorage.removeItem(USER_KEY);  } catch { /* noop */ }
  notify();
}
