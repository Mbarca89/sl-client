import type React from 'react';
import { useNavigate } from 'react-router-dom';

interface NotificationProps {
  message: string;
  time: string
}

const Notification: React.FC<NotificationProps> = ({ message, time }) => {

  const navigate = useNavigate()

  return (
    <div role='button' onClick={()=>navigate(`/ticket/${message.split("/")[1]}`)}>
      <span>{message.split("/")[0]}. Hora: {time}</span>
    </div>
  );
};

export default Notification;

