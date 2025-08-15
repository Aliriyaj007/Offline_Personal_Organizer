import React, { useState, useEffect } from 'react';
import { Project } from '../../types';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  project: Project | null;
}

const ProjectFormModal: React.FC<ProjectFormModalProps> = ({ isOpen, onClose, onSave, project }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');

  const isEditing = project !== null;

  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        setTitle(project.title);
        setDescription(project.description);
        setDeadline(project.deadline ? project.deadline.split('T')[0] : '');
      } else {
        setTitle(''); setDescription(''); setDeadline('');
      }
    }
  }, [project, isEditing, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert('Project title is required.');
    
    onSave({
      id: isEditing ? project.id : Date.now().toString(),
      title, description,
      deadline: deadline || null,
      tasks: isEditing ? project.tasks : [],
      createdAt: isEditing ? project.createdAt : Date.now(),
    });
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-[100]" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-bold">{isEditing ? 'Edit Project' : 'New Project'}</h2>
          
          <InputField label="Project Title" value={title} onChange={e => setTitle(e.target.value)} required />
          <div>
            <label className="label">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="input-field mt-1" />
          </div>
          <InputField label="Deadline (Optional)" type="date" value={deadline} onChange={e => setDeadline(e.target.value)} />

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md">{isEditing ? 'Save Changes' : 'Create Project'}</button>
          </div>
        </form>
         <style>{`.label { font-size: 0.875rem; font-weight: 500; color: #374151; } .dark .label { color: #D1D5DB; } .input-field { background-color: white; border: 1px solid #D1D5DB; border-radius: 0.375rem; padding: 0.5rem 0.75rem; width: 100%;} .dark .input-field { background-color: #374151; border-color: #4B5563; color: #F9FAFB; }`}</style>
      </div>
    </div>
  );
};

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
  <div>
    <label className="label">{label}</label>
    <input {...props} className="input-field mt-1" />
  </div>
);

export default ProjectFormModal;
