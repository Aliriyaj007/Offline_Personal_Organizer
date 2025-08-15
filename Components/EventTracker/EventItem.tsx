import React from 'react';
import { Event } from '../../types';
import PencilIcon from '../icons/PencilIcon';
import TrashIcon from '../icons/TrashIcon';

interface EventItemProps {
  event: Event;
  onEdit: () => void;
  onDelete: () => void;
}

const EventItem: React.FC<EventItemProps> = ({ event, onEdit, onDelete }) => {
  const formatTime = (time: string) => {
    if (!time) return 'All Day';
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };
  
  return (
    <div className="group flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-slate-700/50 border-l-4" style={{ borderColor: event.color }}>
      <div className="w-20 text-center flex-shrink-0">
        <p className="font-bold text-gray-800 dark:text-white">{formatTime(event.time || '')}</p>
      </div>
      <div className="flex-grow">
        <h4 className="font-semibold text-gray-800 dark:text-white">{event.title}</h4>
        {event.location && <p className="text-sm text-gray-500 dark:text-gray-400">{event.location}</p>}
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} title="Edit" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-600"><PencilIcon className="w-5 h-5"/></button>
        <button onClick={onDelete} title="Delete" className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50"><TrashIcon className="w-5 h-5 text-red-500"/></button>
      </div>
    </div>
  );
};

export default EventItem;
