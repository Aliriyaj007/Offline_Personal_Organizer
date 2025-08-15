import React, { useState, useEffect } from 'react';
import { Event } from '../../types';
import { EVENT_COLORS, DEFAULT_EVENT_CATEGORIES } from '../../constants';

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: Omit<Event, 'id' | 'createdAt'>, isEditing: boolean) => void;
  event: Event | null;
  existingCategories: string[];
}

const EventFormModal: React.FC<EventFormModalProps> = ({ isOpen, onClose, onSave, event, existingCategories }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(DEFAULT_EVENT_CATEGORIES[0]);
  const [color, setColor] = useState(EVENT_COLORS[0]);

  const isEditing = event !== null;

  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        setTitle(event.title);
        setDate(event.date);
        setTime(event.time || '');
        setLocation(event.location || '');
        setDescription(event.description || '');
        setCategory(event.category);
        setColor(event.color);
      } else {
        setTitle('');
        setDate(new Date().toISOString().split('T')[0]);
        setTime('');
        setLocation('');
        setDescription('');
        setCategory(DEFAULT_EVENT_CATEGORIES[0]);
        setColor(EVENT_COLORS[0]);
      }
    }
  }, [event, isEditing, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return alert('Title and Date are required.');

    onSave({
      title, date, time, location, description, category, color
    }, isEditing);
  };

  const allCategories = [...new Set([...DEFAULT_EVENT_CATEGORIES, ...existingCategories])];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-[100]" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
          <h2 className="text-2xl font-bold mb-6 flex-shrink-0">{isEditing ? 'Edit Event' : 'Add New Event'}</h2>
          
          <div className="flex-grow overflow-y-auto space-y-4 pr-2 -mr-2">
            <InputField label="Event Title" value={title} onChange={e => setTitle(e.target.value)} required />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
              <InputField label="Time (Optional)" type="time" value={time} onChange={e => setTime(e.target.value)} />
            </div>
            <InputField label="Location (Optional)" value={location} onChange={e => setLocation(e.target.value)} />
            <div>
              <label className="label">Category</label>
              <input list="categories" name="category" value={category} onChange={e => setCategory(e.target.value)} className="input-field mt-1" />
              <datalist id="categories">
                {allCategories.map(cat => <option key={cat} value={cat} />)}
              </datalist>
            </div>
            <div>
              <label className="label">Description (Optional)</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="input-field mt-1" />
            </div>
             <div>
                <label className="label">Color</label>
                <div className="flex flex-wrap gap-2 mt-2">
                    {EVENT_COLORS.map(c => (
                        <button type="button" key={c} onClick={() => setColor(c)} style={{backgroundColor: c}} className={`w-8 h-8 rounded-full transition-transform transform hover:scale-110 ${color === c ? 'ring-2 ring-offset-2 ring-indigo-500' : ''}`} />
                    ))}
                </div>
            </div>
          </div>

          <div className="flex-shrink-0 mt-6 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md">{isEditing ? 'Save Changes' : 'Add Event'}</button>
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

export default EventFormModal;
