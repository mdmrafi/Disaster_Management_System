import { useEffect, useState } from 'react';
import api from '../api/client.js';
import StatusBadge from '../components/ui/StatusBadge.jsx';

const SEVERITY_TONE = {
  CRITICAL: 'text-secondary',
  HIGH:     'text-secondary',
  MEDIUM:   'text-primary',
  LOW:      'text-tertiary',
};

const SEVERITY_ICON = {
  CRITICAL: 'priority_high',
  HIGH:     'error',
  MEDIUM:   'warning',
  LOW:      'info',
};

export default function ShortagesPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/shortages');
      setRows(data || []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const criticalCount = rows.filter((r) => r.severity === 'CRITICAL' || r.severity === 'HIGH').length;

  return (
    <div className="flex flex-col gap-lg">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-md">
        <div>
          <p className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant mb-xs">
            Monitoring
          </p>
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">
            Shortage Alerts
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
            Resources below safe thresholds across active camps
          </p>
        </div>
        <div className="flex items-center gap-sm bg-error-container border border-outline-variant rounded-lg px-md py-sm">
          <span className="material-symbols-outlined text-error text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            report_problem
          </span>
          <span className="font-label-md text-label-md text-error uppercase tracking-wider">
            {criticalCount} critical / high
          </span>
        </div>
      </header>

      {error && (
        <div className="bg-error-container border border-outline-variant rounded-lg p-md font-body-md text-body-md text-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-surface-container border border-outline-variant rounded-xl h-48 animate-pulse" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl flex flex-col items-center gap-sm">
          <span className="material-symbols-outlined text-tertiary text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
            All clear
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            No active shortages detected.
          </p>
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md">
          {rows.map((r, i) => {
            const tone = SEVERITY_TONE[r.severity] || 'text-on-surface-variant';
            const icon = SEVERITY_ICON[r.severity] || 'info';
            const pct = Math.max(0, Math.min(100, Math.round(((r.availableQuantity || 0) / Math.max(1, r.threshold || 1)) * 100)));
            return (
              <article
                key={`${r.resourceId || r.resourceName}-${r.campId || r.campName}-${i}`}
                className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col gap-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-sm">
                    <span
                      className={`material-symbols-outlined ${tone} text-[22px]`}
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {icon}
                    </span>
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface truncate">
                      {r.resourceName}
                    </h3>
                  </div>
                  <StatusBadge value={r.severity || 'LOW'} />
                </div>

                <p className="font-body-md text-body-md text-on-surface-variant">
                  {r.campName ? `at ${r.campName}` : 'across all camps'}
                </p>

                <div className="flex flex-col gap-xs">
                  <div className="flex items-center justify-between font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                    <span>Available</span>
                    <span>{r.availableQuantity ?? 0} / {r.threshold ?? '—'} required</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                    <div
                      className={r.severity === 'CRITICAL' || r.severity === 'HIGH' ? 'h-full bg-secondary' : 'h-full bg-primary'}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-xs border-t border-outline-variant">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                    {r.category || 'Resource'}
                  </span>
                  <span className="font-label-md text-label-md text-on-surface-variant">
                    Shortfall: {Math.max(0, (r.threshold || 0) - (r.availableQuantity || 0))}
                  </span>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
