import CrudPage from '../components/CrudPage.jsx';
import api from '../api/client.js';
import StatusBadge from '../components/ui/StatusBadge.jsx';

const AVAILABILITY = ['AVAILABLE', 'BUSY', 'OFFLINE'];

export default function VolunteersPage() {
  return (
    <CrudPage
      title="Volunteers"
      subtitle="People offering their time to relief operations"
      addLabel="New volunteer"
      loadRows={() => api.get('/volunteers').then((r) => r.data)}
      createRow={(body) => api.post('/volunteers', body).then((r) => r.data)}
      updateRow={(id, body) => api.put(`/volunteers/${id}`, body).then((r) => r.data)}
      deleteRow={(id) => api.delete(`/volunteers/${id}`)}
      columns={[
        { key: 'volunteerId',    header: 'ID' },
        { key: 'name',           header: 'Name' },
        { key: 'phone',          header: 'Phone' },
        { key: 'skills',         header: 'Skills' },
        { key: 'availabilityStatus', header: 'Status', render: (r) => <StatusBadge value={r.availabilityStatus} /> },
      ]}
      fields={[
        { name: 'name',               label: 'Name',     required: true },
        { name: 'phone',              label: 'Phone',    required: true },
        { name: 'email',              label: 'Email',    type: 'email' },
        { name: 'skills',             label: 'Skills',   placeholder: 'First-aid, driving, …' },
        { name: 'availabilityStatus', label: 'Availability', type: 'select', required: true, options: AVAILABILITY },
      ]}
    />
  );
}
