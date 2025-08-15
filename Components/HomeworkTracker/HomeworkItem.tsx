import React from 'react';
import { Homework, HomeworkPriority, HomeworkStatus } from '../../types';
import PencilIcon from '../icons/PencilIcon';
import TrashIcon from '../icons/TrashIcon';

interface HomeworkItemProps {
  homework: Homework;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (id: string, status: HomeworkStatus) => void;
}

const priorityStyles: Record<HomeworkPriority, string> = {
  high: 'border-red-500',
  medium: 'border-yellow-500',
  low: 'border-green-500',
};

const HomeworkItem: React.FC<HomeworkItemProps> = ({ homework, onEdit, onDelete, onStatusChange }) => {
  const isOverdue = new Date(homework.dueDate) < new Date() && homework.status !== HomeworkStatus.Completed;

  return (
    <li className={`group flex items-center p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg border-l-4 ${priorityStyles[homework.priority]}`}>
      <div className="flex-grow">
        <div className="flex items-center justify-between">
            <h4 className={`font-semibold text-gray-800 dark:text-white ${homework.status === HomeworkStatus.Completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
                {homework.title}
            </h4>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{homework.subject}</span>
        </div>
        <div className="flex items-center justify-between mt-1">
            <p className={`text-sm ${isOverdue ? 'text-red-500 font-bold' : 'text-gray-500 dark:text-gray-400'}`}>
                Due: {new Date(homework.dueDate).toLocaleDateString()}
            </p>
            <select
                value={homework.status}
                onChange={e => onStatusChange(homework.id, e.target.value as HomeworkStatus)}
                onClick={e => e.stopPropagation()}
                className="text-xs rounded-md border-gray-300 shadow-sm dark:bg-slate-800 dark:border-gray-600 focus:ring-0 focus:border-indigo-500"
            >
                {Object.values(HomeworkStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
        </div>
      </div>
      <div className="flex items-center ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} title="Edit" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-600"><PencilIcon className="w-5 h-5"/></button>
        <button onClick={onDelete} title="Delete" className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50"><TrashIcon className="w-5 h-5 text-red-500"/></button>
      </div>
    </li>
  );
};

export default HomeworkItem;
