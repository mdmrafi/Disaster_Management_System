import { NavLink } from 'react-router-dom';

const NAV = [
  { to: '/dashboard',     label: 'Dashboard',      icon: 'dashboard' },
  { to: '/disasters',     label: 'Disasters',      icon: 'warning' },
  { to: '/affected-areas',label: 'Affected Areas', icon: 'map' },
  { to: '/camps',         label: 'Relief Camps',   icon: 'home_work' },
  { to: '/victims',       label: 'Victims',        icon: 'person_pin_circle' },
  { to: '/volunteers',    label: 'Volunteers',     icon: 'group' },
  { to: '/resources',     label: 'Resources',      icon: 'inventory_2' },
  { to: '/donations',     label: 'Donations',      icon: 'volunteer_activism' },
  { to: '/allocations',   label: 'Allocations',    icon: 'assignment_turned_in' },
  { to: '/shortages',     label: 'Shortages',      icon: 'report_problem' },
];

function NavItem({ to, label, icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'flex items-center gap-md px-md py-sm rounded-lg transition-all',
          'text-on-surface-variant hover:bg-surface-container hover:text-primary',
          isActive
            ? 'bg-surface-container-high text-primary font-bold'
            : '',
        ].join(' ')
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`material-symbols-outlined text-[20px] ${isActive ? 'icon-fill' : ''}`}
          >
            {icon}
          </span>
          <span className="font-label-md text-label-md">{label}</span>
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar() {
  return (
    <nav
      aria-label="Sidebar Navigation"
      className="hidden md:flex bg-surface-container-lowest border-r border-outline-variant fixed left-0 top-0 bottom-0 w-[280px] z-40 flex-col py-lg px-md"
    >
      {/* Brand block */}
      <div className="mb-lg px-sm flex items-center gap-md">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-on-primary icon-fill" style={{ fontSize: '22px' }}>
            shield
          </span>
        </div>
        <div className="min-w-0">
          <h1 className="font-headline-md text-headline-md font-black text-on-surface leading-tight truncate">
            Command Center
          </h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mt-0.5 truncate">
            Disaster Operations
          </p>
        </div>
      </div>

      {/* Main nav */}
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-xs">
        {NAV.map((n) => (
          <NavItem key={n.to} {...n} />
        ))}
      </div>

      {/* Footer actions */}
      <div className="mt-auto pt-md border-t border-outline-variant flex flex-col gap-xs">
        <a
          className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container transition-all cursor-pointer"
          href="#"
        >
          <span className="material-symbols-outlined text-[20px]">help</span>
          <span className="font-label-md text-label-md">Support</span>
        </a>
        <a
          className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container transition-all cursor-pointer"
          href="#"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span className="font-label-md text-label-md">Sign Out</span>
        </a>
      </div>
    </nav>
  );
}
