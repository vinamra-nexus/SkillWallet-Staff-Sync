import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import FormField from '../components/FormField.jsx';
import Spinner from 'react-bootstrap/Spinner';

export default function Login() {
  const { user, login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/';

  // If user is already authenticated, redirect straight to their role dashboard
  useEffect(() => {
    if (user) {
      const rolePath = user.role === 'hr' ? '/hr' : user.role === 'manager' ? '/manager' : '/employee';
      navigate(rolePath, { replace: true });
    }
  }, [user, navigate]);

  const executeLogin = async (loginEmail, loginPassword) => {
    if (!loginEmail || !loginPassword) {
      setError('Please enter both email and password.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const loggedUser = await login(loginEmail, loginPassword);
      showToast(`Welcome back, ${loggedUser.name}!`, 'success');

      if (loggedUser.mustChangePassword) {
        navigate('/change-password', { replace: true });
        return;
      }

      // If redirected from a specific protected page, go there, else go to role dashboard
      if (from !== '/' && from !== '/login') {
        navigate(from, { replace: true });
      } else {
        const rolePath = loggedUser.role === 'hr' ? '/hr' : loggedUser.role === 'manager' ? '/manager' : '/employee';
        navigate(rolePath, { replace: true });
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (typeof err.response?.data === 'string' ? err.response?.data : null) ||
        'Invalid email or password';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await executeLogin(email, password);
  };

  const handleQuickLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    await executeLogin(demoEmail, demoPassword);
  };

  return (
    <div>
      <div className="mb-4">
        <h3 className="fw-bold text-white mb-1" style={{ fontFamily: 'Plus Jakarta Sans', letterSpacing: '-0.015em' }}>Sign In</h3>
        <p className="text-slate-400 small mb-0">Enter your credentials to access the console</p>
      </div>

      {error && (
        <div
          className="alert alert-danger d-flex align-items-center gap-2 py-2.5 px-3 small rounded-3 mb-3 border-0"
          role="alert"
          style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.35)' }}
        >
          <i className="bi bi-exclamation-circle-fill flex-shrink-0"></i>
          <div>{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <FormField label="Email Address" required id="login-email">
          <div className="input-group">
            <span
              className="input-group-text border-end-0 text-slate-400"
              style={{ background: 'rgba(255, 255, 255, 0.06)', borderColor: 'rgba(255, 255, 255, 0.15)' }}
            >
              <i className="bi bi-envelope"></i>
            </span>
            <input
              type="email"
              id="email"
              className="form-control border-start-0 text-white"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                borderColor: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
              }}
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              autoComplete="email"
              required
            />
          </div>
        </FormField>

        <FormField label="Password" required id="login-password">
          <div className="input-group">
            <span
              className="input-group-text border-end-0 text-slate-400"
              style={{ background: 'rgba(255, 255, 255, 0.06)', borderColor: 'rgba(255, 255, 255, 0.15)' }}
            >
              <i className="bi bi-lock"></i>
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              className="form-control border-start-0 border-end-0 text-white"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                borderColor: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
              }}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="btn border-start-0 text-slate-400"
              style={{ background: 'rgba(255, 255, 255, 0.06)', borderColor: 'rgba(255, 255, 255, 0.15)' }}
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
              tabIndex={-1}
            >
              <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
            </button>
          </div>
        </FormField>

        <button
          type="submit"
          id="btn-login"
          className="btn btn-primary w-100 py-2.5 fw-semibold mt-3 rounded-pill text-white shadow"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
              Authenticating...
            </>
          ) : (
            'Sign In to Console'
          )}
        </button>
      </form>

      {/* 1-Click Quick Demo Login */}
      <div className="mt-4 pt-3 border-top border-white-15">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className="text-slate-400 font-overline">
            ⚡ 1-CLICK INSTANT DEMO LOGIN:
          </span>
          <span
            className="badge rounded-pill text-indigo-300 font-monospace"
            style={{ background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', fontSize: '0.7rem' }}
          >
            Passw0rd!23
          </span>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-ghost-smoked btn-sm py-2 px-2.5 rounded-3 fw-medium flex-fill d-flex align-items-center justify-content-center gap-1.5 text-white"
            style={{ fontSize: '0.8rem' }}
            disabled={submitting}
            onClick={() => handleQuickLogin('hr@staffsync.test', 'Passw0rd!23')}
          >
            <i className="bi bi-shield-check text-indigo-400"></i> HR Admin
          </button>
          <button
            type="button"
            className="btn btn-ghost-smoked btn-sm py-2 px-2.5 rounded-3 fw-medium flex-fill d-flex align-items-center justify-content-center gap-1.5 text-white"
            style={{ fontSize: '0.8rem' }}
            disabled={submitting}
            onClick={() => handleQuickLogin('manager@staffsync.test', 'Passw0rd!23')}
          >
            <i className="bi bi-briefcase text-info"></i> Manager
          </button>
          <button
            type="button"
            className="btn btn-ghost-smoked btn-sm py-2 px-2.5 rounded-3 fw-medium flex-fill d-flex align-items-center justify-content-center gap-1.5 text-white"
            style={{ fontSize: '0.8rem' }}
            disabled={submitting}
            onClick={() => handleQuickLogin('employee1@staffsync.test', 'Passw0rd!23')}
          >
            <i className="bi bi-person text-slate-300"></i> Employee
          </button>
        </div>
      </div>
    </div>
  );
}
