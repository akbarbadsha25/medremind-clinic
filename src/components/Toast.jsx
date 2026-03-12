import { CheckCircle, AlertCircle } from 'lucide-react';

export default function Toast({ toast }) {
  return (
    <div className={`toast ${toast.type}`}>
      {toast.type === 'success' ? (
        <CheckCircle className="toast-icon" />
      ) : (
        <AlertCircle className="toast-icon" />
      )}
      <span className="toast-message">{toast.message}</span>
    </div>
  );
}
