import { useEffect } from 'react';

/** Simple controlled modal. Closes on Escape and backdrop click. */
export default function Modal({ open, title, onClose, children, footer }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="absolute inset-0 bg-slate-900/50"
        onClick={onClose}
      />
      <div className="relative z-50 w-full max-w-lg rounded-lg bg-white shadow-xl ring-1 ring-slate-200">
        <header className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
          <button
            type="button"
            className="btn-ghost"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </header>
        <div className="px-4 py-3">{children}</div>
        {footer && (
          <footer className="flex justify-end gap-2 px-4 py-3 border-t border-slate-200">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}
