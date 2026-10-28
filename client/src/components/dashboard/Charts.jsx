import React from 'react';

/**
 * Headcount by Department Bar Chart - Smoked Obsidian Glass
 */
export function DepartmentBarChart({ data = [] }) {
  if (!data || data.length === 0) {
    return <div className="text-center py-4 text-muted small">No department headcount data available.</div>;
  }

  const maxVal = Math.max(...data.map((d) => d.count), 1);
  const chartHeight = 180;
  const barWidth = 42;
  const gap = 24;
  const svgWidth = Math.max(340, data.length * (barWidth + gap) + 40);

  const neonGradients = [
    { from: '#4f46e5', to: '#818cf8', shadow: 'rgba(99, 102, 241, 0.4)' },
    { from: '#0891b2', to: '#22d3ee', shadow: 'rgba(6, 182, 212, 0.4)' },
    { from: '#0284c7', to: '#38bdf8', shadow: 'rgba(14, 165, 233, 0.4)' },
    { from: '#9333ea', to: '#c084fc', shadow: 'rgba(168, 85, 247, 0.4)' },
    { from: '#4f46e5', to: '#c084fc', shadow: 'rgba(99, 102, 241, 0.4)' },
  ];

  return (
    <div className="w-100 overflow-x-auto py-2">
      <div className="p-3 rounded-3" style={{ background: 'rgba(0, 0, 0, 0.25)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <svg
          viewBox={`0 0 ${svgWidth} ${chartHeight + 40}`}
          className="w-100"
          style={{ minWidth: `${svgWidth}px`, height: '220px' }}
          role="img"
          aria-label="Department headcount distribution bar chart"
        >
          <defs>
            {neonGradients.map((g, idx) => (
              <linearGradient id={`barGrad-${idx}`} key={idx} x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor={g.from} />
                <stop offset="100%" stopColor={g.to} />
              </linearGradient>
            ))}
          </defs>

          {/* Horizontal gridlines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const y = chartHeight - pct * (chartHeight - 20) + 10;
            return (
              <g key={idx}>
                <line x1="30" y1={y} x2={svgWidth - 10} y2={y} stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" strokeDasharray="3 3" />
                <text x="25" y={y + 3} textAnchor="end" fontSize="10" fill="#64748b" fontFamily="JetBrains Mono">
                  {Math.round(pct * maxVal)}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {data.map((item, idx) => {
            const x = 40 + idx * (barWidth + gap);
            const barH = Math.max(6, (item.count / maxVal) * (chartHeight - 20));
            const y = chartHeight - barH + 10;
            const gradIdx = idx % neonGradients.length;

            return (
              <g key={item.department} className="transition-all" style={{ cursor: 'pointer' }}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barH}
                  rx="6"
                  fill={`url(#barGrad-${gradIdx})`}
                  style={{
                    filter: `drop-shadow(0 0 10px ${neonGradients[gradIdx].shadow})`,
                    transition: 'all 0.3s ease',
                  }}
                />
                <text
                  x={x + barWidth / 2}
                  y={y - 6}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="700"
                  fill="#ffffff"
                  fontFamily="JetBrains Mono"
                >
                  {item.count}
                </text>
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + 25}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#94a3b8"
                  fontWeight="500"
                >
                  {item.department.length > 10 ? `${item.department.slice(0, 9)}…` : item.department}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

/**
 * Leave Requests by Status Donut Chart - Smoked Obsidian Glass
 */
export function LeaveStatusDonutChart({ data = { pending: 0, approved: 0, rejected: 0, cancelled: 0 } }) {
  const slices = [
    { label: 'Approved', count: data.approved || 0, color: '#34d399', bg: 'rgba(52, 211, 153, 0.15)' },
    { label: 'Pending', count: data.pending || 0, color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)' },
    { label: 'Rejected', count: data.rejected || 0, color: '#f87171', bg: 'rgba(248, 113, 113, 0.15)' },
  ];

  const total = slices.reduce((sum, s) => sum + s.count, 0);

  // Calculate SVG stroke-dasharray segments
  const size = 160;
  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="d-flex flex-wrap align-items-center justify-content-center gap-4 py-3">
      <div className="position-relative" style={{ width: `${size}px`, height: `${size}px` }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: 'rotate(-90deg)' }}
          role="img"
          aria-label="Leave requests status donut chart"
        >
          {/* Base track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.06)"
            strokeWidth={strokeWidth}
          />
          {total > 0 &&
            slices.map((slice) => {
              const percent = slice.count / total;
              const strokeDasharray = `${percent * circumference} ${circumference}`;
              const strokeDashoffset = -(accumulatedPercent * circumference);
              accumulatedPercent += percent;

              if (slice.count === 0) return null;

              return (
                <circle
                  key={slice.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{ filter: `drop-shadow(0 0 8px ${slice.color}66)` }}
                />
              );
            })}
        </svg>

        {/* Center label */}
        <div className="position-absolute top-50 start-50 translate-middle text-center">
          <span className="fw-bold fs-3 text-white d-block tabular-nums" style={{ fontFamily: 'JetBrains Mono', lineHeight: 1 }}>
            {total || 0}
          </span>
          <span style={{ fontSize: '0.62rem', color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            THIS MONTH
          </span>
        </div>
      </div>

      {/* Legend list */}
      <div className="d-flex flex-column gap-2" style={{ minWidth: '150px' }}>
        {slices.map((slice) => (
          <div
            key={slice.label}
            className="d-flex align-items-center justify-content-between p-2 rounded-3 border"
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              borderColor: 'rgba(255, 255, 255, 0.08)',
            }}
          >
            <div className="d-flex align-items-center gap-2">
              <span
                className="rounded-circle"
                style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: slice.color,
                  boxShadow: `0 0 6px ${slice.color}`,
                }}
              ></span>
              <span className="small text-slate-300" style={{ color: '#cbd5e1' }}>{slice.label}</span>
            </div>
            <span
              className="badge rounded-pill fw-bold"
              style={{
                backgroundColor: slice.bg,
                color: slice.color,
                fontFamily: 'JetBrains Mono',
                fontSize: '0.75rem',
              }}
            >
              {slice.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 30-Day Attendance Trend Line Chart
 */
export function AttendanceTrendLineChart({ data = [] }) {
  if (!data || data.length === 0) {
    return <div className="text-center py-4 text-muted small">No attendance trend data available.</div>;
  }

  const width = 600;
  const height = 180;
  const paddingX = 40;
  const paddingY = 20;

  const points = data.map((d, idx) => {
    const x = paddingX + (idx / (data.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - (d.rate / 100) * (height - 2 * paddingY);
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${
    height - paddingY
  } Z`;

  return (
    <div className="w-100 overflow-x-auto py-2">
      <svg
        viewBox={`0 0 ${width} ${height + 30}`}
        className="w-100"
        style={{ minWidth: '480px', height: '210px' }}
        role="img"
        aria-label="30-day attendance percentage rate trend line chart"
      >
        <defs>
          <linearGradient id="trendAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal gridlines */}
        {[0, 25, 50, 75, 100].map((rate) => {
          const y = height - paddingY - (rate / 100) * (height - 2 * paddingY);
          return (
            <g key={rate}>
              <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke="#f1f5f9" strokeWidth="1" />
              <text x={paddingX - 8} y={y + 3} textAnchor="end" fontSize="10" fill="#94a3b8">
                {rate}%
              </text>
            </g>
          );
        })}

        {/* Gradient Area Fill */}
        <path d={areaD} fill="url(#trendAreaGrad)" />

        {/* Primary Line */}
        <path d={pathD} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />

        {/* Sample Point Markers & Dates */}
        {points.map((p, idx) => {
          if (idx % 5 === 0 || idx === points.length - 1) {
            return (
              <g key={p.date}>
                <circle cx={p.x} cy={p.y} r="4" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
                <text
                  x={p.x}
                  y={height + 15}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#64748b"
                >
                  {p.date.slice(5)}
                </text>
              </g>
            );
          }
          return null;
        })}
      </svg>
    </div>
  );
}
