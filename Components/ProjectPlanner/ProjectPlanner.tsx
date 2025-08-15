import React, { useState } from 'react';
import { Project, ProjectTask } from '../../types';
import ProjectIcon from '../icons/ProjectIcon';
import PlusIcon from '../icons/PlusIcon';
import ProjectFormModal from './ProjectFormModal';
import ProjectItem from './ProjectItem';
import ProjectDetail from './ProjectDetail';

interface ProjectPlannerProps {
  projects: Project[];
  setProjects: (value: Project[] | ((val: Project[]) => Project[])) => void;
  onDeleteProject: (project: Project) => void;
}

const ProjectPlanner: React.FC<ProjectPlannerProps> = ({ projects, setProjects, onDeleteProject }) => {
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSave = (projectData: Project) => {
    setProjects(prev => {
      const exists = prev.some(p => p.id === projectData.id);
      if (exists) {
          const updatedProjects = prev.map(p => (p.id === projectData.id ? projectData : p));
          if (selectedProject?.id === projectData.id) {
              setSelectedProject(projectData);
          }
          return updatedProjects;
      }
      return [projectData, ...prev];
    });
    setIsFormOpen(false);
  };
  
  const handleSelectProject = (project: Project) => {
      setSelectedProject(project);
      setView('detail');
  }

  const handleDelete = (project: Project) => {
      onDeleteProject(project);
      setView('list');
      setSelectedProject(null);
  }

  const openAddModal = () => {
    setSelectedProject(null);
    setIsFormOpen(true);
  };
  
  if (view === 'detail' && selectedProject) {
      return <ProjectDetail project={selectedProject} onSave={handleSave} onDelete={() => handleDelete(selectedProject)} onBack={() => setView('list')} />
  }

  return (
    <>
      <div className="space-y-6">
        <header className="flex items-center gap-4 pb-3 border-b-2 border-indigo-500 dark:border-indigo-400">
          <ProjectIcon className="w-10 h-10 text-indigo-500 dark:text-indigo-400" />
          <h2 className="text-3xl font-bold flex-grow">Project Planner</h2>
          <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700">
            <PlusIcon className="w-5 h-5"/> <span className="hidden sm:inline">New Project</span>
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
                <ProjectItem key={project.id} project={project} onSelect={() => handleSelectProject(project)} />
            ))}
        </div>
        {projects.length === 0 && (
            <div className="text-center py-16">
                <p className="text-lg text-gray-500">No projects yet. Start a new project to begin!</p>
            </div>
        )}
      </div>
      {isFormOpen && <ProjectFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSave={handleSave} project={selectedProject} />}
    </>
  );
};

export default ProjectPlanner;
