import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Bell, Settings, Activity, MessageCircle, CalendarDays, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { currentUser, logout, isDoctor } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/patients', icon: Users, label: 'Patients' },
    { path: '/appointments', icon: CalendarDays, label: 'Appointments' },
    { path: '/reminders', icon: MessageCircle, label: 'Reminders' },
    ...(isDoctor ? [{ path: '/settings', icon: Settings, label: 'Settings' }] : []),
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Activity size={22} />
        </div>
        <div className="sidebar-brand">
          <h1>MedRemind</h1>
          <span>Aesthetics</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Main Menu</div>
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-link ${isActive && (item.path === '/' ? location.pathname === '/' : true) ? 'active' : ''}`
            }
            end={item.path === '/'}
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {currentUser?.initials}
          </div>
          <div className="sidebar-user-info">
            <span className="name">{currentUser?.name}</span>
            <span className="role-badge">{currentUser?.role === 'doctor' ? 'Doctor' : 'Receptionist'}</span>
          </div>
          <button className="sidebar-logout-btn" onClick={logout} title="Sign out">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
