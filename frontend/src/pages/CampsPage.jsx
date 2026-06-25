import CrudPage from '../components/CrudPage.jsx';
import api from '../api/client.js';

const CAMP_STATUSES = ['ACTIVE', 'FULL', 'CLOSED'];

export default function CampsPage() {
  return (
    <CrudPage
      eyebrow="Shelter"
      title="Relief Camps"
      subtitle="Temporary shelters housing disaster victims"
      addLabel="New camp"
      loadRows={() => api.get('/camps').then((r) => r.data)}
      createRow={(body) => api.post('/camps', body).then((r) => r.data)}
      updateRow={(id, body) => api.put(`/camps/${id}`, body).then((r) => r.data)}
      deleteRow={(id) => api.delete(`/camps/${id}`)}
      toFormValues={(r) => ({
        campName: r.campName,
        location: r.location,
        areaId:   r.areaId,
        capacity: r.capacity,
        latitude: r.latitude,
        longitude: r.longitude,
        status:   r.status,
      })}
      fromFormValues={(f) => ({
        campName:  f.campName,
        location:  f.location,
        areaId:    Number(f.areaId),
        capacity:  Number(f.capacity),
        latitude:  f.latitude  === '' || f.latitude  == null ? null : Number(f.latitude),
        longitude: f.longitude === '' || f.longitude == null ? null : Number(f.longitude),
        status:    f.status || null,
      })}
      columns={[
        { key: 'campId',           header: 'ID',       width: '80px' },
        { key: 'campName',         header: 'Camp' },
        { key: 'location',         header: 'Location' },
        { key: 'areaName',         header: 'Area' },
        { key: 'capacity',         header: 'Capacity', align: 'right' },
        { key: 'currentOccupancy', header: 'Occupancy', align: 'right' },
        { key: 'status',           header: 'Status' },
      ]}
      fields={[
        { name: 'campName',  label: 'Camp name', required: true },
        { name: 'location',  label: 'Location',  required: true },
        { name: 'areaId',    label: 'Area ID',   type: 'number', required: true, min: 1 },
        { name: 'capacity',  label: 'Capacity',  type: 'number', required: true, min: 1 },
        { name: 'status',    label: 'Status',    type: 'select', options: CAMP_STATUSES },
        { name: 'latitude',  label: 'Latitude',  type: 'number', min: -90,  max: 90,  step: 0.000001 },
        { name: 'longitude', label: 'Longitude', type: 'number', min: -180, max: 180, step: 0.000001 },
      ]}
      filters={[{ key: 'status', label: 'statuses', options: CAMP_STATUSES }]}
      searchKeys={['campName', 'location', 'areaName']}
      metrics={[
        {
          key: 'camps',
          label: 'Active Camps',
          icon: 'home_work',
          tone: 'text-primary',
          compute: (rows) => rows.filter((c) => c.status !== 'CLOSED').length,
        },
        {
          key: 'victims',
          label: 'People Sheltered',
          icon: 'person',
          tone: 'text-primary',
          compute: (rows) => rows.reduce((s, c) => s + (c.currentOccupancy || 0), 0).toLocaleString(),
        },
        {
          key: 'capacity',
          label: 'Total Capacity',
          icon: 'group',
          tone: 'text-tertiary',
          compute: (rows) => rows.reduce((s, c) => s + (c.capacity || 0), 0).toLocaleString(),
        },
        {
          key: 'full',
          label: 'At Capacity',
          icon: 'priority_high',
          tone: 'text-secondary',
          compute: (rows) => rows.filter((c) => c.status === 'FULL' || (c.capacity && c.currentOccupancy >= c.capacity)).length,
        },
      ]}
    />
  );
}
