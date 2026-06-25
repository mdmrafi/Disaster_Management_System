import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../auth/auth.js';

/**
 * Guard wrapper for protected routes. If the user is not signed in, redirect
 * to /login while preserving the intended destination in router state.
 */
export default function RequireAuth({ children }) {
  const loc = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: loc }} />;
  }
  return children;
}
