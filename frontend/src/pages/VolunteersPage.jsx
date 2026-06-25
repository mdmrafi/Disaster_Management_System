import CrudPage from '../components/CrudPage.jsx';
import api from '../api/client.js';

const SPECIALIZATIONS = ['MEDICAL', 'LOGISTICS', 'FOOD_DISTRIBUTION', 'RESCUE'];
const AVAILABILITY    = ['AVAILABLE', 'BUSY', 'ASSIGNED', 'UNAVAILABLE'];

export default function VolunteersPage() {
  return (
    <CrudPage
      eyebrow="Workforce"
      title="Volunteers"
      subtitle="People offering their time to relief operations"
      addLabel="New volunteer"
      loadRows={() => api.get('/volunteers').then((r) => r.data)}
      createRow={(body) => api.post('/volunteers', body).then((r) => r.data)}
      updateRow={(id, body) => api.put(`/volunteers/${id}`, body).then((r) => r.data)}
      deleteRow={(id) => api.delete(`/volunteers/${id}`)}
      columns={[
        { key: 'volunteerId',        header: 'ID',     width: '80px' },
        { key: 'name',               header: 'Name' },
        { key: 'phone',              header: 'Phone' },
        { key: 'specialization',     header: 'Specialization' },
        { key: 'availabilityStatus', header: 'Availability' },
      ]}
      fields={[
        { name: 'name',               label: 'Name',          required: true },
        { name: 'phone',              label: 'Phone',         required: true },
        { name: 'specialization',     label: 'Specialization', type: 'select', required: true, options: SPECIALIZATIONS },
        { name: 'availabilityStatus', label: 'Availability',   type: 'select', required: true, options: AVAILABILITY, defaultValue: 'AVAILABLE' },
      ]}
      filters={[
        { key: 'specialization',     label: 'specializations', options: SPECIALIZATIONS },
        { key: 'availabilityStatus', label: 'availabilities',  options: AVAILABILITY },
      ]}
      searchKeys={['name', 'phone', 'specialization']}
      metrics={[
        {
          key: 'total',
          label: 'Total Volunteers',
          icon: 'volunteer_activism',
          tone: 'text-primary',
          compute: (rows) => rows.length,
        },
        {
          key: 'available',
          label: 'Available',
          icon: 'check_circle',
          tone: 'text-tertiary',
          compute: (rows) => rows.filter((v) => v.availabilityStatus === 'AVAILABLE').length,
        },
        {
          key: 'busy',
          label: 'On Assignment',
          icon: 'engineering',
          tone: 'text-primary',
          compute: (rows) => rows.filter((v) => v.availabilityStatus === 'BUSY' || v.availabilityStatus === 'ASSIGNED').length,
        },
        {
          key: 'medical',
          label: 'Medical',
          icon: 'medical_services',
          tone: 'text-primary',
          compute: (rows) => rows.filter((v) => v.specialization === 'MEDICAL').length,
        },
      ]}
    />
  );
}
