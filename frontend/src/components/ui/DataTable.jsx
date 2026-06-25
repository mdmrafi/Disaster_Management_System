import Spinner from './Spinner.jsx';

/**
 * Reusable table.
 *
 * Props:
 *   columns:  [{ key, header, render?, width?, align? }]
 *   rows:     Array of objects
 *   loading:  boolean
 *   empty:    string  — text to show when there are no rows
 *   rowKey:   (row) => string|number  — defaults to row.id
 *   zebra:    boolean — alternating row bg
 *   onRowClick
 */
export default function DataTable({
  columns,
  rows = [],
  loading = false,
  empty = 'No data',
  rowKey = (r) => r.id ?? r.campId ?? r.disasterId ?? r.allocationId ?? r.volunteerId ?? r.victimId ?? r.donationId ?? r.resourceId ?? r.shortageId ?? r.areaId ?? Math.random(),
  onRowClick,
  zebra = true,
}) {
  if (loading) {
    return (
      <div className="flex items-center gap-sm p-md text-on-surface-variant font-body-md text-body-md">
        <Spinner /> Loading…
      </div>
    );
  }
  if (!rows.length) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md text-center font-body-md text-body-md text-on-surface-variant">
        {empty}
      </div>
    );
  }
  return (
    <div className="overflow-x-auto rounded-xl ring-1 ring-outline-variant bg-surface-container-lowest border border-outline-variant">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                className={`table-head ${c.align === 'right' ? 'text-right' : c.align === 'center' ? 'text-center' : ''}`}
                style={c.width ? { width: c.width } : undefined}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="font-body-md text-body-md text-on-surface">
          {rows.map((row, i) => (
            <tr
              key={rowKey(row)}
              className={[
                onRowClick ? 'cursor-pointer' : '',
                'hover:bg-surface-container-low transition-colors',
                zebra && i % 2 === 1 ? 'bg-surface-bright' : '',
              ].join(' ')}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={`table-cell ${c.align === 'right' ? 'text-right' : c.align === 'center' ? 'text-center' : ''}`}
                >
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
