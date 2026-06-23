import Spinner from './Spinner.jsx';

/**
 * Reusable table.
 *
 * Props:
 *   columns:  [{ key, header, render?, width? }]
 *   rows:     Array of objects
 *   loading:  boolean
 *   empty:    string  — text to show when there are no rows
 *   rowKey:   (row) => string|number  — defaults to row.id
 */
export default function DataTable({
  columns,
  rows = [],
  loading = false,
  empty = 'No data',
  rowKey = (r) => r.id ?? r.campId ?? r.disasterId ?? Math.random(),
  onRowClick,
}) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 p-6 text-slate-500">
        <Spinner /> Loading…
      </div>
    );
  }
  if (!rows.length) {
    return <div className="p-6 text-center text-sm text-slate-500">{empty}</div>;
  }
  return (
    <div className="overflow-x-auto rounded-lg ring-1 ring-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200">
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                className="table-head"
                style={c.width ? { width: c.width } : undefined}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              className={onRowClick ? 'cursor-pointer hover:bg-slate-50' : ''}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((c) => (
                <td key={c.key} className="table-cell">
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
