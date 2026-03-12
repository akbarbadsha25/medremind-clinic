import { Link, useNavigate } from 'react-router-dom';
import { Users, CalendarCheck, MessageCircle, TrendingUp, UserPlus, Send, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { getAvatarColor, getInitials } from '../data/mockData';

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { patients, getStats, getAppointmentsForDate } = useApp();
  const stats = getStats();
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = getAppointmentsForDate(today);

  const recentPatients = [...patients]
    .sort((a, b) => new Date(b.lastVisit) - new Date(a.lastVisit))
    .slice(0, 5);

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-header-title">Dashboard</h1>
          <p className="page-header-subtitle">Welcome back, {currentUser?.name}. Here's your overview for today.</p>
        </div>
      </div>

      {/* Stats — all cards are links */}
      <div className="stats-grid">
        <Link to="/patients" className="stat-card">
          <div className="stat-icon green"><Users size={24} /></div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalPatients}</span>
            <span className="stat-label">Total Patients</span>
            <span className="stat-trend up"><TrendingUp size={12} /> +{stats.newPatients} new</span>
          </div>
        </Link>

        <Link to="/appointments" className="stat-card">
          <div className="stat-icon blue"><CalendarCheck size={24} /></div>
          <div className="stat-info">
            <span className="stat-value">{todayAppointments.length}</span>
            <span className="stat-label">Today's Appointments</span>
            <span className="stat-trend up"><Clock size={12} /> Next at 09:00 AM</span>
          </div>
        </Link>

        <Link to="/appointments" className="stat-card">
          <div className="stat-icon orange"><Clock size={24} /></div>
          <div className="stat-info">
            <span className="stat-value">{stats.pendingFollowups}</span>
            <span className="stat-label">Pending Follow-ups</span>
            <span className="stat-trend up">This week</span>
          </div>
        </Link>

        <Link to="/reminders" className="stat-card">
          <div className="stat-icon purple"><MessageCircle size={24} /></div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalReminders}</span>
            <span className="stat-label">Reminders Sent</span>
            <span className="stat-trend up">Via WhatsApp</span>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/patients/new" className="quick-action-card">
          <div className="quick-action-icon" style={{ background: 'var(--green-100)', color: 'var(--green-700)' }}>
            <UserPlus size={22} />
          </div>
          <div className="quick-action-info">
            <h4>Add New Patient</h4>
            <p>Register a new patient record</p>
          </div>
        </Link>

        <Link to="/patients" className="quick-action-card">
          <div className="quick-action-icon" style={{ background: 'var(--blue-100)', color: 'var(--blue-500)' }}>
            <Users size={22} />
          </div>
          <div className="quick-action-info">
            <h4>View All Patients</h4>
            <p>Search and manage patients</p>
          </div>
        </Link>

        <Link to="/reminders" className="quick-action-card">
          <div className="quick-action-icon" style={{ background: 'var(--purple-100)', color: 'var(--purple-500)' }}>
            <Send size={22} />
          </div>
          <div className="quick-action-info">
            <h4>Send Reminder</h4>
            <p>WhatsApp visit reminders</p>
          </div>
        </Link>
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Recent Patients — full row clickable */}
        <div className="card">
          <div className="section-header">
            <h3 className="section-title">Recent Patients</h3>
            <Link to="/patients" className="see-all">See all →</Link>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Condition</th>
                  <th>Last Visit</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentPatients.map((patient, idx) => (
                  <tr
                    key={patient.id}
                    className="clickable"
                    onClick={() => navigate(`/patients/${patient.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <div className="patient-cell">
                        <div className="patient-avatar" style={{ background: getAvatarColor(idx) }}>
                          {getInitials(patient.name)}
                        </div>
                        <div>
                          <div className="patient-name">{patient.name}</div>
                          <div className="patient-id">{patient.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>{patient.condition}</td>
                    <td>{new Date(patient.lastVisit).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                    <td>
                      <span className={`badge-status ${patient.status}`}>
                        <span className="badge-dot"></span>
                        {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Today's Schedule — each item links to appointments */}
        <div className="card">
          <div className="section-header">
            <h3 className="section-title">Today's Schedule</h3>
            <Link to="/appointments" className="see-all">{todayAppointments.length} appointments →</Link>
          </div>
          {todayAppointments.map((apt) => (
            <div
              key={apt.id}
              className="appointment-card"
              onClick={() => navigate('/appointments')}
              style={{ cursor: 'pointer' }}
            >
              <div className="appointment-time">
                <div className="time">{apt.time}</div>
              </div>
              <div className="appointment-divider" />
              <div className="appointment-info">
                <div className="name">{apt.patientName}</div>
                <div className="type">{apt.treatment}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
