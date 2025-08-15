import React from 'react';
import { ProjectTask } from '../../types';
import TrashIcon from '../icons/TrashIcon';

interface TaskItemProps {
  task: ProjectTask;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onTextChange: (id: string, text: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onTextChange }) => {
  return (
    <li className="group flex items-center gap-3">
        <input type="checkbox" checked={task.completed} onChange={() => onToggle(task.id)} className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500" />
        <input type="text" value={task.text} onChange={e => onTextChange(task.id, e.target.value)}
            className={`flex-grow bg-transparent border-b-2 p-1 focus:outline-none ${task.completed ? 'line-through text-gray-500 border-transparent' : 'border-b-gray-200 dark:border-b-gray-700 focus:border-b-indigo-500'}`}
        />
        <button onClick={() => onDelete(task.id)} className="p-1 opacity-0 group-hover:opacity-100"><TrashIcon className="w-5 h-5 text-red-500" /></button>
    </li>
  );
};

export default TaskItem;
