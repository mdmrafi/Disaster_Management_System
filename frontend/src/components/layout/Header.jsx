export default function Header({ title, subtitle, actions }) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
      <div>
        <h1 className="text-lg font-semibold text-slate-800">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}
