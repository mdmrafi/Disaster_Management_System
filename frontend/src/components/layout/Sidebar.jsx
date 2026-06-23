import { NavLink } from 'react-router-dom';

const NAV = [
  { to: '/',                label: 'Dashboard',     end: true },
  { to: '/disasters',      label: 'Disasters' },
  { to: '/areas',          label: 'Affected Areas' },
  { to: '/camps',          label: 'Relief Camps' },
  { to: '/victims',        label: 'Victims' },
  { to: '/volunteers',     label: 'Volunteers' },
  { to: '/resources',      label: 'Resources' },
  { to: '/donations',      label: 'Donations' },
  { to: '/allocations',    label: 'Allocations' },
  { to: '/shortages',      label: 'Shortages' },
];

export default function Sidebar() {
  return (
    <aside className="w-56 shrink-0 bg-white ring-1 ring-slate-200 min-h-screen">
      <div className="px-4 py-5 border-b border-slate-200">
        <div className="text-sm font-semibold text-slate-800">Disaster Mgmt</div>
        <div className="text-xs text-slate-500">Relief Operations</div>
      </div>
      <nav className="p-2 space-y-0.5">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              'block rounded-md px-3 py-2 text-sm ' +
              (isActive
                ? 'bg-primary-50 text-primary-700 font-semibold'
                : 'text-slate-600 hover:bg-slate-100')
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
