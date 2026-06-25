import CrudPage from '../components/CrudPage.jsx';
import api from '../api/client.js';
import StatusBadge from '../components/ui/StatusBadge.jsx';

const ALLOCATION_STATUSES = ['PENDING', 'DISPATCHED', 'DELIVERED'];

export default function AllocationsPage() {
  return (
    <CrudPage
      eyebrow="Operations"
      title="Resource Allocations"
      subtitle="Distribute available stock to active relief camps"
      addLabel="New allocation"
      loadRows={() => api.get('/allocations').then((r) => r.data)}
      createRow={(body) => api.post('/allocations', body).then((r) => r.data)}
      deleteRow={(id) => api.delete(`/allocations/${id}`)}
      columns={[
        { key: 'allocationId', header: 'ID' },
        { key: 'disasterName', header: 'Disaster' },
        { key: 'campName',     header: 'Camp' },
        { key: 'resourceName', header: 'Resource' },
        { key: 'quantity',     header: 'Qty', align: 'right' },
        { key: 'allocationDate', header: 'Date' },
        { key: 'status',       header: 'Status', render: (r) => <StatusBadge value={r.status} /> },
      ]}
      fields={[
        { name: 'disasterId',     label: 'Disaster ID', type: 'number', required: true, min: 1 },
        { name: 'campId',         label: 'Camp ID',     type: 'number', required: true, min: 1 },
        { name: 'resourceId',     label: 'Resource ID', type: 'number', required: true, min: 1 },
        { name: 'quantity',       label: 'Quantity',    type: 'number', required: true, min: 1 },
        { name: 'allocationDate', label: 'Date',        type: 'date',   required: true },
        { name: 'status',         label: 'Status',      type: 'select', options: ALLOCATION_STATUSES, defaultValue: 'PENDING' },
      ]}
      filters={[{ key: 'status', label: 'statuses', options: ALLOCATION_STATUSES }]}
      searchKeys={['disasterName', 'campName', 'resourceName']}
      metrics={[
        {
          key: 'total',
          label: 'Allocations',
          icon: 'assignment_turned_in',
          tone: 'text-primary',
          compute: (rows) => rows.length,
        },
        {
          key: 'pending',
          label: 'Pending',
          icon: 'hourglass_empty',
          tone: 'text-primary',
          compute: (rows) => rows.filter((r) => r.status === 'PENDING').length,
        },
        {
          key: 'dispatched',
          label: 'In Transit',
          icon: 'local_shipping',
          tone: 'text-primary',
          compute: (rows) => rows.filter((r) => r.status === 'DISPATCHED').length,
        },
        {
          key: 'delivered',
          label: 'Delivered',
          icon: 'check_circle',
          tone: 'text-tertiary',
          compute: (rows) => rows.filter((r) => r.status === 'DELIVERED').length,
        },
      ]}
    />
  );
}
