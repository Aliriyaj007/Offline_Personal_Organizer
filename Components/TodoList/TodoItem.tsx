

import React from 'react';
import { TodoTask } from '../../types';
import TrashIcon from '../icons/TrashIcon';

interface TodoItemProps {
  task: TodoTask;
  onToggle: (id: string) => void;
  onDelete: (task: TodoTask) => void;
}

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const TodoItem: React.FC<TodoItemProps> = ({ task, onToggle, onDelete }) => {
  return (
    <li className="py-4 flex items-center justify-between group hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded transition-colors duration-150">
      <div className="flex items-center flex-grow min-w-0 px-2">
        <button
          onClick={() => onToggle(task.id)}
          className={`w-6 h-6 rounded-md border-2 flex items-center justify-center mr-3 flex-shrink-0
            ${task.completed 
              ? 'bg-green-500 border-green-500 dark:bg-green-600 dark:border-green-600 hover:bg-green-600 dark:hover:bg-green-700' 
              : 'border-gray-300 dark:border-gray-500 hover:border-green-400 dark:hover:border-green-500'}
            transition-all duration-150 ease-in-out`}
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {task.completed && <CheckIcon className="w-4 h-4 text-white" />}
        </button>
        <span
          className={`text-md text-gray-800 dark:text-gray-100 truncate ${task.completed ? 'line-through text-gray-500 dark:text-gray-400 opacity-70' : ''}`}
        >
          {task.text}
        </span>
      </div>
      <button
        onClick={() => onDelete(task)}
        className="ml-4 mr-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label="Delete task"
      >
        <TrashIcon />
      </button>
    </li>
  );
};

export default TodoItem;