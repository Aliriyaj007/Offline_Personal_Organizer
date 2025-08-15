import React from 'react';
import { TodoTask } from '../../types';
import TodoForm from './TodoForm';
import TodoItem from './TodoItem';
import TodoIcon from '../icons/TodoIcon';

interface TodoListProps {
  tasks: TodoTask[];
  setTasks: (value: TodoTask[] | ((val: TodoTask[]) => TodoTask[])) => void;
  onDeleteTask: (task: TodoTask) => void;
}

const TodoList: React.FC<TodoListProps> = ({ tasks, setTasks, onDeleteTask }) => {

  const addTask = (text: string) => {
    const newTask: TodoTask = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      text,
      completed: false,
      createdAt: Date.now(),
    };
    setTasks(prev => [newTask, ...prev.sort((a,b) => Number(a.completed) - Number(b.completed) || b.createdAt - a.createdAt)]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      ).sort((a,b) => Number(a.completed) - Number(b.completed) || b.createdAt - a.createdAt)
    );
  };

  const sortedTasks = [...tasks].sort((a,b) => Number(a.completed) - Number(b.completed) || b.createdAt - a.createdAt);


  return (
    <div className="max-w-3xl mx-auto">
       <header className="flex items-center gap-4 mb-6 pb-3 border-b-2 border-indigo-500 dark:border-indigo-400">
          <TodoIcon className="w-10 h-10 text-indigo-500 dark:text-indigo-400" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            Daily To-Do List
          </h2>
        </header>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl space-y-6 transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-[1.01]">
        <TodoForm onAddTask={addTask} />
        {sortedTasks.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">No tasks yet. Add some to get started!</p>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedTasks.map(task => (
              <TodoItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={onDeleteTask}
              />
            ))}
          </ul>
        )}
         <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Total tasks: {tasks.length} | Completed: {tasks.filter(t => t.completed).length}
        </div>
      </div>
    </div>
  );
};

export default TodoList;