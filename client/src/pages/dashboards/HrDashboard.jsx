import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { getDashboardData } from '../../api/dashboard.js';
import AnnouncementCard from '../../components/announcements/AnnouncementCard.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import StatCard from '../../components/StatCard.jsx';
import {
  DepartmentBarChart,
  LeaveStatusDonutChart,
  AttendanceTrendLineChart,
} from '../../components/dashboard/Charts.jsx';
import { useNavigate } from 'react-router';

export default function HrDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState(null);

  // Interactive Pending Queue state
  const [pendingQueue, setPendingQueue] = useState([
    {
      id: 'req-1',
      name: 'Maya Patel',
      role: 'Lead Systems Architect',
      type: 'Casual Leave',
      duration: '3 Days',
      dates: 'Oct 24 - Oct 26',
      reason: 'Family relocation transition days. Coverage delegated to Kevin Vance.',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwMbbyG6XvMXztv9xRMhO3-w_ly37MtVrlM_MnVxJ5lwKQOrlE9U02Q9aTyalP-qBGjU2VNE2shGjp6ooT3U4THPGP2nEzUny3Yi52BHD7JvwdI2TLT1WUHLbP1h7bDs-Ew8xT3gvsE0u2_sg1IcYLZFYNiTsUWmsl338ij9bm3tzXKcp_kU-8PdnGkArf3zQ314z5s3ftVcst5gNfM3kjPpPSRW2h5Z2j4tZyx-U',
      initials: 'MP',
    },
    {
      id: 'req-2',
      name: 'Jordan Blake',
      role: 'Brand Strategist',
      type: 'Medical Leave',
      duration: '1 Day',
      dates: 'Oct 22',
      reason: 'Scheduled outpatient clinical appointment. Medical slip attached.',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHPSdWttBBmr-BwOiPmVuO-GYIua0wHPb66rdkACa_GMg0s5HAXgI7RAWSfX2U3qV8Vru0LYKW4WN3xw86ZgAfF6Skn633aIJn5IvVQJvp9J5ehXWsr6_rq7YamEJJpWQYp88CaE7Fou0PoHOyPXEESJrQ5bv5rONZJ6dU-T0VKokwGMfuuknw49NLl3bckQW7uwdaAAm2y5e_he-t6qTl5-sXJLYhvMvPDfEmVU0',
      initials: 'JB',
    },
  ]);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const res = await getDashboardData();
        if (isMounted) {
          setDashboardData(res.data);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load HR dashboard data', err);
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const d = dashboardData || {};

  const handleQueueAction = (id, applicantName, action) => {
    setPendingQueue((prev) => prev.filter((item) => item.id !== id));
    setActionNotice({
      message: `Successfully ${action === 'approved' ? 'approved' : 'rejected'} leave request for ${applicantName}.`,
      type: action === 'approved' ? 'success' : 'danger',
    });
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleDownloadAudit = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Timestamp,Employee,Department,Action,Details\n' +
      '2026-10-27 18:15,Alex Rivers,Engineering,Training,Completed Level 2 Security Protocol\n' +
      '2026-10-27 17:30,Marcus Chen,Product,Promotion,Promoted to Senior Product Operations Lead\n' +
      '2026-10-27 15:00,Sophia Lawson,Design,Onboarding,Onboarded as Staff Interaction Architect\n' +
      '2026-10-27 13:00,Devon Thorne,Finance,Policy,Status shifted: Remote Work Policy tier updated\n';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `staffsync_workforce_audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setActionNotice({
      message: 'Workforce audit log successfully downloaded as CSV.',
      type: 'success',
    });
    setTimeout(() => setActionNotice(null), 3500);
  };

  return (
    <div className="container-fluid py-4">
      {/* Toast Notification Alert */}
      {actionNotice && (
        <div
          className={`alert alert-${actionNotice.type} alert-dismissible fade show border-0 shadow-lg mb-4 glass-card d-flex align-items-center justify-content-between`}
          role="alert"
          style={{
            background:
              actionNotice.type === 'success'
                ? 'rgba(16, 185, 129, 0.2)'
                : 'rgba(239, 68, 68, 0.2)',
            border: `1px solid ${actionNotice.type === 'success' ? 'rgba(52, 211, 153, 0.4)' : 'rgba(248, 113, 113, 0.4)'}`,
            color: '#ffffff',
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <i
              className={`bi ${actionNotice.type === 'success' ? 'bi-check-circle-fill text-success' : 'bi-exclamation-triangle-fill text-danger'}`}
            ></i>
            <span>{actionNotice.message}</span>
          </div>
          <button
            type="button"
            className="btn-close btn-close-white"
            onClick={() => setActionNotice(null)}
          ></button>
        </div>
      )}

      {/* 1. Smoked Glass Hero Welcome Banner */}
      <div className="glass-hero-banner position-relative overflow-hidden rounded-4 p-4 p-lg-5 mb-4 text-white">
        {/* Specular halos */}
        <div className="hero-specular-halo-1"></div>
        <div className="hero-specular-halo-2"></div>

        <div
          className="position-relative d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-4"
          style={{ zIndex: 2 }}
        >
          <div className="d-flex align-items-center gap-3 gap-md-4">
            <div className="position-relative flex-shrink-0">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOc6KQmbng-2YgWp7IbcF3Bmj2IO_QReWFbvhIu466ZhQCkuGHghsFMdboNhLwPJrFm_0xrrYSf31wLRi8CrStW5D2IlflcJsYsjZF4iEhkynTAGP4GzjWD8khi9rFAXGtJCeaPT4Yu5guF7YVNMBZwPvjXviBXlyWGAKb-f7H5TY52v3Edrrp132R7QZvb39mZWZNt3GHhJehMFKcdw7ShzwzsR4clcAzgdOPWwY"
                alt={user?.name || 'HR Executive'}
                className="rounded-4 object-fit-cover shadow-lg border border-white-20"
                style={{ width: '76px', height: '76px' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div
                className="position-absolute bottom-0 end-0 rounded-circle bg-success d-flex align-items-center justify-content-center text-white shadow"
                style={{ width: '22px', height: '22px', border: '3px solid #111624', fontSize: '11px' }}
                title="Online & Verified"
              >
                <i className="bi bi-check-lg fw-bold"></i>
              </div>
            </div>
            <div>
              <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                <span className="badge-console">Executive Console</span>
                <span className="text-secondary">•</span>
                <span className="text-slate-300 font-monospace small">
                  {user?.employeeCode || 'EMP-0102'}
                </span>
              </div>
              <h1 className="hero-heading mb-1">
                Welcome back, {user?.name || 'Sarah Jenkins'}
              </h1>
              <p className="text-slate-300 mb-0 small">
                {user?.designation || 'HR Director'} &bull; {user?.department?.name || 'Human Resources'} & Global Talent Operations
              </p>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            <button
              type="button"
              className="btn-ghost-smoked d-flex align-items-center gap-2 px-4 py-2.5 rounded-pill text-white fw-semibold"
              onClick={() => navigate('/attendance')}
            >
              <i className="bi bi-clock-history text-indigo-300"></i>
              <span>Attendance Logs</span>
            </button>
            <button
              type="button"
              className="btn-primary d-flex align-items-center gap-2 px-4 py-2.5 rounded-pill text-white fw-semibold"
              onClick={() => navigate('/employees')}
            >
              <i className="bi bi-people-fill"></i>
              <span>Workforce Roster</span>
              <i className="bi bi-arrow-right small"></i>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Primary KPI Row (4 Columns Smoked Obsidian Glass) */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Total Headcount"
            value={loading ? '—' : d.totalEmployees || 248}
            sublabel="active staff"
            icon="bi-people-fill"
            color="primary"
            badge={
              <>
                <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle d-inline-flex align-items-center gap-1 px-2 py-1 small fw-bold">
                  <i className="bi bi-arrow-up-short"></i> 12%
                </span>
                <span className="small text-slate-400 font-overline">vs last month</span>
              </>
            }
            onClick={() => navigate('/employees')}
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Present Today"
            value={loading ? '—' : d.presentToday || 224}
            sublabel="clocked in"
            icon="bi-person-check-fill"
            color="success"
            badge={
              <>
                <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle d-inline-flex align-items-center gap-1 px-2.5 py-1 small fw-bold">
                  <span
                    className="spinner-grow spinner-grow-sm text-success"
                    style={{ width: '6px', height: '6px' }}
                  ></span>
                  90.3% rate
                </span>
                <span className="small text-slate-400 font-overline">healthy quorum</span>
              </>
            }
            onClick={() => navigate('/attendance')}
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="On Leave"
            value={loading ? '—' : d.pendingLeaves || 16}
            sublabel="scheduled away"
            icon="bi-calendar2-week-fill"
            color="warning"
            breakdown={
              <div className="d-flex gap-1 flex-wrap mt-1">
                <span className="badge bg-white-10 text-slate-200 border border-white-15 px-2 py-1">
                  11 Casual
                </span>
                <span className="badge bg-white-10 text-slate-200 border border-white-15 px-2 py-1">
                  4 Sick
                </span>
                <span className="badge bg-white-10 text-slate-200 border border-white-15 px-2 py-1">
                  1 Mat
                </span>
              </div>
            }
            onClick={() => navigate('/leaves/requests')}
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Org Skill Proficiency"
            value={loading ? '—' : `${d.trainingCompletionRate ? d.trainingCompletionRate : 84.2}%`}
            sublabel="avg score"
            icon="bi-mortarboard-fill"
            color="purple"
            badge={
              <>
                <span className="badge rounded-pill bg-purple-subtle text-purple border border-purple-subtle d-inline-flex align-items-center gap-1 px-2 py-1 small fw-bold">
                  <i className="bi bi-graph-up-arrow"></i> +3.4%
                </span>
                <span className="small text-slate-400 font-overline">quarter-to-date</span>
              </>
            }
            onClick={() => navigate('/trainings')}
          />
        </div>
      </div>

      {/* 3. Analytics Charts Row (2 Columns Smoked Glass) */}
      <div className="row g-4 mb-4">
        {/* Department Headcount Bar Chart */}
        <div className="col-12 col-lg-7">
          <div className="glass-card rounded-4 p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex justify-content-between align-items-center pb-3 border-bottom border-white-15 mb-3">
                <div>
                  <span className="font-overline text-slate-400">Departmental Spread</span>
                  <h5 className="fw-bold text-white mb-0">Department Headcount Distribution</h5>
                </div>
                <button
                  className="btn btn-ghost-smoked btn-sm d-flex align-items-center gap-1 text-indigo-300"
                  onClick={() => navigate('/departments')}
                >
                  <span>View Units</span>
                  <i className="bi bi-arrow-right small"></i>
                </button>
              </div>

              {loading ? (
                <div className="text-center py-5 text-slate-400">
                  <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                  Loading department metrics...
                </div>
              ) : (
                <DepartmentBarChart data={d.headcountByDepartment || []} />
              )}
            </div>

            <div className="d-flex justify-content-between align-items-center pt-3 border-top border-white-15 text-slate-400 small mt-3">
              <span>
                Capacity Threshold: <strong className="text-white">Normal (89%)</strong>
              </span>
              <span className="text-indigo-400 fw-semibold">Updated 5m ago</span>
            </div>
          </div>
        </div>

        {/* Leave Requests Donut Chart */}
        <div className="col-12 col-lg-5">
          <div className="glass-card rounded-4 p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex justify-content-between align-items-center pb-3 border-bottom border-white-15 mb-3">
                <div>
                  <span className="font-overline text-slate-400">Leave Analytics</span>
                  <h5 className="fw-bold text-white mb-0">Leave Status Distribution</h5>
                </div>
                <button
                  className="btn btn-ghost-smoked btn-sm d-flex align-items-center gap-1 text-indigo-300"
                  onClick={() => navigate('/leaves/requests')}
                >
                  <span>Requests</span>
                  <i className="bi bi-arrow-right small"></i>
                </button>
              </div>

              {loading ? (
                <div className="text-center py-5 text-slate-400">
                  <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                  Loading leave distribution...
                </div>
              ) : (
                <LeaveStatusDonutChart data={d.leaveRequestsByStatus} />
              )}
            </div>

            <div className="d-flex justify-content-between align-items-center pt-3 border-top border-white-15 text-slate-400 small mt-3">
              <span>
                Resolution Velocity: <strong className="text-white">2.1 days avg</strong>
              </span>
              <span className="text-success fw-bold">94.3% Actioned</span>
            </div>
          </div>
        </div>

        {/* 30-Day Attendance Trend Line Chart */}
        <div className="col-12">
          <div className="glass-card rounded-4 p-4">
            <div className="d-flex justify-content-between align-items-center pb-2 border-bottom border-white-15 mb-3 flex-wrap gap-2">
              <div>
                <span className="font-overline text-slate-400">Longitudinal Telemetry</span>
                <h5 className="fw-bold text-white mb-0">30-Day Attendance Rate Trend</h5>
                <small className="text-slate-400">
                  Company-wide daily presence percentage over the last 30 calendar days
                </small>
              </div>
              <button
                className="btn btn-ghost-smoked btn-sm d-flex align-items-center gap-1 text-indigo-300"
                onClick={() => navigate('/attendance')}
              >
                <span>Attendance Report</span>
                <i className="bi bi-arrow-right small"></i>
              </button>
            </div>
            {loading ? (
              <div className="text-center py-5 text-slate-400">
                <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                Loading attendance trend...
              </div>
            ) : (
              <AttendanceTrendLineChart data={d.attendanceRateTrend || []} />
            )}
          </div>
        </div>
      </div>

      {/* 4. Bottom Activity & Pending Approval Queue (Stitch Layout) */}
      <div className="row g-4 mb-4">
        {/* Recent Workforce Activity Glass Stream */}
        <div className="col-12 col-lg-7">
          <div className="glass-card rounded-4 p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex justify-content-between align-items-center pb-3 border-bottom border-white-15 mb-3">
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="rounded-3 d-flex align-items-center justify-content-center text-indigo-300"
                    style={{
                      width: '34px',
                      height: '34px',
                      background: 'rgba(99, 102, 241, 0.2)',
                      border: '1px solid rgba(129, 140, 248, 0.3)',
                    }}
                  >
                    <i className="bi bi-activity"></i>
                  </div>
                  <h5 className="fw-bold text-white mb-0">Recent Workforce Activity</h5>
                </div>
                <span className="badge rounded-pill bg-white-10 text-slate-300 border border-white-15 px-3 py-1 font-overline">
                  Realtime Stream
                </span>
              </div>

              {/* Activity rows */}
              <div className="d-flex flex-column gap-2">
                {/* Item 1 */}
                <div className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-white-10 border border-white-15">
                  <div className="d-flex align-items-center gap-3 min-w-0">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWq_809F33d17TH-RgzYTHHTGj1bHmQq2_o-C4eA-LxnpTAwFP6vZbtBVP6JBCxcvalBsNn3-hi2V0jc-fsnWVvSsiCduPHXPIXZ2sr5KBfX5yXb_Jq8gQlzGjdXkHpN_ZdZYxboYtX5MkJYHIZJ_iAflku2jnEytZSteYwrQQLO4OCGFc6ZXgP5yBieQK0angqYQgY7CuZzmm77ZGTZq-_dGawXyUGYZecfFCwYM"
                      alt="Alex Rivers"
                      className="rounded-3 object-fit-cover border border-white-15"
                      style={{ width: '40px', height: '40px' }}
                    />
                    <div className="min-w-0">
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <span className="fw-semibold text-white small">Alex Rivers</span>
                        <span className="text-slate-400 small">&bull; Engineering</span>
                      </div>
                      <div className="text-slate-300 small text-truncate">
                        Completed Level 2 Security Protocol training module
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2 ms-2 flex-shrink-0">
                    <span className="badge rounded-pill bg-purple-subtle text-purple border border-purple-subtle px-2 py-0.5 font-overline">
                      Training
                    </span>
                    <span className="text-slate-400 small font-monospace">12m ago</span>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-white-10 border border-white-15">
                  <div className="d-flex align-items-center gap-3 min-w-0">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtCs-ujMbwW8R6CkVO1UleOWkWnA8eSUGN4s6zKYUutnj9k6mj3wAqirrwk_d7C62YGnEQl9_obbYFV5eqptn676O-UC746pyIFOSpDT31Y3eDxfThx6kGR5l09aDWe2ZVXLW_QxBMHmTZOTWFkH94o0GLYHSTdTnWrT_jcSZw3M_sepMjvhn_rPxS711h-hYToqfFB8R6HitZS1JEAmd_u4nCcId-bECptrghep0"
                      alt="Marcus Chen"
                      className="rounded-3 object-fit-cover border border-white-15"
                      style={{ width: '40px', height: '40px' }}
                    />
                    <div className="min-w-0">
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <span className="fw-semibold text-white small">Marcus Chen</span>
                        <span className="text-slate-400 small">&bull; Product</span>
                      </div>
                      <div className="text-slate-300 small text-truncate">
                        Promoted to Senior Product Operations Lead
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2 ms-2 flex-shrink-0">
                    <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-2 py-0.5 font-overline">
                      Promotion
                    </span>
                    <span className="text-slate-400 small font-monospace">1h ago</span>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-white-10 border border-white-15">
                  <div className="d-flex align-items-center gap-3 min-w-0">
                    <div
                      className="rounded-3 d-flex align-items-center justify-content-center text-indigo-300 fw-bold border border-indigo-400-30"
                      style={{
                        width: '40px',
                        height: '40px',
                        background: 'rgba(99, 102, 241, 0.2)',
                        fontSize: '13px',
                      }}
                    >
                      SL
                    </div>
                    <div className="min-w-0">
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <span className="fw-semibold text-white small">Sophia Lawson</span>
                        <span className="text-slate-400 small">&bull; Design</span>
                      </div>
                      <div className="text-slate-300 small text-truncate">
                        Onboarded as Staff Interaction Architect
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2 ms-2 flex-shrink-0">
                    <span className="badge rounded-pill bg-sky-subtle text-sky border border-sky-subtle px-2 py-0.5 font-overline">
                      Onboarding
                    </span>
                    <span className="text-slate-400 small font-monospace">3h ago</span>
                  </div>
                </div>

                {/* Item 4 */}
                <div className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-white-10 border border-white-15">
                  <div className="d-flex align-items-center gap-3 min-w-0">
                    <div
                      className="rounded-3 d-flex align-items-center justify-content-center text-slate-300 fw-bold border border-white-15"
                      style={{
                        width: '40px',
                        height: '40px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        fontSize: '13px',
                      }}
                    >
                      DT
                    </div>
                    <div className="min-w-0">
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <span className="fw-semibold text-white small">Devon Thorne</span>
                        <span className="text-slate-400 small">&bull; Finance</span>
                      </div>
                      <div className="text-slate-300 small text-truncate">
                        Status shifted: Remote Work Policy tier updated
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2 ms-2 flex-shrink-0">
                    <span className="badge rounded-pill bg-white-10 text-slate-300 border border-white-15 px-2 py-0.5 font-overline">
                      Policy
                    </span>
                    <span className="text-slate-400 small font-monospace">5h ago</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center pt-3 border-top border-white-15 text-slate-400 small mt-3">
              <span>
                Showing latest <strong className="text-white">4 of 28</strong> audit records
              </span>
              <button
                type="button"
                className="btn btn-ghost-smoked btn-sm text-indigo-300 fw-semibold"
                onClick={handleDownloadAudit}
              >
                <i className="bi bi-download me-1"></i> Download Log Audit
              </button>
            </div>
          </div>
        </div>

        {/* Pending Approval Queue */}
        <div className="col-12 col-lg-5">
          <div className="glass-card rounded-4 p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex justify-content-between align-items-center pb-3 border-bottom border-white-15 mb-3">
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="rounded-3 d-flex align-items-center justify-content-center text-amber-300"
                    style={{
                      width: '34px',
                      height: '34px',
                      background: 'rgba(245, 158, 11, 0.2)',
                      border: '1px solid rgba(251, 191, 36, 0.3)',
                    }}
                  >
                    <i className="bi bi-hourglass-split"></i>
                  </div>
                  <h5 className="fw-bold text-white mb-0">Pending Approval Queue</h5>
                </div>
                <span className="badge rounded-pill bg-amber-subtle text-amber border border-amber-subtle px-2.5 py-1 fw-bold">
                  {pendingQueue.length} Awaiting
                </span>
              </div>

              {pendingQueue.length === 0 ? (
                <div className="text-center py-5 text-slate-400">
                  <i className="bi bi-check2-circle fs-1 text-success mb-2 d-block"></i>
                  <p className="mb-0 fw-semibold text-white">All requests have been reviewed!</p>
                  <small>No pending leave requests in your executive queue.</small>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {pendingQueue.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-3 border border-white-15 shadow-sm"
                      style={{ background: 'rgba(10, 14, 23, 0.6)' }}
                    >
                      <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
                        <div className="d-flex align-items-center gap-2.5">
                          {item.avatar ? (
                            <img
                              src={item.avatar}
                              alt={item.name}
                              className="rounded-3 object-fit-cover border border-white-15"
                              style={{ width: '42px', height: '42px' }}
                            />
                          ) : (
                            <div
                              className="rounded-3 d-flex align-items-center justify-content-center text-white fw-bold border border-white-15"
                              style={{
                                width: '42px',
                                height: '42px',
                                background: 'rgba(99, 102, 241, 0.25)',
                              }}
                            >
                              {item.initials}
                            </div>
                          )}
                          <div>
                            <span className="fw-bold text-white d-block small">{item.name}</span>
                            <span className="text-slate-400 small" style={{ fontSize: '11px' }}>
                              {item.role} &bull; {item.type}
                            </span>
                          </div>
                        </div>
                        <span className="badge rounded-pill bg-amber-subtle text-amber border border-amber-subtle px-2.5 py-1 small fw-bold">
                          {item.duration}
                        </span>
                      </div>

                      <div
                        className="p-2.5 rounded-2 text-slate-300 small mb-3 border border-white-15"
                        style={{ background: 'rgba(255, 255, 255, 0.04)', fontSize: '12px' }}
                      >
                        <strong className="text-white">{item.dates}:</strong> {item.reason}
                      </div>

                      <div className="d-flex justify-content-end gap-2">
                        <button
                          type="button"
                          className="btn btn-danger-outline btn-sm px-3 py-1.5 fw-semibold"
                          onClick={() => handleQueueAction(item.id, item.name, 'rejected')}
                        >
                          Quick Reject
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm px-3 py-1.5 fw-semibold"
                          onClick={() => handleQueueAction(item.id, item.name, 'approved')}
                        >
                          Quick Approve
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-top border-white-15 text-center mt-3">
              <button
                type="button"
                className="btn btn-ghost-smoked btn-sm w-100 text-indigo-300 fw-semibold"
                onClick={() => navigate('/leaves/requests')}
              >
                Go to Full Leave Management &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Company Announcements & Upcoming Holidays (Smoked Glass Row) */}
      <div className="row g-4 mb-4">
        {/* Company Announcements */}
        <div className="col-12 col-lg-8">
          <div className="glass-card rounded-4 p-4 h-100">
            <div className="d-flex justify-content-between align-items-center pb-3 border-bottom border-white-15 mb-3 flex-wrap gap-2">
              <div className="d-flex align-items-center gap-2">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center text-indigo-300"
                  style={{
                    width: '34px',
                    height: '34px',
                    background: 'rgba(99, 102, 241, 0.2)',
                    border: '1px solid rgba(129, 140, 248, 0.3)',
                  }}
                >
                  <i className="bi bi-megaphone"></i>
                </div>
                <h5 className="fw-bold text-white mb-0">Company Announcements</h5>
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-ghost-smoked btn-sm"
                  onClick={() => navigate('/announcements/manage')}
                >
                  <i className="bi bi-gear me-1"></i> Manage
                </button>
                <button
                  className="btn btn-ghost-smoked btn-sm text-indigo-300"
                  onClick={() => navigate('/announcements')}
                >
                  Feed &rarr;
                </button>
              </div>
            </div>

            <div>
              {loading ? (
                <div className="text-center py-4 text-slate-400">
                  <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                  Loading bulletins...
                </div>
              ) : !d.latestAnnouncements || d.latestAnnouncements.length === 0 ? (
                <div className="text-center py-4 text-slate-400">
                  No active announcements posted yet.
                </div>
              ) : (
                d.latestAnnouncements.map((item) => (
                  <AnnouncementCard key={item._id} announcement={item} />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Holidays */}
        <div className="col-12 col-lg-4">
          <div className="glass-card rounded-4 p-4 h-100">
            <div className="d-flex justify-content-between align-items-center pb-3 border-bottom border-white-15 mb-3">
              <div className="d-flex align-items-center gap-2">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center text-amber-300"
                  style={{
                    width: '34px',
                    height: '34px',
                    background: 'rgba(245, 158, 11, 0.2)',
                    border: '1px solid rgba(251, 191, 36, 0.3)',
                  }}
                >
                  <i className="bi bi-calendar-event"></i>
                </div>
                <h5 className="fw-bold text-white mb-0">Upcoming Holidays</h5>
              </div>
              <button
                className="btn btn-ghost-smoked btn-sm text-indigo-300"
                onClick={() => navigate('/leaves/calendar')}
              >
                Calendar &rarr;
              </button>
            </div>

            <div>
              {loading ? (
                <div className="text-center py-4 text-slate-400">Loading holidays...</div>
              ) : !d.upcomingHolidays || d.upcomingHolidays.length === 0 ? (
                <div className="text-center py-4 text-slate-400 small">
                  No upcoming holidays scheduled.
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {d.upcomingHolidays.map((h) => (
                    <div
                      key={h._id}
                      className="d-flex justify-content-between align-items-center p-2.5 rounded-3 bg-white-10 border border-white-15"
                    >
                      <div>
                        <div className="fw-semibold text-white small">{h.name}</div>
                        <small className="text-slate-400 font-monospace">{h.date}</small>
                      </div>
                      <span className="badge rounded-pill bg-amber-subtle text-amber border border-amber-subtle">
                        Public Holiday
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
