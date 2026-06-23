import { useEffect, useState } from 'react';
import Header from './layout/Header.jsx';
import DataTable from './ui/DataTable.jsx';
import EntityForm from './ui/EntityForm.jsx';
import Modal from './ui/Modal.jsx';
import ConfirmDialog from './ui/ConfirmDialog.jsx';
import { useToast } from './ui/ToastProvider.jsx';

/**
 * Generic CRUD page chrome: list + create/edit modal + delete confirm.
 * Each page supplies the columns, fields, and api calls.
 */
export default function CrudPage({
  title,
  subtitle,
  columns,
  fields,
  loadRows,
  createRow,
  updateRow,
  deleteRow,
  toFormValues,
  fromFormValues,
  empty = 'No records yet',
  addLabel = 'New',
}) {
  const toast = useToast();
  const [rows, setRows]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [editing, setEditing]       = useState(null); // row being edited, or null
  const [showForm, setShowForm]     = useState(false);
  const [toDelete, setToDelete]     = useState(null);
  const [formValues, setFormValues] = useState({});
  const [saving, setSaving]         = useState(false);

  const reload = async () => {
    setLoading(true);
    try {
      const data = await loadRows();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  // mount-time fetch
  useEffect(() => { reload(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openCreate = () => {
    setEditing(null);
    setFormValues({});
    setShowForm(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setFormValues(toFormValues ? toFormValues(row) : { ...row });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setSaving(true);
    try {
      const payload = fromFormValues ? fromFormValues(formValues) : formValues;
      if (editing) {
        await updateRow(editing.id ?? editing.campId ?? editing.disasterId, payload);
        toast.success('Updated');
      } else {
        await createRow(payload);
        toast.success('Created');
      }
      setShowForm(false);
      setEditing(null);
      await reload();
    } catch (e2) {
      toast.error(e2.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteRow(toDelete.id ?? toDelete.campId ?? toDelete.disasterId);
      toast.success('Deleted');
      setToDelete(null);
      await reload();
    } catch (e) {
      toast.error(e.message || 'Delete failed');
    }
  };

  return (
    <>
      <Header
        title={title}
        subtitle={subtitle}
        actions={
          <button type="button" className="btn-primary" onClick={openCreate}>
            + {addLabel}
          </button>
        }
      />
      <main className="p-6">
        <DataTable
          columns={[
            ...columns,
            {
              key: '__actions',
              header: '',
              width: '1%',
              render: (row) => (
                <div className="flex items-center gap-2 justify-end">
                  <button type="button" className="btn-ghost" onClick={() => openEdit(row)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn-ghost text-red-600 hover:bg-red-50"
                    onClick={() => setToDelete(row)}
                  >
                    Delete
                  </button>
                </div>
              ),
            },
          ]}
          rows={rows}
          loading={loading}
          empty={empty}
        />
      </main>

      <Modal
        open={showForm}
        title={editing ? `Edit ${title.slice(0, -1) || 'record'}` : `New ${title.slice(0, -1) || 'record'}`}
        onClose={() => setShowForm(false)}
        footer={
          <>
            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>
              Cancel
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <EntityForm
            fields={fields}
            values={formValues}
            onChange={setFormValues}
          />
        </form>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete record"
        message="This action cannot be undone."
        onCancel={() => setToDelete(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}
