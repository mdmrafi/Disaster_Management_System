import { useEffect, useState } from 'react';

/**
 * Declarative form.  Each field is described by:
 *   { name, label, type, required, options?, placeholder?, min, max, step,
 *     rows?, defaultValue?, fullWidth? }
 *
 * `options` (for type="select") is an array of { value, label } or a flat
 * array of strings.
 *
 * Props:
 *   id?            — applied to the inner <form> for external submit buttons
 *   fields         — array of field descriptors
 *   initialValues? — seed values when uncontrolled
 *   values?        — controlled values (overrides initialValues)
 *   onChange?      — (nextValues) => void when controlled
 *   onSubmit?      — (values) => void | Promise<void>; triggers on Enter / submit
 *   errors?        — { fieldName: 'message' } from server-side validation
 *   error?         — top-level form error string
 *   submitOnEnter  — wrap in <form onSubmit> (default false unless onSubmit is set)
 */
export default function EntityForm({
  id,
  fields = [],
  initialValues,
  values: controlledValues,
  onChange,
  onSubmit,
  errors = {},
  error,
  submitOnEnter,
}) {
  const seed = () => {
    const out = {};
    for (const f of fields) {
      const seedVal =
        controlledValues?.[f.name] ??
        initialValues?.[f.name] ??
        f.defaultValue ??
        '';
      out[f.name] = seedVal;
    }
    return out;
  };

  const [internal, setInternal] = useState(seed);
  const isControlled = controlledValues != null;
  const values = isControlled ? controlledValues : internal;

  useEffect(() => {
    if (isControlled) return;
    setInternal(seed());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initialValues)]);

  const set = (name, value) => {
    const next = { ...values, [name]: value };
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    onSubmit?.(values);
  };

  const body = (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
      {fields.map((f) => {
        const v = values?.[f.name] ?? f.defaultValue ?? '';
        const err = errors?.[f.name];
        const fullWidth = f.fullWidth || f.type === 'textarea';
        return (
          <div key={f.name} className={fullWidth ? 'sm:col-span-2' : ''}>
            <label className="label" htmlFor={f.name}>
              {f.label}
              {f.required && <span className="text-secondary"> *</span>}
            </label>

            {f.type === 'select' ? (
              <select
                id={f.name}
                className="input"
                value={v ?? ''}
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
                className="input-area"
                value={v ?? ''}
                onChange={(e) => set(f.name, e.target.value)}
                placeholder={f.placeholder}
                required={f.required}
              />
            ) : (
              <input
                id={f.name}
                type={f.type || 'text'}
                className="input"
                value={v ?? ''}
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

            {err && (
              <p className="font-label-sm text-label-sm text-error mt-xs uppercase tracking-wider">
                {err}
              </p>
            )}
          </div>
        );
      })}

      {error && (
        <div className="sm:col-span-2 bg-error-container border border-outline-variant rounded-lg p-sm font-body-md text-body-md text-error">
          {error}
        </div>
      )}
    </div>
  );

  if (onSubmit || submitOnEnter) {
    return (
      <form id={id} onSubmit={handleSubmit} className="contents">
        {body}
      </form>
    );
  }
  return body;
}
