import { useEffect } from 'react';

/** Simple controlled modal. Closes on Escape and backdrop click. */
export default function Modal({ open, title, onClose, children, footer, maxWidth = 'max-w-lg' }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-md"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="absolute inset-0 bg-primary/60"
        onClick={onClose}
      />
      <div className={`relative z-50 w-full ${maxWidth} rounded-xl bg-surface-container-lowest shadow-xl border border-outline-variant overflow-hidden`}>
        <header className="flex items-center justify-between px-md py-sm border-b border-outline-variant bg-surface-container">
          <h3 className="font-headline-md text-headline-md text-on-surface">{title}</h3>
          <button
            type="button"
            className="p-xs rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </header>
        <div className="px-md py-md max-h-[70vh] overflow-y-auto">{children}</div>
        {footer && (
          <footer className="flex justify-end gap-sm px-md py-sm border-t border-outline-variant bg-surface-container-low">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}
