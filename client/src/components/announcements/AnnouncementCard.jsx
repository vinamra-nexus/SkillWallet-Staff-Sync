import { useState } from 'react';

export default function AnnouncementCard({ announcement }) {
  const [expanded, setExpanded] = useState(false);

  const { title, body, category, priority, isPinned, publishAt, createdBy } = announcement;

  const isLong = body && body.length > 200;
  const displayedBody = isLong && !expanded ? `${body.slice(0, 200)}…` : body;

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'urgent':
        return 'bg-danger-subtle text-danger border-danger-subtle';
      case 'event':
        return 'bg-info-subtle text-info border-info-subtle';
      case 'policy':
        return 'bg-warning-subtle text-warning border-warning-subtle';
      default:
        return 'bg-white-10 text-slate-300 border-white-15';
    }
  };

  const getPriorityBadge = (pri) => {
    switch (pri) {
      case 'urgent':
        return (
          <span className="badge rounded-pill bg-danger-subtle text-danger border border-danger-subtle font-overline">
            Urgent Priority
          </span>
        );
      case 'high':
        return (
          <span className="badge rounded-pill bg-warning-subtle text-warning border border-warning-subtle font-overline">
            High Priority
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`p-3.5 p-md-4 rounded-3 border mb-3 transition-all ${
        isPinned ? 'border-primary border-2 shadow-sm' : 'border-white-15'
      }`}
      style={{
        background: isPinned
          ? 'linear-gradient(135deg, rgba(79, 70, 229, 0.12) 0%, rgba(18, 24, 38, 0.6) 100%)'
          : 'rgba(255, 255, 255, 0.04)',
      }}
    >
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
        <div className="d-flex align-items-center gap-2 flex-wrap">
          {isPinned && (
            <span className="badge rounded-pill bg-primary d-inline-flex align-items-center gap-1 font-overline">
              <i className="bi bi-pin-angle-fill"></i> Pinned
            </span>
          )}
          <span
            className={`badge rounded-pill border text-uppercase font-overline ${getCategoryBadge(
              category
            )}`}
          >
            {category}
          </span>
          {getPriorityBadge(priority)}
        </div>
        <span className="text-slate-400 small font-monospace">
          {new Date(publishAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      </div>

      <h6 className="fw-bold text-white mb-2" style={{ fontSize: '1rem' }}>
        {title}
      </h6>

      <p className="text-slate-300 mb-2 small" style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
        {displayedBody}
      </p>

      {isLong && (
        <button
          className="btn btn-link btn-sm p-0 text-decoration-none fw-semibold text-indigo-400"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Show less' : 'Read full announcement →'}
        </button>
      )}

      {createdBy && (
        <div className="border-top border-white-15 pt-2 mt-2 text-slate-400 small d-flex justify-content-between align-items-center">
          <span>
            Posted by: <strong className="text-slate-200">{createdBy.name || 'HR Team'}</strong>
          </span>
        </div>
      )}
    </div>
  );
}
