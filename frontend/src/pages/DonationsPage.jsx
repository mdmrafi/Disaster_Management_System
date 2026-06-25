import CrudPage from '../components/CrudPage.jsx';
import api from '../api/client.js';

export default function DonationsPage() {
  return (
    <CrudPage
      eyebrow="Inbound"
      title="Donations"
      subtitle="Inbound contributions that increase resource stock"
      addLabel="Record donation"
      loadRows={() => api.get('/donations').then((r) => r.data)}
      createRow={(body) => api.post('/donations', body).then((r) => r.data)}
      deleteRow={(id) => api.delete(`/donations/${id}`)}
      columns={[
        { key: 'donationId',   header: 'ID',     width: '80px' },
        { key: 'donorName',    header: 'Donor' },
        { key: 'disasterName', header: 'Disaster' },
        { key: 'resourceName', header: 'Resource' },
        { key: 'quantity',     header: 'Qty',     align: 'right' },
        { key: 'donationDate', header: 'Date' },
      ]}
      fields={[
        { name: 'donorName',    label: 'Donor name',  required: true },
        { name: 'disasterId',   label: 'Disaster ID', type: 'number', required: true, min: 1 },
        { name: 'resourceId',   label: 'Resource ID', type: 'number', required: true, min: 1 },
        { name: 'quantity',     label: 'Quantity',    type: 'number', required: true, min: 1 },
        { name: 'donationDate', label: 'Date',        type: 'date',   required: true },
      ]}
      searchKeys={['donorName', 'disasterName', 'resourceName']}
      metrics={[
        {
          key: 'count',
          label: 'Donations',
          icon: 'volunteer_activism',
          tone: 'text-primary',
          compute: (rows) => rows.length,
        },
        {
          key: 'units',
          label: 'Total Units',
          icon: 'inventory_2',
          tone: 'text-tertiary',
          compute: (rows) => rows.reduce((s, d) => s + (d.quantity || 0), 0).toLocaleString(),
        },
        {
          key: 'donors',
          label: 'Unique Donors',
          icon: 'person',
          tone: 'text-primary',
          compute: (rows) => new Set(rows.map((d) => d.donorName).filter(Boolean)).size,
        },
        {
          key: 'last7',
          label: 'Last 7 Days',
          icon: 'schedule',
          tone: 'text-primary',
          compute: (rows) => {
            const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
            return rows.filter((d) => d.donationDate && new Date(d.donationDate).getTime() >= cutoff).length;
          },
        },
      ]}
    />
  );
}
