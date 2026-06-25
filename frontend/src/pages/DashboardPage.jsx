import { useEffect, useState } from 'react';
import api from '../api/client.js';
import DataTable from '../components/ui/DataTable.jsx';
import StatusBadge from '../components/ui/StatusBadge.jsx';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    disasters: [],
    camps: [],
    resources: [],
    donations: [],
    allocations: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    Promise.all([
      api.get('/disasters').catch(() => ({ data: [] })),
      api.get('/camps').catch(() => ({ data: [] })),
      api.get('/resources').catch(() => ({ data: [] })),
      api.get('/donations').catch(() => ({ data: [] })),
      api.get('/allocations').catch(() => ({ data: [] })),
    ]).then(([d, c, r, dn, al]) => {
      if (!alive) return;
      setStats({
        disasters: d.data || [],
        camps: c.data || [],
        resources: r.data || [],
        donations: dn.data || [],
        allocations: al.data || [],
      });
    }).finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  const totalVictims = stats.camps.reduce((sum, c) => sum + (c.currentOccupancy || 0), 0);
  const totalCapacity = stats.camps.reduce((sum, c) => sum + (c.capacity || 0), 0);
  const activeDisasters = stats.disasters.filter(
    (d) => !d.endDate || new Date(d.endDate) > new Date()
  ).length;
  const totalResources = stats.resources.reduce((sum, r) => sum + (r.availableQuantity || 0), 0);
  const pendingAllocations = stats.allocations.filter((a) => a.status === 'PENDING').length;
  const totalDonations = stats.donations.reduce((sum, d) => sum + (d.quantity || 0), 0);

  const urgentCamps = [...stats.camps]
    .filter((c) => c.status !== 'CLOSED')
    .sort((a, b) => (b.currentOccupancy / Math.max(1, b.capacity)) - (a.currentOccupancy / Math.max(1, a.capacity)))
    .slice(0, 5);

  const recentDisasters = [...stats.disasters]
    .sort((a, b) => new Date(b.startDate || 0) - new Date(a.startDate || 0))
    .slice(0, 4);

  const cards = [
    {
      key: 'active',
      label: 'Active Disasters',
      value: activeDisasters,
      hint: `${stats.disasters.length} total recorded`,
      icon: 'warning',
      tone: 'text-secondary',
    },
    {
      key: 'victims',
      label: 'People Sheltered',
      value: totalVictims.toLocaleString(),
      hint: `${stats.camps.length} camps · ${totalCapacity.toLocaleString()} capacity`,
      icon: 'home_work',
      tone: 'text-primary',
    },
    {
      key: 'alloc',
      label: 'Pending Allocations',
      value: pendingAllocations,
      hint: `${stats.allocations.length} total this week`,
      icon: 'assignment_turned_in',
      tone: 'text-tertiary',
    },
    {
      key: 'donations',
      label: 'Donations Received',
      value: totalDonations.toLocaleString(),
      hint: `${stats.donations.length} contributions`,
      icon: 'volunteer_activism',
      tone: 'text-primary',
    },
  ];

  return (
    <div className="flex flex-col gap-lg">
      <header>
        <p className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant mb-xs">
          Overview
        </p>
        <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">
          Command Center
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
          Real-time status of relief operations across all districts.
        </p>
      </header>

      {/* Bento metrics */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-md">
        {cards.map((c) => (
          <div
            key={c.key}
            className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col gap-sm"
          >
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                {c.label}
              </span>
              <span
                className={`material-symbols-outlined text-[20px] ${c.tone}`}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {c.icon}
              </span>
            </div>
            <span className="font-display-lg text-display-lg font-bold text-on-surface leading-none">
              {loading ? '—' : c.value}
            </span>
            <span className="font-label-md text-label-md text-on-surface-variant">
              {c.hint}
            </span>
          </div>
        ))}
      </section>

      {/* Lower grid: urgent camps + recent disasters */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-md">
        <div className="xl:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-md border-b border-outline-variant">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-secondary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>priority_high</span>
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                Urgent Relief Camps
              </h2>
            </div>
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              Top 5 by occupancy
            </span>
          </div>
          <DataTable
            loading={loading}
            columns={[
              { key: 'campName', header: 'Camp' },
              { key: 'location', header: 'Location' },
              {
                key: 'occupancy',
                header: 'Occupancy',
                render: (r) => {
                  const pct = Math.round(((r.currentOccupancy || 0) / Math.max(1, r.capacity || 1)) * 100);
                  return (
                    <div className="flex items-center gap-sm">
                      <div className="w-24 h-2 rounded-full bg-surface-container overflow-hidden">
                        <div
                          className={
                            pct >= 90 ? 'h-full bg-secondary' :
                            pct >= 70 ? 'h-full bg-primary' :
                            'h-full bg-tertiary'
                          }
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                      <span className="font-label-md text-label-md text-on-surface-variant">
                        {r.currentOccupancy}/{r.capacity}
                      </span>
                    </div>
                  );
                },
              },
              { key: 'status', header: 'Status', render: (r) => <StatusBadge value={r.status} /> },
            ]}
            rows={urgentCamps}
            emptyMessage="No active camps."
          />
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-md border-b border-outline-variant">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                Recent Disasters
              </h2>
            </div>
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              Latest events
            </span>
          </div>
          <ul className="divide-y divide-outline-variant">
            {recentDisasters.length === 0 && !loading && (
              <li className="p-md font-body-md text-body-md text-on-surface-variant text-center">
                No disasters recorded.
              </li>
            )}
            {recentDisasters.map((d) => (
              <li key={d.disasterId} className="p-md flex flex-col gap-xs">
                <div className="flex items-center justify-between">
                  <span className="font-body-lg text-body-lg font-bold text-on-surface truncate">
                    {d.disasterName}
                  </span>
                  <StatusBadge value={d.severityLevel} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                    {d.disasterType}
                  </span>
                  <span className="font-label-md text-label-md text-on-surface-variant">
                    {d.startDate ? new Date(d.startDate).toLocaleDateString() : '—'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Resources snapshot */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-md border-b border-outline-variant">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-tertiary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
              Resources In Stock
            </h2>
          </div>
          <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
            {totalResources.toLocaleString()} units across {stats.resources.length} categories
          </span>
        </div>
        <div className="p-md grid grid-cols-2 md:grid-cols-5 gap-md">
          {stats.resources.length === 0 && !loading && (
            <p className="col-span-full font-body-md text-body-md text-on-surface-variant text-center">
              No resources registered.
            </p>
          )}
          {stats.resources.map((r) => (
            <div key={r.resourceId} className="bg-surface-container border border-outline-variant rounded-lg p-sm flex flex-col gap-xs">
              <StatusBadge value={r.category} />
              <span className="font-body-lg text-body-lg font-bold text-on-surface truncate" title={r.resourceName}>
                {r.resourceName}
              </span>
              <span className="font-label-md text-label-md text-on-surface-variant">
                {r.availableQuantity}/{r.totalQuantity} available
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
