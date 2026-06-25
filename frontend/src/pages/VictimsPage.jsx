import CrudPage from '../components/CrudPage.jsx';
import api from '../api/client.js';

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];
const GENDERS    = ['MALE', 'FEMALE', 'OTHER'];

export default function VictimsPage() {
  return (
    <CrudPage
      eyebrow="People"
      title="Victims"
      subtitle="People registered in relief camps"
      addLabel="Register victim"
      loadRows={() => api.get('/victims').then((r) => r.data)}
      createRow={(body) => api.post('/victims', body).then((r) => r.data)}
      updateRow={(id, body) => api.put(`/victims/${id}`, body).then((r) => r.data)}
      deleteRow={(id) => api.delete(`/victims/${id}`)}
      toFormValues={(r) => ({
        name:             r.name,
        age:              r.age,
        gender:           r.gender,
        familyMembers:    r.familyMembers ?? 0,
        priorityLevel:    r.priorityLevel,
        medicalCondition: r.medicalCondition ?? '',
        campId:           r.campId,
      })}
      fromFormValues={(f) => ({
        name:             f.name,
        age:              f.age === '' || f.age == null ? null : Number(f.age),
        gender:           f.gender,
        familyMembers:    f.familyMembers === '' || f.familyMembers == null ? 0 : Number(f.familyMembers),
        priorityLevel:    f.priorityLevel,
        medicalCondition: f.medicalCondition || null,
        campId:           Number(f.campId),
      })}
      columns={[
        { key: 'victimId',         header: 'ID',     width: '80px' },
        { key: 'name',             header: 'Name' },
        { key: 'age',              header: 'Age',    align: 'right' },
        { key: 'gender',           header: 'Gender' },
        { key: 'campName',         header: 'Camp' },
        { key: 'priorityLevel',    header: 'Priority' },
        { key: 'medicalCondition', header: 'Medical' },
      ]}
      fields={[
        { name: 'name',             label: 'Name',          required: true },
        { name: 'age',              label: 'Age',           type: 'number', required: true, min: 0 },
        { name: 'gender',           label: 'Gender',        type: 'select', required: true, options: GENDERS },
        { name: 'familyMembers',    label: 'Family members', type: 'number', min: 0, defaultValue: 0 },
        { name: 'campId',           label: 'Camp ID',       type: 'number', required: true, min: 1 },
        { name: 'priorityLevel',    label: 'Priority',      type: 'select', required: true, options: PRIORITIES },
        { name: 'medicalCondition', label: 'Medical condition', placeholder: 'None' },
      ]}
      filters={[
        { key: 'gender',        label: 'genders',    options: GENDERS },
        { key: 'priorityLevel', label: 'priorities', options: PRIORITIES },
      ]}
      searchKeys={['name', 'campName', 'medicalCondition']}
      metrics={[
        {
          key: 'total',
          label: 'Registered',
          icon: 'group',
          tone: 'text-primary',
          compute: (rows) => rows.length,
        },
        {
          key: 'high',
          label: 'High Priority',
          icon: 'priority_high',
          tone: 'text-secondary',
          compute: (rows) => rows.filter((v) => v.priorityLevel === 'HIGH').length,
        },
        {
          key: 'med',
          label: 'Medical Needs',
          icon: 'medical_services',
          tone: 'text-primary',
          compute: (rows) => rows.filter((v) => v.medicalCondition && v.medicalCondition !== 'None').length,
        },
        {
          key: 'family',
          label: 'Total Family Members',
          icon: 'family_restroom',
          tone: 'text-tertiary',
          compute: (rows) => rows.reduce((s, v) => s + (v.familyMembers || 0), 0).toLocaleString(),
        },
      ]}
    />
  );
}
