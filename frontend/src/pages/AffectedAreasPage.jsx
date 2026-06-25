import CrudPage from '../components/CrudPage.jsx';
import api from '../api/client.js';

const SEVERITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export default function AffectedAreasPage() {
  return (
    <CrudPage
      eyebrow="Geography"
      title="Affected Areas"
      subtitle="Geographic regions impacted by a disaster"
      addLabel="New area"
      loadRows={() => api.get('/areas').then((r) => r.data)}
      createRow={(body) => api.post('/areas', body).then((r) => r.data)}
      updateRow={(id, body) => api.put(`/areas/${id}`, body).then((r) => r.data)}
      deleteRow={(id) => api.delete(`/areas/${id}`)}
      toFormValues={(r) => ({
        areaName:   r.areaName,
        district:   r.district,
        population: r.population,
        latitude:   r.latitude,
        longitude:  r.longitude,
        severity:   r.severity,
        disasterId: r.disasterId,
      })}
      fromFormValues={(f) => ({
        areaName:   f.areaName,
        district:   f.district,
        population: f.population === '' || f.population == null ? null : Number(f.population),
        latitude:   f.latitude   === '' || f.latitude   == null ? null : Number(f.latitude),
        longitude:  f.longitude  === '' || f.longitude  == null ? null : Number(f.longitude),
        severity:   f.severity   || null,
        disasterId: Number(f.disasterId),
      })}
      columns={[
        { key: 'areaId',       header: 'ID',       width: '80px' },
        { key: 'areaName',     header: 'Area' },
        { key: 'district',     header: 'District' },
        { key: 'disasterName', header: 'Disaster' },
        { key: 'population',   header: 'Population', align: 'right' },
        { key: 'severity',     header: 'Severity' },
      ]}
      fields={[
        { name: 'areaName',   label: 'Area name',  required: true },
        { name: 'district',   label: 'District',   required: true },
        { name: 'disasterId', label: 'Disaster ID', type: 'number', required: true, min: 1 },
        { name: 'population', label: 'Population', type: 'number', required: true, min: 0 },
        { name: 'severity',   label: 'Severity',   type: 'select', options: SEVERITIES },
        { name: 'latitude',   label: 'Latitude',   type: 'number', min: -90,  max: 90,  step: 0.000001 },
        { name: 'longitude',  label: 'Longitude',  type: 'number', min: -180, max: 180, step: 0.000001 },
      ]}
      filters={[{ key: 'severity', label: 'severities', options: SEVERITIES }]}
      searchKeys={['areaName', 'district', 'disasterName']}
      metrics={[
        {
          key: 'areas',
          label: 'Tracked Areas',
          icon: 'map',
          tone: 'text-primary',
          compute: (rows) => rows.length,
        },
        {
          key: 'pop',
          label: 'Total Population',
          icon: 'groups',
          tone: 'text-primary',
          compute: (rows) => rows.reduce((s, r) => s + (r.population || 0), 0).toLocaleString(),
        },
        {
          key: 'crit',
          label: 'Critical Areas',
          icon: 'priority_high',
          tone: 'text-secondary',
          compute: (rows) => rows.filter((r) => r.severity === 'CRITICAL').length,
        },
        {
          key: 'districts',
          label: 'Districts',
          icon: 'location_city',
          tone: 'text-tertiary',
          compute: (rows) => new Set(rows.map((r) => r.district).filter(Boolean)).size,
        },
      ]}
    />
  );
}
