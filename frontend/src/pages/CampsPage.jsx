import CrudPage from '../components/CrudPage.jsx';
import api from '../api/client.js';
import StatusBadge from '../components/ui/StatusBadge.jsx';

const STATUSES = ['ACTIVE', 'FULL', 'CLOSED'];

export default function CampsPage() {
  return (
    <CrudPage
      title="Relief Camps"
      subtitle="Temporary shelters housing disaster victims"
      addLabel="New camp"
      loadRows={() => api.get('/camps').then((r) => r.data)}
      createRow={(body) => api.post('/camps', body).then((r) => r.data)}
      updateRow={(id, body) => api.put(`/camps/${id}`, body).then((r) => r.data)}
      deleteRow={(id) => api.delete(`/camps/${id}`)}
      columns={[
        { key: 'campId',          header: 'ID' },
        { key: 'campName',        header: 'Name' },
        { key: 'areaId',          header: 'Area' },
        { key: 'capacity',        header: 'Capacity' },
        { key: 'currentOccupancy',header: 'Occupancy' },
        { key: 'status',          header: 'Status', render: (r) => <StatusBadge value={r.status} /> },
      ]}
      fields={[
        { name: 'campName',       label: 'Camp name',  required: true },
        { name: 'areaId',         label: 'Area ID',    type: 'number', required: true, min: 1 },
        { name: 'capacity',       label: 'Capacity',   type: 'number', required: true, min: 1 },
        { name: 'currentOccupancy', label: 'Current occupancy', type: 'number', min: 0, defaultValue: 0 },
        { name: 'status',         label: 'Status',     type: 'select', required: true, options: STATUSES },
      ]}
    />
  );
}
