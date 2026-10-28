import { Outlet } from 'react-router';

export default function AuthLayout() {
  return (
    <div
      className="auth-wrapper min-vh-100 d-flex align-items-center justify-content-center p-3 position-relative overflow-hidden"
      style={{ backgroundColor: '#0b0e17', color: '#f1f5f9' }}
    >
      {/* Ambient background glowing halos */}
      <div className="ambient-orb-1" style={{ width: '30rem', height: '30rem' }}></div>
      <div className="ambient-orb-2" style={{ width: '28rem', height: '28rem' }}></div>
      <div className="ambient-orb-3" style={{ width: '26rem', height: '26rem' }}></div>

      <div className="w-100 position-relative" style={{ maxWidth: '460px', zIndex: 10 }}>
        {/* Brand Header */}
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center text-white rounded-3 p-3 shadow-lg mb-2"
            style={{
              width: '52px',
              height: '52px',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
            }}
          >
            <i className="bi bi-people-fill fs-4"></i>
          </div>
          <h2 className="fw-bold tracking-tight mb-1 text-white" style={{ fontFamily: 'Plus Jakarta Sans', letterSpacing: '-0.02em' }}>
            Staff<span style={{ color: '#818cf8' }}>Sync</span>
          </h2>
          <p className="text-slate-400 small mb-0 font-overline">
            ENTERPRISE HUMAN RESOURCE OS
          </p>
        </div>

        {/* Smoked Obsidian Glass Login Card */}
        <div className="glass-card rounded-4 overflow-hidden p-4 p-sm-5">
          <Outlet />
        </div>

        <div className="text-center mt-4">
          <p className="text-slate-400 small mb-0" style={{ fontSize: '0.8rem' }}>
            &copy; {new Date().getFullYear()} StaffSync HRM. Smoked Obsidian Glass Edition.
          </p>
        </div>
      </div>
    </div>
  );
}
