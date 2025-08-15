import React from 'react';
import { Appointment, Client, AppointmentStatus } from '../../types';
import PencilIcon from '../icons/PencilIcon';
import TrashIcon from '../icons/TrashIcon';

interface AppointmentItemProps {
  appointment: Appointment;
  clients: Client[];
  onEdit: () => void;
  onDelete: () => void;
}

const getStatusStyles = (status: AppointmentStatus) => {
    switch(status) {
        case 'Scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
        case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
        case 'Canceled': return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100 line-through';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-100';
    }
}

const AppointmentItem: React.FC<AppointmentItemProps> = ({ appointment, clients, onEdit, onDelete }) => {
  const client = clients.find(c => c.id === appointment.clientId);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };
  
  return (
    <div className="group flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-slate-700/50">
      <div className="w-24 text-center flex-shrink-0">
        <p className="font-bold text-gray-800 dark:text-white">{formatTime(appointment.time)}</p>
      </div>
      <div className="flex-grow">
        <h4 className="font-semibold text-gray-800 dark:text-white">{appointment.service}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">{client?.name || 'Unknown Client'}</p>
      </div>
      <div className="flex items-center gap-4">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusStyles(appointment.status)}`}>
            {appointment.status}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={onEdit} title="Edit" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-600"><PencilIcon className="w-5 h-5"/></button>
            <button onClick={onDelete} title="Delete" className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50"><TrashIcon className="w-5 h-5 text-red-500"/></button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentItem;
