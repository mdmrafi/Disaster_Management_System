/**
 * A small colored chip used everywhere to display an enum status.
 * Pick the colors via `tone` so we don't have to know the label.
 */
const TONE = {
  // severity / priority
  CRITICAL: 'bg-red-100    text-red-800    ring-red-300',
  HIGH:     'bg-orange-100 text-orange-800 ring-orange-300',
  MEDIUM:   'bg-yellow-100 text-yellow-800 ring-yellow-300',
  LOW:      'bg-green-100  text-green-800  ring-green-300',

  // availability / status
  AVAILABLE: 'bg-green-100  text-green-800  ring-green-300',
  BUSY:      'bg-orange-100 text-orange-800 ring-orange-300',
  OFFLINE:   'bg-slate-100  text-slate-700  ring-slate-300',

  // disaster severity
  LOW_SEVERITY:      'bg-yellow-100 text-yellow-800 ring-yellow-300',
  MEDIUM_SEVERITY:   'bg-orange-100 text-orange-800 ring-orange-300',
  HIGH_SEVERITY:     'bg-red-100    text-red-800    ring-red-300',
  CATASTROPHIC:      'bg-red-200    text-red-900    ring-red-400',

  // camp status
  ACTIVE:    'bg-green-100  text-green-800  ring-green-300',
  FULL:      'bg-yellow-100 text-yellow-800 ring-yellow-300',
  CLOSED:    'bg-slate-100  text-slate-700  ring-slate-300',

  // resource category
  FOOD:     'bg-amber-100  text-amber-800   ring-amber-300',
  WATER:    'bg-sky-100    text-sky-800     ring-sky-300',
  MEDICAL:  'bg-rose-100   text-rose-800    ring-rose-300',
  CLOTHING: 'bg-indigo-100 text-indigo-800  ring-indigo-300',
  SHELTER:  'bg-emerald-100 text-emerald-800 ring-emerald-300',
  OTHER:    'bg-slate-100  text-slate-700   ring-slate-300',

  // fallback
  DEFAULT:  'bg-slate-100  text-slate-700   ring-slate-300',
};

export default function StatusBadge({ value }) {
  if (!value) return null;
  const tone = TONE[String(value).toUpperCase()] ?? TONE.DEFAULT;
  return (
    <span
      className={
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs ' +
        'font-medium ring-1 ' + tone
      }
    >
      {String(value).replace(/_/g, ' ')}
    </span>
  );
}
