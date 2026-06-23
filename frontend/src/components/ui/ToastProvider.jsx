import { createContext, useCallback, useContext, useState } from 'react';

/**
 * Tiny toast system. Each toast has { id, kind, message } where kind is
 * 'success' | 'error' | 'info'. They auto-dismiss after 4s.
 *
 * Usage:
 *   const toast = useToast();
 *   toast.success('Saved');
 *   toast.error(err.message);
 */
const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const push = useCallback(
    (kind, message) => {
      const id = Date.now() + Math.random();
      setToasts((t) => [...t, { id, kind, message }]);
      setTimeout(() => remove(id), 4000);
    },
    [remove],
  );

  const value = {
    success: (m) => push('success', m),
    error:   (m) => push('error',   m),
    info:    (m) => push('info',    m),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2 w-80">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="alert"
            className={
              'rounded-md shadow-lg ring-1 p-3 text-sm ' +
              (t.kind === 'success'
                ? 'bg-green-50 ring-green-300 text-green-800'
                : t.kind === 'error'
                ? 'bg-red-50 ring-red-300 text-red-800'
                : 'bg-blue-50 ring-blue-300 text-blue-800')
            }
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
