/**
 * Resilience Command — uppercase monospaced status badge with optional icon.
 * Tones: critical, danger, high, warning, ok, info, neutral
 */
const TONE = {
  // Critical (red — error family)
  CRITICAL: { bg: 'bg-error-container',     text: 'text-on-error-container',     dot: 'bg-error',                  icon: 'priority_high' },
  URGENT:   { bg: 'bg-error-container',     text: 'text-on-error-container',     dot: 'bg-error',                  icon: 'priority_high' },

  // High / Danger (red — secondary family)
  HIGH:     { bg: 'bg-secondary-fixed',     text: 'text-on-secondary-fixed-variant', dot: 'bg-secondary',          icon: 'warning' },
  EVACUATING:{ bg: 'bg-secondary-container', text: 'text-on-secondary',         dot: 'bg-on-secondary',           icon: 'directions_run' },
  EVACUATED:{ bg: 'bg-secondary-container', text: 'text-on-secondary',         dot: 'bg-on-secondary',           icon: 'check_circle' },
  ALLOCATING:{ bg: 'bg-secondary-fixed',    text: 'text-on-secondary-fixed-variant', dot: 'bg-secondary',          icon: 'sync' },
  FULL:     { bg: 'bg-secondary-container', text: 'text-on-secondary',         dot: 'bg-on-secondary',           icon: 'do_not_disturb_on' },

  // Medium / Warning (amber surface variant)
  MEDIUM:   { bg: 'bg-surface-container-highest', text: 'text-on-surface',   dot: 'bg-outline',                icon: 'schedule' },
  PENDING:  { bg: 'bg-surface-container-highest', text: 'text-on-surface',   dot: 'bg-outline',                icon: 'hourglass_empty' },
  MONITORING:{ bg: 'bg-surface-container-highest', text: 'text-on-surface',  dot: 'bg-outline',                icon: 'visibility' },
  WARNING:  { bg: 'bg-surface-container-highest', text: 'text-on-surface',   dot: 'bg-outline',                icon: 'warning_amber' },

  // Low / Stable (green — tertiary)
  LOW:      { bg: 'bg-tertiary-fixed',      text: 'text-on-tertiary-fixed-variant', dot: 'bg-on-tertiary-fixed-variant', icon: 'check' },
  ACTIVE:   { bg: 'bg-tertiary-fixed',      text: 'text-on-tertiary-fixed-variant', dot: 'bg-on-tertiary-fixed-variant', icon: 'radio_button_checked' },
  AVAILABLE:{ bg: 'bg-tertiary-fixed',      text: 'text-on-tertiary-fixed-variant', dot: 'bg-on-tertiary-fixed-variant', icon: 'check_circle' },
  STABLE:   { bg: 'bg-tertiary-fixed',      text: 'text-on-tertiary-fixed-variant', dot: 'bg-on-tertiary-fixed-variant', icon: 'check' },
  DISPATCHED:{ bg: 'bg-tertiary-fixed',     text: 'text-on-tertiary-fixed-variant', dot: 'bg-on-tertiary-fixed-variant', icon: 'local_shipping' },
  DELIVERED:{ bg: 'bg-tertiary-fixed',      text: 'text-on-tertiary-fixed-variant', dot: 'bg-on-tertiary-fixed-variant', icon: 'task_alt' },
  RESOLVED: { bg: 'bg-tertiary-fixed',      text: 'text-on-tertiary-fixed-variant', dot: 'bg-on-tertiary-fixed-variant', icon: 'check_circle' },
  CONTAINED:{ bg: 'bg-tertiary-fixed',      text: 'text-on-tertiary-fixed-variant', dot: 'bg-on-tertiary-fixed-variant', icon: 'shield' },
  CLOSED:   { bg: 'bg-tertiary-container',  text: 'text-on-tertiary',         dot: 'bg-on-tertiary',            icon: 'lock' },
  BUSY:     { bg: 'bg-surface-container-highest', text: 'text-on-surface',  dot: 'bg-outline',                icon: 'do_disturb_on' },
  OFFLINE:  { bg: 'bg-surface-container',   text: 'text-on-surface-variant',  dot: 'bg-outline-variant',        icon: 'cloud_off' },

  // Category chips
  MEDICAL:  { bg: 'bg-surface-container',   text: 'text-on-surface-variant',  dot: 'bg-outline-variant',        icon: 'medical_services' },
  FOOD:     { bg: 'bg-surface-container',   text: 'text-on-surface-variant',  dot: 'bg-outline-variant',        icon: 'restaurant' },
  WATER:    { bg: 'bg-surface-container',   text: 'text-on-surface-variant',  dot: 'bg-outline-variant',        icon: 'water_drop' },
  SHELTER:  { bg: 'bg-surface-container',   text: 'text-on-surface-variant',  dot: 'bg-outline-variant',        icon: 'bed' },
  EQUIPMENT:{ bg: 'bg-surface-container',   text: 'text-on-surface-variant',  dot: 'bg-outline-variant',        icon: 'construction' },
  TRANSPORT:{ bg: 'bg-surface-container',   text: 'text-on-surface-variant',  dot: 'bg-outline-variant',        icon: 'local_shipping' },
  PERSONNEL:{ bg: 'bg-surface-container',   text: 'text-on-surface-variant',  dot: 'bg-outline-variant',        icon: 'groups' },

  // Neutral
  NEUTRAL:  { bg: 'bg-surface-container',   text: 'text-on-surface-variant',  dot: 'bg-outline-variant',        icon: 'label' },
};

export default function StatusBadge({ value, label, showIcon = false, className = '' }) {
  const tone = TONE[String(value).toUpperCase()] || TONE.NEUTRAL;
  const text = label ?? String(value);
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded font-label-sm text-label-sm uppercase tracking-wider whitespace-nowrap ${tone.bg} ${tone.text} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${tone.dot}`} />
      {showIcon && (
        <span className="material-symbols-outlined text-[14px] leading-none">{tone.icon}</span>
      )}
      {text}
    </span>
  );
}
