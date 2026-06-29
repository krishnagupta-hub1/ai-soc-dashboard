import { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

export default function DataTable({
  columns,
  data,
  onRowClick,
  maxHeight = '500px',
  emptyMessage = 'No data available',
}) {
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const sorted = [...data].sort((a, b) => {
    if (!sortField) return 0;
    const va = a[sortField];
    const vb = b[sortField];
    if (va == null) return 1;
    if (vb == null) return -1;
    const cmp = typeof va === 'string' ? va.localeCompare(vb) : va - vb;
    return sortDir === 'asc' ? cmp : -cmp;
  });

  return (
    <div className="overflow-auto rounded-xl" style={{ maxHeight, border: '1px solid #1e3a5f' }}>
      <table className="data-table w-full">
        <thead className="sticky top-0 z-10">
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
                className={col.sortable ? 'cursor-pointer select-none hover:text-accent-cyan' : ''}
                style={{ minWidth: col.width || 'auto' }}
              >
                <div className="flex items-center gap-1">
                  {col.label}
                  {col.sortable && (
                    <span style={{ color: sortField === col.key ? '#00d4ff' : '#475569' }}>
                      {sortField === col.key
                        ? sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                        : <ChevronsUpDown size={12} />
                      }
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-12 text-text-muted">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sorted.map((row, i) => (
              <tr
                key={row.id || i}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={onRowClick ? 'cursor-pointer' : ''}
                style={{ animation: `fadeIn 0.2s ease-out ${i * 0.01}s both` }}
              >
                {columns.map(col => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
