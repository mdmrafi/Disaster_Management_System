import Header from '../components/layout/Header.jsx';
import useApi from '../hooks/useApi.js';
import api from '../api/client.js';
import StatusBadge from '../components/ui/StatusBadge.jsx';
import Spinner from '../components/ui/Spinner.jsx';

const Stat = ({ label, value, sub }) => (
  <div className="card">
    <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
    <div className="mt-1 text-2xl font-semibold text-slate-800">{value}</div>
    {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
  </div>
);

export default function DashboardPage() {
  const { data, loading, error } = useApi(
    () => api.get('/dashboard/summary'),
    [],
  );

  return (
    <>
      <Header title="Dashboard" subtitle="High-level snapshot of relief operations" />
      <main className="p-6 space-y-6">
        {loading && (
          <div className="flex items-center gap-2 text-slate-500">
            <Spinner /> Loading…
          </div>
        )}
        {error && <div className="card text-red-600">{error.message}</div>}
        {data && (
          <>
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Stat label="Active Disasters" value={data.activeDisasters ?? 0} />
              <Stat label="Relief Camps"      value={data.campCount ?? 0} />
              <Stat label="Total Victims"     value={data.victimCount ?? 0} />
            </section>

            <section className="card">
              <h2 className="text-sm font-semibold text-slate-800 mb-3">
                Urgent shortages ({data.urgentShortages?.length ?? 0})
              </h2>
              {(!data.urgentShortages || data.urgentShortages.length === 0) ? (
                <p className="text-sm text-slate-500">No urgent shortages reported.</p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {data.urgentShortages.map((s) => (
                    <li key={s.campId} className="py-2 flex items-center gap-3">
                      <StatusBadge value="URGENT" />
                      <span className="text-sm font-medium text-slate-800">
                        Camp #{s.campId}
                      </span>
                      <span className="text-sm text-slate-600">{s.reason}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </main>
    </>
  );
}
