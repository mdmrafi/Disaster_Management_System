import CrudPage from '../components/CrudPage.jsx';
import api from '../api/client.js';
import StatusBadge from '../components/ui/StatusBadge.jsx';

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];
const GENDERS    = ['MALE', 'FEMALE', 'OTHER'];

export default function VictimsPage() {
  return (
    <CrudPage
      title="Victims"
      subtitle="People registered in relief camps"
      addLabel="Register victim"
      loadRows={() => api.get('/victims').then((r) => r.data)}
      createRow={(body) => api.post('/victims', body).then((r) => r.data)}
      updateRow={(id, body) => api.put(`/victims/${id}`, body).then((r) => r.data)}
      deleteRow={(id) => api.delete(`/victims/${id}`)}
      columns={[
        { key: 'victimId',         header: 'ID' },
        { key: 'name',             header: 'Name' },
        { key: 'age',              header: 'Age' },
        { key: 'gender',           header: 'Gender' },
        { key: 'campId',           header: 'Camp' },
        { key: 'priorityLevel',    header: 'Priority', render: (r) => <StatusBadge value={r.priorityLevel} /> },
        { key: 'medicalCondition', header: 'Medical' },
      ]}
      fields={[
        { name: 'name',             label: 'Name',        required: true },
        { name: 'age',              label: 'Age',         type: 'number', required: true, min: 0 },
        { name: 'gender',           label: 'Gender',      type: 'select', required: true, options: GENDERS },
        { name: 'campId',           label: 'Camp ID',     type: 'number', required: true, min: 1 },
        { name: 'priorityLevel',    label: 'Priority',    type: 'select', required: true, options: PRIORITIES },
        { name: 'medicalCondition', label: 'Medical condition', placeholder: 'None' },
        { name: 'contactNumber',    label: 'Contact',     placeholder: '+1-555-0100' },
      ]}
    />
  );
}
