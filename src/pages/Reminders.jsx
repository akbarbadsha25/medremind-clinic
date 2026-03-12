import { useState } from 'react';
import { MessageCircle, Search, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ReminderModal from '../components/ReminderModal';

export default function Reminders() {
  const { reminders, patients } = useApp();
  const [reminderPatient, setReminderPatient] = useState(null);
  const [search, setSearch] = useState('');

  const filteredReminders = reminders.filter(r =>
    r.patientName.toLowerCase().includes(search.toLowerCase()) ||
    r.phone.includes(search)
  );

  function formatTime(isoString) {
    const d = new Date(isoString);
    return d.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-header-title">Reminders</h1>
          <p className="page-header-subtitle">WhatsApp visit reminders sent to patients</p>
        </div>
        <div className="page-header-actions">
          <button
            className="btn btn-whatsapp"
            onClick={() => {
              if (patients.length > 0) setReminderPatient(patients[0]);
            }}
          >
            <MessageCircle size={18} />
            New Reminder
          </button>
        </div>
      </div>

      {/* Search */}
      {reminders.length > 0 && (
        <div className="toolbar">
          <div className="toolbar-left">
            <div className="toolbar-search">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search reminders..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Reminders List */}
      {filteredReminders.length > 0 ? (
        <div className="card">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Phone</th>
                  <th>Message Preview</th>
                  <th>Sent At</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredReminders.map(reminder => (
                  <tr key={reminder.id}>
                    <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{reminder.patientName}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 13 }}>+91 {reminder.phone.slice(2)}</td>
                    <td style={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {reminder.message.slice(0, 60)}...
                    </td>
                    <td>{formatTime(reminder.sentAt)}</td>
                    <td>
                      <span className={`badge-status ${reminder.status}`}>
                        <span className="badge-dot"></span>
                        {reminder.status.charAt(0).toUpperCase() + reminder.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => {
                          const encodedMessage = encodeURIComponent(reminder.message);
                          window.open(`https://wa.me/${reminder.phone}?text=${encodedMessage}`, '_blank');
                        }}
                      >
                        <ExternalLink size={14} />
                        Resend
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="empty-state">
            <MessageCircle size={48} />
            <h3>No reminders sent yet</h3>
            <p>Send your first WhatsApp reminder to a patient. Go to a patient's profile and click "Send Reminder".</p>
          </div>
        </div>
      )}

      {/* Select Patient for New Reminder */}
      {!reminderPatient && patients.length > 0 && (
        <div className="card" style={{ marginTop: '24px' }}>
          <h3 className="card-title" style={{ marginBottom: '16px' }}>Quick Send — Select a Patient</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
            {patients.slice(0, 8).map(patient => (
              <div
                key={patient.id}
                className="quick-action-card"
                onClick={() => setReminderPatient(patient)}
                style={{ padding: '16px' }}
              >
                <div
                  style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'linear-gradient(145deg, var(--green-700), var(--green-900))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 600, fontSize: 13, flexShrink: 0, letterSpacing: '0.5px'
                  }}
                >
                  {patient.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{patient.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    Next: {patient.nextVisit
                      ? new Date(patient.nextVisit).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                      : 'N/A'
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reminder Modal */}
      {reminderPatient && (
        <ReminderModal
          patient={reminderPatient}
          onClose={() => setReminderPatient(null)}
        />
      )}
    </div>
  );
}
