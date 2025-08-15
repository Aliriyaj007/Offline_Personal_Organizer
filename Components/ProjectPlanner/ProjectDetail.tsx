import React, { useState } from 'react';
import { Project, ProjectTask } from '../../types';
import BackIcon from '../icons/BackIcon';
import PencilIcon from '../icons/PencilIcon';
import TrashIcon from '../icons/TrashIcon';
import PlusIcon from '../icons/PlusIcon';
import ProjectFormModal from './ProjectFormModal';
import TaskItem from './TaskItem';

interface ProjectDetailProps {
  project: Project;
  onSave: (project: Project) => void;
  onDelete: () => void;
  onBack: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onSave, onDelete, onBack }) => {
  const [tasks, setTasks] = useState<ProjectTask[]>(project.tasks);
  const [newTaskText, setNewTaskText] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSaveTasks = (updatedTasks: ProjectTask[]) => {
    setTasks(updatedTasks);
    onSave({ ...project, tasks: updatedTasks });
  };
  
  const handleTaskChange = (taskId: string, newText: string) => {
    const update = (items: ProjectTask[]): ProjectTask[] => items.map(t =>
        t.id === taskId ? {...t, text: newText} : {...t, subTasks: update(t.subTasks)}
    );
    handleSaveTasks(update(tasks));
  };

  const handleTaskToggle = (taskId: string) => {
    const toggle = (items: ProjectTask[]): ProjectTask[] => items.map(t =>
      t.id === taskId ? {...t, completed: !t.completed} : {...t, subTasks: toggle(t.subTasks)}
    );
    handleSaveTasks(toggle(tasks));
  };

  const handleTaskDelete = (taskId: string) => {
    const remove = (items: ProjectTask[]): ProjectTask[] => items.filter(t => t.id !== taskId).map(t => ({...t, subTasks: remove(t.subTasks)}));
    handleSaveTasks(remove(tasks));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newTask: ProjectTask = {
      id: Date.now().toString(),
      text: newTaskText,
      completed: false,
      subTasks: []
    };
    handleSaveTasks([...tasks, newTask]);
    setNewTaskText('');
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl">
        <header className="flex items-start justify-between gap-4 mb-6 pb-4 border-b">
          <div className="flex items-start gap-4">
            <button onClick={onBack} className="p-2 mt-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
              <BackIcon className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-3xl font-bold">{project.title}</h2>
              <p className="text-gray-500 mt-1">{project.description}</p>
            </div>
          </div>
          <div className="flex-shrink-0 flex items-center gap-2">
            <button onClick={() => setIsFormOpen(true)} className="p-2 rounded-full hover:bg-gray-200"><PencilIcon/></button>
            <button onClick={onDelete} className="p-2 rounded-full hover:bg-red-100"><TrashIcon className="text-red-500"/></button>
          </div>
        </header>
        
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Tasks</h3>
          <ul className="space-y-2">
            {tasks.map(task => (
              <TaskItem key={task.id} task={task} onToggle={handleTaskToggle} onDelete={handleTaskDelete} onTextChange={handleTaskChange} />
            ))}
          </ul>
          <form onSubmit={handleAddTask} className="flex gap-2">
            <input type="text" value={newTaskText} onChange={e => setNewTaskText(e.target.value)} placeholder="Add a new task"
              className="flex-grow p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600" />
            <button type="submit" className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"><PlusIcon /></button>
          </form>
        </div>
      </div>
      {isFormOpen && <ProjectFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSave={onSave} project={project} />}
    </>
  );
};

export default ProjectDetail;
