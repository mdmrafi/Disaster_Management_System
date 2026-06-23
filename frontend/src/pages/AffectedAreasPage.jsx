import CrudPage from '../components/CrudPage.jsx';
import api from '../api/client.js';

export default function AffectedAreasPage() {
  return (
    <CrudPage
      title="Affected Areas"
      subtitle="Geographic regions impacted by a disaster"
      addLabel="New area"
      loadRows={() => api.get('/areas').then((r) => r.data)}
      createRow={(body) => api.post('/areas', body).then((r) => r.data)}
      updateRow={(id, body) => api.put(`/areas/${id}`, body).then((r) => r.data)}
      deleteRow={(id) => api.delete(`/areas/${id}`)}
      columns={[
        { key: 'areaId',          header: 'ID' },
        { key: 'areaName',        header: 'Name' },
        { key: 'disasterId',      header: 'Disaster' },
        { key: 'population',      header: 'Population' },
        { key: 'severityLevel',   header: 'Severity' },
      ]}
      fields={[
        { name: 'areaName',      label: 'Area name',   required: true },
        { name: 'disasterId',    label: 'Disaster ID', type: 'number', required: true, min: 1 },
        { name: 'population',    label: 'Population',  type: 'number', required: true, min: 0 },
        { name: 'severityLevel', label: 'Severity (1-10)', type: 'number', required: true, min: 1, max: 10 },
      ]}
    />
  );
}
