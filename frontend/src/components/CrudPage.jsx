import { useEffect, useMemo, useState } from 'react';
import api from '../api/client.js';
import DataTable from './ui/DataTable.jsx';
import Modal from './ui/Modal.jsx';
import EntityForm from './ui/EntityForm.jsx';
import ConfirmDialog from './ui/ConfirmDialog.jsx';
import StatusBadge from './ui/StatusBadge.jsx';

/**
 * Generic CRUD shell used by 8 entity pages.
 *
 * Props (kept compatible with prior pages):
 *   title, subtitle (or eyebrow)
 *   eyebrow  - small uppercase label above the title (e.g. "OPERATIONS")
 *   addLabel
 *   loadRows(): Promise<row[]>
 *   createRow(values): Promise<row>
 *   updateRow(id, values): Promise<row>   // optional
 *   deleteRow(id): Promise<void>          // optional
 *   toFormValues(row) -> formState
 *   fromFormValues(formState) -> request body
 *   columns: [{ key, header, render?, width?, align? }]
 *   fields:  [{ name, label, type, required, options, fullWidth, defaultValue, placeholder, ... }]
 *   filters: [{ key, label, options: string[] }]   // optional toolbar filters
 *   searchKeys: string[]                            // which row keys to search
 *   metrics: [{ key, label, icon, tone, compute: (rows) => string|number }]  // optional bento cards
 *   defaultSort?: { key, dir }
 */
