import type React from 'react';

interface NotificationProps {
  message: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: '#333', color: '#fff', borderRadius: '5px' }}>
      <span>{message}</span>
      <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
        &#10005; {/* Icono de cierre (X) */}
      </button>
    </div>
  );
};

export default Notification;

