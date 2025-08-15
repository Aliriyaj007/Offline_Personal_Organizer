import React, { useState, useEffect } from 'react';
import { Homework, HomeworkPriority, HomeworkStatus } from '../../types';

interface HomeworkFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (homework: Homework) => void;
  homework: Homework | null;
}

const HomeworkFormModal: React.FC<HomeworkFormModalProps> = ({ isOpen, onClose, onSave, homework }) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [priority, setPriority] = useState<HomeworkPriority>('medium');
  const [status, setStatus] = useState<HomeworkStatus>(HomeworkStatus.ToDo);
  const [notes, setNotes] = useState('');

  const isEditing = homework !== null;

  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        setTitle(homework.title);
        setSubject(homework.subject);
        setDueDate(homework.dueDate);
        setPriority(homework.priority);
        setStatus(homework.status);
        setNotes(homework.notes);
      } else {
        setTitle(''); setSubject(''); setDueDate(new Date().toISOString().split('T')[0]);
        setPriority('medium'); setStatus(HomeworkStatus.ToDo); setNotes('');
      }
    }
  }, [homework, isEditing, isOpen]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert('Title is required.');
    
    onSave({
      id: isEditing ? homework.id : Date.now().toString(),
      title, subject, dueDate, priority, status, notes,
      createdAt: isEditing ? homework.createdAt : Date.now(),
    });
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-[100]" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-bold">{isEditing ? 'Edit Assignment' : 'Add Assignment'}</h2>
          
          <InputField label="Title" value={title} onChange={e => setTitle(e.target.value)} required />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Subject / Course" value={subject} onChange={e => setSubject(e.target.value)} />
            <InputField label="Due Date" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required />
          </div>
          <div>
            <label className="label">Priority</label>
            <div className="flex gap-2 mt-1">
                {(['low', 'medium', 'high'] as HomeworkPriority[]).map(p => (
                    <button type="button" key={p} onClick={() => setPriority(p)} className={`flex-1 p-2 rounded-md capitalize border ${priority === p ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-slate-700 border-gray-300 dark:border-gray-600'}`}>
                        {p}
                    </button>
                ))}
            </div>
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} className="input-field mt-1" />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md">{isEditing ? 'Save Changes' : 'Add Assignment'}</button>
          </div>
        </form>
        <style>{`.label { display: block; font-size: 0.875rem; font-weight: 500; color: #374151; } .dark .label { color: #D1D5DB; } .input-field { background-color: white; border: 1px solid #D1D5DB; border-radius: 0.375rem; padding: 0.5rem 0.75rem; width: 100%;} .dark .input-field { background-color: #374151; border-color: #4B5563; color: #F9FAFB; }`}</style>
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

export default HomeworkFormModal;
