import CrudPage from '../components/CrudPage.jsx';
import api from '../api/client.js';
import StatusBadge from '../components/ui/StatusBadge.jsx';

const SEVERITIES = ['LOW', 'MEDIUM', 'HIGH', 'CATASTROPHIC'];
const STATUSES   = ['ACTIVE', 'CONTAINED', 'RESOLVED'];

export default function DisastersPage() {
  return (
    <CrudPage
      title="Disasters"
      subtitle="Top-level events that triggered relief operations"
      addLabel="New disaster"
      loadRows={() => api.get('/disasters').then((r) => r.data)}
      createRow={(body) => api.post('/disasters', body).then((r) => r.data)}
      updateRow={(id, body) => api.put(`/disasters/${id}`, body).then((r) => r.data)}
      deleteRow={(id) => api.delete(`/disasters/${id}`)}
      columns={[
        { key: 'disasterId',     header: 'ID' },
        { key: 'name',           header: 'Name' },
        { key: 'type',           header: 'Type' },
        { key: 'severity',       header: 'Severity', render: (r) => <StatusBadge value={r.severity} /> },
        { key: 'status',         header: 'Status',   render: (r) => <StatusBadge value={r.status} /> },
        { key: 'startDate',      header: 'Start' },
        { key: 'endDate',        header: 'End' },
      ]}
      fields={[
        { name: 'name',        label: 'Name',        required: true },
        { name: 'type',        label: 'Type',        required: true, placeholder: 'FLOOD, EARTHQUAKE, …' },
        { name: 'severity',    label: 'Severity',    type: 'select', required: true, options: SEVERITIES },
        { name: 'status',      label: 'Status',      type: 'select', required: true, options: STATUSES },
        { name: 'startDate',   label: 'Start date',  type: 'date',   required: true },
        { name: 'endDate',     label: 'End date',    type: 'date' },
        { name: 'location',    label: 'Location',    required: true },
        { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
      ]}
    />
  );
}