export default function CrudPage(props) {
  const {
    title,
    subtitle,
    eyebrow,
    addLabel = 'Add new',
    loadRows,
    createRow,
    updateRow,
    deleteRow,
    toFormValues = (r) => ({ ...r }),
    fromFormValues = (f) => f,
    columns = [],
    fields = [],
    filters = [],
    searchKeys,
    metrics = [],
    pageSize = 8,
  } = props;

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState(() =>
    Object.fromEntries(filters.map((f) => [f.key, '']))
  );
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  const [confirmRow, setConfirmRow] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await loadRows();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); /* eslint-disable-next-line */ }, []);

  const visibleRows = useMemo(() => {
    let out = rows;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      const keys = searchKeys || columns.map((c) => c.key);
      out = out.filter((r) =>
        keys.some((k) => {
          const v = r[k];
          return v != null && String(v).toLowerCase().includes(q);
        })
      );
    }
    for (const f of filters) {
      const v = filterValues[f.key];
      if (v) out = out.filter((r) => String(r[f.key] ?? '') === v);
    }
    return out;
  }, [rows, search, filterValues, searchKeys, columns, filters]);

  const totalPages = Math.max(1, Math.ceil(visibleRows.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = visibleRows.slice((safePage - 1) * pageSize, safePage * pageSize);

  useEffect(() => { setPage(1); }, [search, filterValues]);

  const openCreate = () => {
    setEditing(null);
    setFormError(null);
    setModalOpen(true);
  };
  const openEdit = (row) => {
    setEditing(row);
    setFormError(null);
    setModalOpen(true);
  };
  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
  };

  const handleSubmit = async (values) => {
    setSaving(true);
    setFormError(null);
    try {
      const body = fromFormValues(values);
      if (editing && updateRow) {
        await updateRow(editing[primaryKey()], body);
      } else {
        await createRow(body);
      }
      setModalOpen(false);
      await refresh();
    } catch (e) {
      setFormError(e?.response?.data?.message || e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmRow || !deleteRow) return;
    setDeleting(true);
    try {
      await deleteRow(confirmRow[primaryKey()]);
      setConfirmRow(null);
      await refresh();
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  function primaryKey() {
    const idCol = columns.find((c) => /^.*Id$/.test(c.key) && c.key !== 'areaId');
    return idCol ? idCol.key : columns[0]?.key;
  }

  const decoratedColumns = columns.map((c) => {
    if (c.render) return c;
    // Auto-render StatusBadge for status-like columns
    if (/status|severity|priority|level|category|specialization|availability/i.test(c.key) && !c.skipBadge) {
      return { ...c, render: (r) => <StatusBadge value={r[c.key]} /> };
    }
    return c;
  });

  return (
    <div className="flex flex-col gap-lg">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-md">
        <div>
          {eyebrow && (
            <p className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant mb-xs">
              {eyebrow}
            </p>
          )}
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
              {subtitle}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="btn btn-primary h-10 px-md inline-flex items-center gap-sm self-start md:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span className="font-label-md text-label-md uppercase tracking-wider">
            {addLabel}
          </span>
        </button>
      </header>

      {/* Bento metrics */}
      {metrics.length > 0 && !loading && (
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-md">
          {metrics.map((m) => {
            const value = m.compute ? m.compute(rows) : rows.length;
            return (
              <div
                key={m.key}
                className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col gap-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                    {m.label}
                  </span>
                  {m.icon && (
                    <span
                      className={`material-symbols-outlined text-[20px] ${m.tone || 'text-primary'}`}
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {m.icon}
                    </span>
                  )}
                </div>
                <span className="font-display-lg text-display-lg font-bold text-on-surface leading-none">
                  {value}
                </span>
                {m.hint && (
                  <span className="font-label-md text-label-md text-on-surface-variant">
                    {m.hint}
                  </span>
                )}
              </div>
            );
          })}
        </section>
      )}

      {/* Toolbar + table card */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-sm p-md border-b border-outline-variant">
          <div className="flex flex-1 items-center bg-surface-container border border-outline-variant rounded-DEFAULT h-10 px-sm focus-within:border-primary">
            <span className="material-symbols-outlined text-on-surface-variant text-[20px] mr-xs">search</span>
            <input
              className="flex-1 bg-transparent border-none focus:ring-0 outline-none font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant"
              placeholder={`Search ${title?.toLowerCase() || 'records'}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
            />
          </div>
          {filters.length > 0 && (
            <div className="flex flex-wrap gap-sm">
              {filters.map((f) => (
                <select
                  key={f.key}
                  value={filterValues[f.key]}
                  onChange={(e) =>
                    setFilterValues((prev) => ({ ...prev, [f.key]: e.target.value }))
                  }
                  className="h-10 px-sm bg-surface-container border border-outline-variant rounded-DEFAULT font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                >
                  <option value="">{`All ${f.label}`}</option>
                  {f.options.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              ))}
            </div>
          )}
        </div>

        <DataTable
          loading={loading}
          columns={[
            ...decoratedColumns,
            ...(updateRow || deleteRow
              ? [{
                  key: '_actions',
                  header: 'Actions',
                  width: '140px',
                  align: 'right',
                  render: (r) => (
                    <div className="flex items-center justify-end gap-xs">
                      {updateRow && (
                        <button
                          type="button"
                          onClick={() => openEdit(r)}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"
                          aria-label="Edit"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                      )}
                      {deleteRow && (
                        <button
                          type="button"
                          onClick={() => setConfirmRow(r)}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-error-container hover:text-error transition-colors"
                          aria-label="Delete"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      )}
                    </div>
                  ),
                }]
              : []),
          ]}
          rows={pageRows}
          emptyMessage={error ? `Error: ${error}` : `No ${title?.toLowerCase() || 'records'} found.`}
        />

        {visibleRows.length > pageSize && (
          <div className="flex items-center justify-between px-md py-sm border-t border-outline-variant bg-surface-container-low">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              Page {safePage} of {totalPages} · {visibleRows.length} records
            </span>
            <div className="flex items-center gap-xs">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                className="btn btn-secondary h-8 px-sm disabled:opacity-40"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                className="btn btn-secondary h-8 px-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Create / Edit modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editing ? `Edit ${title?.toLowerCase() || 'record'}` : `New ${title?.toLowerCase() || 'record'}`}
        footer={
          <>
            <button type="button" onClick={closeModal} className="btn btn-secondary" disabled={saving}>
              Cancel
            </button>
            <button
              type="submit"
              form="crud-form"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving…' : editing ? 'Save changes' : 'Create'}
            </button>
          </>
        }
      >
        <EntityForm
          id="crud-form"
          fields={fields}
          initialValues={editing ? toFormValues(editing) : undefined}
          onSubmit={handleSubmit}
          error={formError}
          submitOnEnter
        />
      </Modal>

      <ConfirmDialog
        open={!!confirmRow}
        title={`Delete ${title?.toLowerCase() || 'record'}?`}
        message="This action cannot be undone."
        confirmLabel={deleting ? 'Deleting…' : 'Delete'}
        danger
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => !deleting && setConfirmRow(null)}
      />
    </div>
  );
}
