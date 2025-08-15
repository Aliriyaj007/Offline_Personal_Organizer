import React from 'react';
import { Project } from '../../types';

interface ProjectItemProps {
  project: Project;
  onSelect: () => void;
}

const calculateProgress = (tasks: Project['tasks']): number => {
  if (tasks.length === 0) return 0;
  
  let completedCount = 0;
  const flattenTasks = (tasks: Project['tasks']) => {
      tasks.forEach(task => {
          if (task.completed) completedCount++;
          if (task.subTasks.length > 0) flattenTasks(task.subTasks);
      });
  }
  flattenTasks(tasks);
  
  const getTotalTasks = (tasks: Project['tasks']): number => {
    return tasks.reduce((acc, task) => acc + 1 + getTotalTasks(task.subTasks), 0);
  }
  
  const totalTasks = getTotalTasks(tasks);
  if (totalTasks === 0) return 0;
  
  return (completedCount / totalTasks) * 100;
};

const ProjectItem: React.FC<ProjectItemProps> = ({ project, onSelect }) => {
  const progress = calculateProgress(project.tasks);

  return (
    <div onClick={onSelect} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-5 flex flex-col cursor-pointer transition-transform transform hover:-translate-y-1">
      <div className="flex-grow">
        <h3 className="font-bold text-lg text-gray-800 dark:text-white">{project.title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{project.description}</p>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between items-center text-sm mb-1">
          <span className="font-medium text-gray-600 dark:text-gray-300">Progress</span>
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5">
          <div className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
        {project.deadline && (
            <p className="text-xs text-right text-gray-400 dark:text-gray-500 mt-2">
                Deadline: {new Date(project.deadline).toLocaleDateString()}
            </p>
        )}
      </div>
    </div>
  );
};

export default ProjectItem;
