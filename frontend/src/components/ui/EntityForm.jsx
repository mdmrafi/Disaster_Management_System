/**
 * Declarative form.  Each field is described by:
 *   { name, label, type, required, options?, placeholder?, min, max, step,
 *     rows?, defaultValue? }
 *
 * `options` (for type="select") is an array of { value, label } or a flat
 * array of strings.
 */
export default function EntityForm({ fields, values, onChange, errors = {} }) {
  const set = (name, value) => onChange({ ...values, [name]: value });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {fields.map((f) => {
        const v = values[f.name] ?? f.defaultValue ?? '';
        const err = errors[f.name];
        const fullWidth = f.fullWidth || f.type === 'textarea';
        return (
          <div key={f.name} className={fullWidth ? 'sm:col-span-2' : ''}>
            <label className="label" htmlFor={f.name}>
              {f.label}
              {f.required && <span className="text-red-500"> *</span>}
            </label>

            {f.type === 'select' ? (
              <select
                id={f.name}
                className="input"
                value={v}
                onChange={(e) => set(f.name, e.target.value)}
                required={f.required}
              >
                <option value="">— select —</option>
                {(f.options || []).map((o) => {
                  const opt = typeof o === 'string' ? { value: o, label: o } : o;
                  return (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  );
                })}
              </select>
            ) : f.type === 'textarea' ? (
              <textarea
                id={f.name}
                rows={f.rows || 3}
                className="input"
                value={v}
                onChange={(e) => set(f.name, e.target.value)}
                placeholder={f.placeholder}
                required={f.required}
              />
            ) : (
              <input
                id={f.name}
                type={f.type || 'text'}
                className="input"
                value={v}
                onChange={(e) =>
                  set(
                    f.name,
                    f.type === 'number' && e.target.value !== ''
                      ? Number(e.target.value)
                      : e.target.value,
                  )
                }
                placeholder={f.placeholder}
                required={f.required}
                min={f.min}
                max={f.max}
                step={f.step}
              />
            )}

            {err && <p className="text-xs text-red-600 mt-1">{err}</p>}
          </div>
        );
      })}
    </div>
  );
}
