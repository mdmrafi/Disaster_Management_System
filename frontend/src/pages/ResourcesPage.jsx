import CrudPage from '../components/CrudPage.jsx';
import api from '../api/client.js';

const CATEGORIES = ['FOOD', 'MEDICAL', 'SHELTER', 'CLOTHING', 'EMERGENCY'];

export default function ResourcesPage() {
  return (
    <CrudPage
      eyebrow="Inventory"
      title="Resources"
      subtitle="Master inventory — stock is mutated by donations and allocations"
      addLabel="New resource"
      loadRows={() => api.get('/resources').then((r) => r.data)}
      createRow={(body) => api.post('/resources', body).then((r) => r.data)}
      updateRow={(id, body) => api.put(`/resources/${id}`, body).then((r) => r.data)}
      deleteRow={(id) => api.delete(`/resources/${id}`)}
      toFormValues={(r) => ({
        resourceName: r.resourceName,
        category:     r.category,
      })}
      fromFormValues={(f) => ({
        resourceName:    f.resourceName,
        category:        f.category,
        initialQuantity: Number(f.initialQuantity ?? 0),
      })}
      columns={[
        { key: 'resourceId',        header: 'ID',     width: '80px' },
        { key: 'resourceName',      header: 'Name' },
        { key: 'category',          header: 'Category' },
        { key: 'totalQuantity',     header: 'Total',     align: 'right' },
        { key: 'availableQuantity', header: 'Available', align: 'right' },
      ]}
      fields={[
        { name: 'resourceName',    label: 'Name',             required: true },
        { name: 'category',        label: 'Category',         type: 'select', required: true, options: CATEGORIES },
        { name: 'initialQuantity', label: 'Initial quantity', type: 'number', required: true, min: 0, defaultValue: 0 },
      ]}
      filters={[{ key: 'category', label: 'categories', options: CATEGORIES }]}
      searchKeys={['resourceName', 'category']}
      metrics={[
        {
          key: 'total',
          label: 'Resources',
          icon: 'inventory_2',
          tone: 'text-primary',
          compute: (rows) => rows.length,
        },
        {
          key: 'available',
          label: 'Units Available',
          icon: 'check_circle',
          tone: 'text-tertiary',
          compute: (rows) => rows.reduce((s, r) => s + (r.availableQuantity || 0), 0).toLocaleString(),
        },
        {
          key: 'allocated',
          label: 'Units Allocated',
          icon: 'outbox',
          tone: 'text-primary',
          compute: (rows) =>
            rows.reduce((s, r) => s + Math.max(0, (r.totalQuantity || 0) - (r.availableQuantity || 0)), 0).toLocaleString(),
        },
        {
          key: 'low',
          label: 'Low Stock',
          icon: 'warning',
          tone: 'text-secondary',
          compute: (rows) => rows.filter((r) => (r.availableQuantity || 0) < (r.totalQuantity || 0) * 0.2).length,
        },
      ]}
    />
  );
}
