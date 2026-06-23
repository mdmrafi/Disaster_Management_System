export default function Spinner({ size = 16, className = '' }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={'inline-block animate-spin rounded-full ' +
                 'border-2 border-slate-200 border-t-primary-600 ' +
                 className}
      style={{ width: size, height: size }}
    />
  );
}
