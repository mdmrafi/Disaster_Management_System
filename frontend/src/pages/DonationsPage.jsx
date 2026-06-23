import CrudPage from '../components/CrudPage.jsx';
import api from '../api/client.js';
import StatusBadge from '../components/ui/StatusBadge.jsx';

export default function DonationsPage() {
  return (
    <CrudPage
      title="Donations"
      subtitle="Inbound contributions that increase resource stock"
      addLabel="Record donation"
      loadRows={() => api.get('/donations').then((r) => r.data)}
      createRow={(body) => api.post('/donations', body).then((r) => r.data)}
      deleteRow={(id) => api.delete(`/donations/${id}`)}
      columns={[
        { key: 'donationId',    header: 'ID' },
        { key: 'donorName',     header: 'Donor' },
        { key: 'resourceId',    header: 'Resource' },
        { key: 'quantity',      header: 'Qty' },
        { key: 'donationDate',  header: 'Date' },
        { key: 'donationType',  header: 'Type', render: (r) => <StatusBadge value={r.donationType} /> },
      ]}
      fields={[
        { name: 'donorName',     label: 'Donor name',  required: true },
        { name: 'resourceId',    label: 'Resource ID', type: 'number', required: true, min: 1 },
        { name: 'quantity',      label: 'Quantity',    type: 'number', required: true, min: 1 },
        { name: 'donationType',  label: 'Type',        type: 'select', required: true, options: ['MONETARY', 'IN_KIND'] },
        { name: 'donationDate',  label: 'Date',        type: 'date',   required: true },
      ]}
    />
  );
}
