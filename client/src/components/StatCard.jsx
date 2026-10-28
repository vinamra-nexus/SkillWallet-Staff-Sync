export default function StatCard({
  icon,
  title,
  label,
  value,
  trend,
  sublabel,
  badge,
  breakdown,
  color = 'primary',
  iconBg,
  iconColor,
  onClick,
}) {
  const displayLabel = title || label;

  // Smoked Obsidian Glass color presets
  const colorMap = {
    primary: {
      bg: 'rgba(99, 102, 241, 0.2)',
      border: 'rgba(129, 140, 248, 0.35)',
      color: '#a5b4fc',
    },
    success: {
      bg: 'rgba(16, 185, 129, 0.2)',
      border: 'rgba(52, 211, 153, 0.35)',
      color: '#6ee7b7',
    },
    warning: {
      bg: 'rgba(245, 158, 11, 0.2)',
      border: 'rgba(251, 191, 36, 0.35)',
      color: '#fcd34d',
    },
    info: {
      bg: 'rgba(14, 165, 233, 0.2)',
      border: 'rgba(56, 189, 248, 0.35)',
      color: '#7dd3fc',
    },
    purple: {
      bg: 'rgba(168, 85, 247, 0.2)',
      border: 'rgba(192, 132, 252, 0.35)',
      color: '#d8b4fe',
    },
    danger: {
      bg: 'rgba(244, 63, 94, 0.2)',
      border: 'rgba(248, 113, 113, 0.35)',
      color: '#fca5a5',
    },
  };

  const scheme = colorMap[color] || colorMap.primary;
  const computedBg = iconBg || scheme.bg;
  const computedColor = iconColor || scheme.color;
  const computedBorder = scheme.border;

  return (
    <div
      className="ss-stat-card fade-in-up d-flex flex-column justify-content-between h-100"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="d-flex align-items-center justify-content-between mb-3">
        <span className="ss-stat-label">{displayLabel}</span>
        <div
          className="ss-stat-icon"
          style={{
            background: computedBg,
            color: computedColor,
            border: `1px solid ${computedBorder}`,
          }}
        >
          <i className={`bi ${icon}`} />
        </div>
      </div>

      <div>
        <div className="d-flex align-items-baseline gap-2">
          <span className="ss-stat-value">{value ?? '—'}</span>
          {sublabel && <span className="small text-secondary">{sublabel}</span>}
        </div>

        {badge ? (
          <div className="mt-2 d-flex align-items-center gap-2 flex-wrap">{badge}</div>
        ) : breakdown ? (
          <div className="mt-2 d-flex align-items-center gap-1 flex-wrap">{breakdown}</div>
        ) : trend ? (
          <div className="mt-2 small text-secondary d-flex align-items-center gap-1">
            <span className="ss-stat-trend">{trend}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
