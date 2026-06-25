import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, logout } from '../../auth/auth.js';

export default function Header() {
  const navigate = useNavigate();
  const user = getUser();
  const [menuOpen, setMenuOpen] = useState(false);

  const onLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const initials = (user?.username || user?.displayName || 'U')
    .split(/\s+/)
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="bg-surface-container-lowest border-b border-outline-variant sticky top-0 z-30 flex items-center justify-between px-md md:px-lg h-16">
      {/* Mobile brand */}
      <span className="md:hidden font-headline-md text-headline-md font-bold text-primary">
        Resilience Command
      </span>

      {/* Search */}
      <div className="hidden md:flex flex-1 max-w-md items-center bg-surface-container border border-outline-variant rounded-DEFAULT h-10 px-sm focus-within:border-primary transition-colors">
        <span className="material-symbols-outlined text-on-surface-variant text-[20px] mr-xs">search</span>
        <input
          className="flex-1 bg-transparent border-none focus:ring-0 outline-none font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant"
          placeholder="Search disasters, resources, victims..."
          type="text"
        />
      </div>

      {/* Right cluster */}
      <div className="flex items-center gap-sm ml-auto">
        <button
          aria-label="Notifications"
          className="relative w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
        >
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-secondary" />
        </button>
        <button
          aria-label="Settings"
          className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
        >
          <span className="material-symbols-outlined text-[22px]">settings</span>
        </button>

        <div className="relative ml-sm">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="w-8 h-8 rounded-full bg-primary text-on-primary font-bold font-label-md text-label-md flex items-center justify-center border border-outline-variant overflow-hidden"
            aria-label="User menu"
          >
            {initials || 'U'}
          </button>
          {menuOpen && (
            <div
              className="absolute right-0 mt-2 w-56 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg overflow-hidden z-50"
              onMouseLeave={() => setMenuOpen(false)}
            >
              <div className="px-md py-sm border-b border-outline-variant">
                <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  Signed in as
                </p>
                <p className="font-body-md text-body-md text-on-surface truncate">
                  {user?.username || user?.displayName || 'User'}
                </p>
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="w-full text-left px-md py-sm font-body-md text-body-md text-on-surface hover:bg-surface-container flex items-center gap-sm"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
