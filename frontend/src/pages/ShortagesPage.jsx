import { useState } from 'react';
import Header from '../components/layout/Header.jsx';
import DataTable from '../components/ui/DataTable.jsx';
import StatusBadge from '../components/ui/StatusBadge.jsx';
import useApi from '../hooks/useApi.js';
import api from '../api/client.js';

export default function ShortagesPage() {
  const [showUrgentOnly, setShowUrgentOnly] = useState(false);
  const { data, loading, error, refetch } = useApi(
    () => api.get(showUrgentOnly ? '/shortages/urgent' : '/shortages'),
    [showUrgentOnly],
  );

  return (
    <>
      <Header
        title="Shortages"
        subtitle="Camps flagged with at least one shortage condition"
        actions={
          <div className="inline-flex rounded-md ring-1 ring-slate-300 overflow-hidden text-sm">
            <button
              type="button"
              className={'px-3 py-1.5 ' + (showUrgentOnly ? 'bg-white' : 'bg-primary-600 text-white')}
              onClick={() => setShowUrgentOnly(false)}
            >
              All
            </button>
            <button
              type="button"
              className={'px-3 py-1.5 ' + (showUrgentOnly ? 'bg-primary-600 text-white' : 'bg-white')}
              onClick={() => setShowUrgentOnly(true)}
            >
              Urgent
            </button>
          </div>
        }
      />
      <main className="p-6">
        {error && <div className="card text-red-600">{error.message}</div>}
        <DataTable
          loading={loading}
          rows={data || []}
          empty="No shortages — every camp is well-stocked."
          columns={[
            { key: 'campId',  header: 'Camp' },
            {
              key: 'urgent',
              header: 'Urgency',
              render: (r) => (r.urgent ? <StatusBadge value="URGENT" /> : <StatusBadge value="LOW" />),
            },
            { key: 'reason',  header: 'Reason' },
          ]}
        />
        <div className="mt-3 text-right">
          <button type="button" className="btn-secondary" onClick={refetch}>
            Refresh
          </button>
        </div>
      </main>
    </>
  );
}
