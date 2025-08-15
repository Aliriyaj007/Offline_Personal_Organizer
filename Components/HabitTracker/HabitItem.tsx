import React from 'react';
import { Habit } from '../../types';
import PencilIcon from '../icons/PencilIcon';
import TrashIcon from '../icons/TrashIcon';
import AnalyticsIcon from '../icons/AnalyticsIcon';

interface HabitItemProps {
  habit: Habit;
  isCompleted: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onViewStats: () => void;
}

const HabitItem: React.FC<HabitItemProps> = ({ habit, isCompleted, onToggle, onEdit, onDelete, onViewStats }) => {
  return (
    <li
      className="flex items-center p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg group transition-all"
      style={{ borderLeft: `4px solid ${habit.color}` }}
    >
      <button
        onClick={onToggle}
        className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-3xl transition-transform transform hover:scale-110"
        style={{ backgroundColor: isCompleted ? habit.color : '#e5e7eb', color: isCompleted ? 'white' : 'inherit' }}
      >
        {habit.icon}
      </button>

      <div className="flex-grow ml-4">
        <p className="font-semibold text-gray-800 dark:text-white">{habit.name}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{habit.description}</p>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onViewStats} title="View Stats" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-600">
            <AnalyticsIcon className="w-5 h-5 text-gray-600 dark:text-gray-300"/>
        </button>
        <button onClick={onEdit} title="Edit" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-600">
          <PencilIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <button onClick={onDelete} title="Delete" className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50">
          <TrashIcon className="w-5 h-5 text-red-500" />
        </button>
      </div>
    </li>
  );
};

export default HabitItem;