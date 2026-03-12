import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Toast from './Toast';
import { useApp } from '../context/AppContext';

const pageTitles = {
  '/': 'Dashboard',
  '/patients': 'Patients',
  '/patients/new': 'Add Patient',
  '/reminders': 'Reminders',
  '/settings': 'Settings',
};

export default function Layout({ children }) {
  const { toasts } = useApp();
  const location = useLocation();

  const getTitle = () => {
    if (location.pathname.startsWith('/patients/') && location.pathname !== '/patients/new') {
      return 'Patient Details';
    }
    if (location.pathname.includes('/edit')) {
      return 'Edit Patient';
    }
    return pageTitles[location.pathname] || 'MedRemind';
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <main className="main-content">
          {children}
        </main>
      </div>

      {/* Toasts */}
      {toasts.length > 0 && (
        <div className="toast-container">
          {toasts.map(toast => (
            <Toast key={toast.id} toast={toast} />
          ))}
        </div>
      )}
    </div>
  );
}
