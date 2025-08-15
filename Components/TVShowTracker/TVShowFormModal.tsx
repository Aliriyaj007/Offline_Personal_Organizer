import React, { useState, useEffect } from 'react';
import { TVShow, TVShowWatchStatus } from '../../types';
import { TV_SHOW_WATCH_STATUSES } from '../../constants';

interface TVShowFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (show: TVShow) => void;
  show: TVShow | null;
}

const TVShowFormModal: React.FC<TVShowFormModalProps> = ({ isOpen, onClose, onSave, show }) => {
  const [title, setTitle] = useState('');
  const [startYear, setStartYear] = useState<string>('');
  const [genre, setGenre] = useState('');
  const [status, setStatus] = useState<TVShowWatchStatus>(TVShowWatchStatus.PlanToWatch);
  const [totalSeasons, setTotalSeasons] = useState<string>('');

  const isEditing = show !== null;

  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        setTitle(show.title);
        setStartYear(show.startYear?.toString() || '');
        setGenre(show.genre);
        setStatus(show.status);
        setTotalSeasons(show.totalSeasons?.toString() || '');
      } else {
        // Reset for new entry
        setTitle('');
        setStartYear('');
        setGenre('');
        setStatus(TVShowWatchStatus.PlanToWatch);
        setTotalSeasons('');
      }
    }
  }, [show, isEditing, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Title is required.');
      return;
    }
    const showData: TVShow = {
      id: isEditing ? show.id : Date.now().toString(),
      title,
      startYear: startYear ? parseInt(startYear, 10) : null,
      genre,
      status,
      totalSeasons: totalSeasons ? parseInt(totalSeasons, 10) : null,
      // Preserve these fields when editing, set defaults when creating
      rating: isEditing ? show.rating : null,
      notes: isEditing ? show.notes : '',
      progress: isEditing ? show.progress : { season: 1, episode: 0 },
      createdAt: isEditing ? show.createdAt : Date.now(),
    };
    onSave(showData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-[100]" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{isEditing ? 'Edit TV Show' : 'Add TV Show'}</h2>
          
          <div className="space-y-4">
            <InputField label="Title" value={title} onChange={e => setTitle(e.target.value)} required />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Start Year" type="number" value={startYear} onChange={e => setStartYear(e.target.value)} />
              <InputField label="Total Seasons" type="number" value={totalSeasons} onChange={e => setTotalSeasons(e.target.value)} />
            </div>
            <InputField label="Genre" value={genre} onChange={e => setGenre(e.target.value)} placeholder="e.g., Sci-Fi, Drama, Comedy" />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value as TVShowWatchStatus)} className="input-field mt-1 w-full">
                {TV_SHOW_WATCH_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save</button>
          </div>
        </form>
         <style>{`
            .input-field {
              background-color: white; border: 1px solid #D1D5DB; border-radius: 0.375rem; 
              padding: 0.5rem 0.75rem; font-size: 0.875rem; color: #111827; box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
            }
            .dark .input-field {
              background-color: #374151; border-color: #4B5563; color: #F9FAFB;
            }
            .input-field:focus {
              outline: none; --tw-ring-color: #6366F1; box-shadow: 0 0 0 2px var(--tw-ring-color); border-color: #6366F1;
            }
          `}</style>
      </div>
    </div>
  );
};

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
  <div>
    <label htmlFor={props.id || props.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <input id={props.id || props.name} {...props} className="input-field mt-1 w-full" />
  </div>
);

export default TVShowFormModal;
