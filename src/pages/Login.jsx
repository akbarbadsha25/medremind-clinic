import { useState } from 'react';
import { Activity, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const ok = login(email, password);
      if (!ok) setError('Invalid email or password. Please try again.');
      setLoading(false);
    }, 400);
  }

  function fillDemo(role) {
    if (role === 'doctor') {
      setEmail('dr.arjun@mehtaaesthetics.com');
      setPassword('doctor123');
    } else {
      setEmail('reception@mehtaaesthetics.com');
      setPassword('staff123');
    }
    setError('');
  }

  return (
    <div className="login-page">

      {/* ── Left: Brand panel ── */}
      <div className="login-left">
        <div className="login-left-inner">
          <div className="login-brand">
            <div className="login-brand-icon">
              <Activity size={20} />
            </div>
            <div className="login-brand-text">
              <span className="login-brand-name">MedRemind</span>
              <span className="login-brand-sub">Aesthetics</span>
            </div>
          </div>

          <div className="login-hero">
            <h1>Smart clinic management for modern doctors.</h1>
            <p>Everything your practice needs — patients, appointments, and WhatsApp reminders in one place.</p>
          </div>

          <ul className="login-features">
            <li><CheckCircle size={15} /><span>Complete patient records & visit history</span></li>
            <li><CheckCircle size={15} /><span>Appointment scheduling with daily limits</span></li>
            <li><CheckCircle size={15} /><span>WhatsApp reminders in one click</span></li>
            <li><CheckCircle size={15} /><span>Role-based access for your team</span></li>
          </ul>

          <div className="login-left-card">
            <div className="login-stat-row">
              <div className="login-stat">
                <span className="login-stat-value">15+</span>
                <span className="login-stat-label">Patients</span>
              </div>
              <div className="login-stat-divider" />
              <div className="login-stat">
                <span className="login-stat-value">8</span>
                <span className="login-stat-label">Today's apts</span>
              </div>
              <div className="login-stat-divider" />
              <div className="login-stat">
                <span className="login-stat-value">2</span>
                <span className="login-stat-label">Roles</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: Form panel ── */}
      <div className="login-right">
        <div className="login-form-wrap">
          <div className="login-heading">
            <h2>Welcome back</h2>
            <p>Sign in to your clinic dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className="form-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="login-input-wrap">
                <input
                  className="form-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setShowPassword(v => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <div className="login-error">{error}</div>}

            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="login-demo">
            <div className="login-demo-label">Demo accounts — click to fill</div>
            <div className="login-demo-cards">
              <button className="login-demo-card" type="button" onClick={() => fillDemo('doctor')}>
                <span className="login-demo-role doctor">Doctor</span>
                <span className="login-demo-email">dr.arjun@mehtaaesthetics.com</span>
                <span className="login-demo-pass">doctor123</span>
              </button>
              <button className="login-demo-card" type="button" onClick={() => fillDemo('receptionist')}>
                <span className="login-demo-role receptionist">Reception</span>
                <span className="login-demo-email">reception@mehtaaesthetics.com</span>
                <span className="login-demo-pass">staff123</span>
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
