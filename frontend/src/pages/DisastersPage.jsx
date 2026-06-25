import CrudPage from '../components/CrudPage.jsx';
import api from '../api/client.js';

const TYPES      = ['FLOOD', 'CYCLONE', 'EARTHQUAKE', 'LANDSLIDE', 'OTHER'];
const SEVERITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export default function DisastersPage() {
  return (
    <CrudPage
      eyebrow="Operations"
      title="Disasters"
      subtitle="Top-level events that triggered relief operations"
      addLabel="New disaster"
      loadRows={() => api.get('/disasters').then((r) => r.data)}
      createRow={(body) => api.post('/disasters', body).then((r) => r.data)}
      updateRow={(id, body) => api.put(`/disasters/${id}`, body).then((r) => r.data)}
      deleteRow={(id) => api.delete(`/disasters/${id}`)}
      toFormValues={(r) => ({
        disasterName:  r.disasterName,
        disasterType:  r.disasterType,
        severityLevel: r.severityLevel,
        startDate:     r.startDate,
        endDate:       r.endDate,
        description:   r.description,
      })}
      fromFormValues={(f) => ({
        disasterName:  f.disasterName,
        disasterType:  f.disasterType,
        severityLevel: f.severityLevel,
        startDate:     f.startDate || null,
        endDate:       f.endDate   || null,
        description:   f.description || null,
      })}
      columns={[
        { key: 'disasterId',     header: 'ID',     width: '80px' },
        { key: 'disasterName',   header: 'Name' },
        { key: 'disasterType',   header: 'Type' },
        { key: 'severityLevel',  header: 'Severity' },
        { key: 'startDate',      header: 'Start' },
        { key: 'endDate',        header: 'End' },
      ]}
      fields={[
        { name: 'disasterName',  label: 'Name',        required: true },
        { name: 'disasterType',  label: 'Type',        type: 'select', required: true, options: TYPES },
        { name: 'severityLevel', label: 'Severity',    type: 'select', required: true, options: SEVERITIES },
        { name: 'startDate',     label: 'Start date',  type: 'date',   required: true },
        { name: 'endDate',       label: 'End date',    type: 'date' },
        { name: 'description',   label: 'Description', type: 'textarea', fullWidth: true },
      ]}
      filters={[
        { key: 'disasterType',  label: 'types',     options: TYPES },
        { key: 'severityLevel', label: 'severities', options: SEVERITIES },
      ]}
      searchKeys={['disasterName', 'disasterType', 'description']}
      metrics={[
        {
          key: 'total',
          label: 'Total Disasters',
          icon: 'warning',
          tone: 'text-primary',
          compute: (rows) => rows.length,
        },
        {
          key: 'active',
          label: 'Active',
          icon: 'bolt',
          tone: 'text-secondary',
          compute: (rows) => rows.filter((d) => !d.endDate || new Date(d.endDate) > new Date()).length,
        },
        {
          key: 'critical',
          label: 'Critical',
          icon: 'priority_high',
          tone: 'text-secondary',
          compute: (rows) => rows.filter((d) => d.severityLevel === 'CRITICAL').length,
        },
        {
          key: 'high',
          label: 'High',
          icon: 'error',
          tone: 'text-primary',
          compute: (rows) => rows.filter((d) => d.severityLevel === 'HIGH').length,
        },
      ]}
    />
  );
}
