import CrudPage from '../components/CrudPage.jsx';
import api from '../api/client.js';

export default function AllocationsPage() {
  return (
    <CrudPage
      title="Resource Allocations"
      subtitle="Distribute inventory from the central pool to individual camps"
      addLabel="New allocation"
      empty="No allocations yet — try creating one"
      loadRows={() => api.get('/allocations').then((r) => r.data)}
      createRow={(body) => api.post('/allocations', body).then((r) => r.data)}
      deleteRow={(id) => api.delete(`/allocations/${id}`)}
      columns={[
        { key: 'allocationId', header: 'ID' },
        { key: 'campId',       header: 'Camp' },
        { key: 'resourceId',   header: 'Resource' },
        { key: 'quantity',     header: 'Qty' },
        { key: 'allocationDate', header: 'Date' },
      ]}
      fields={[
        { name: 'campId',         label: 'Camp ID',     type: 'number', required: true, min: 1 },
        { name: 'resourceId',     label: 'Resource ID', type: 'number', required: true, min: 1 },
        { name: 'quantity',       label: 'Quantity',    type: 'number', required: true, min: 1 },
        { name: 'allocationDate', label: 'Date',        type: 'date',   required: true },
      ]}
    />
  );
}
