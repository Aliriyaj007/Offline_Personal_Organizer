
import React, { useState } from 'react';

interface TodoFormProps {
  onAddTask: (text: string) => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ onAddTask }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      alert('Task cannot be empty.');
      return;
    }
    onAddTask(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-x-3">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new task..."
        className="flex-grow px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-100"
      />
      <button
        type="submit"
        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-all duration-150 ease-in-out transform hover:scale-105"
      >
        Add Task
      </button>
    </form>
  );
};

export default TodoForm;