import CrudPage from '../components/CrudPage.jsx';
import api from '../api/client.js';
import StatusBadge from '../components/ui/StatusBadge.jsx';

const CATEGORIES = ['FOOD', 'WATER', 'MEDICAL', 'CLOTHING', 'SHELTER', 'OTHER'];
const UNITS      = ['KG', 'LITER', 'PIECE', 'BOX', 'PACK'];

export default function ResourcesPage() {
  return (
    <CrudPage
      title="Resources"
      subtitle="Master inventory — stock is mutated by donations and allocations"
      addLabel="New resource"
      loadRows={() => api.get('/resources').then((r) => r.data)}
      createRow={(body) => api.post('/resources', body).then((r) => r.data)}
      updateRow={(id, body) => api.put(`/resources/${id}`, body).then((r) => r.data)}
      deleteRow={(id) => api.delete(`/resources/${id}`)}
      columns={[
        { key: 'resourceId',       header: 'ID' },
        { key: 'resourceName',     header: 'Name' },
        { key: 'category',         header: 'Category', render: (r) => <StatusBadge value={r.category} /> },
        { key: 'totalQuantity',    header: 'Total' },
        { key: 'availableQuantity',header: 'Available' },
        { key: 'unit',             header: 'Unit' },
      ]}
      fields={[
        { name: 'resourceName',  label: 'Name',     required: true },
        { name: 'category',      label: 'Category', type: 'select', required: true, options: CATEGORIES },
        { name: 'unit',          label: 'Unit',     type: 'select', required: true, options: UNITS },
        { name: 'totalQuantity', label: 'Total quantity',     type: 'number', required: true, min: 0 },
        { name: 'threshold',     label: 'Reorder threshold', type: 'number', min: 0, defaultValue: 10 },
      ]}
    />
  );
}
