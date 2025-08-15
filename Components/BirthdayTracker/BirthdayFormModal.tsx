import React, { useState, useEffect } from 'react';
import { Birthday } from '../../types';

interface BirthdayFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (birthdayData: Omit<Birthday, 'id' | 'createdAt'>, isEditing: boolean) => void;
  birthday: Birthday | null;
}

const BirthdayFormModal: React.FC<BirthdayFormModalProps> = ({ isOpen, onClose, onSave, birthday }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  const isEditing = birthday !== null;

  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        setName(birthday.name);
        setDate(birthday.date);
        setNotes(birthday.notes || '');
      } else {
        setName('');
        setDate('');
        setNotes('');
      }
    }
  }, [birthday, isEditing, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !date) {
      alert('Name and Date are required.');
      return;
    }
    onSave({ name, date, notes }, isEditing);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-[100]" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-bold">{isEditing ? 'Edit Birthday' : 'Add Birthday'}</h2>
          
          <div>
            <label htmlFor="name" className="label">Name</label>
            <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} required className="input-field mt-1" />
          </div>
          
          <div>
            <label htmlFor="date" className="label">Birth Date</label>
            <input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} required className="input-field mt-1" max={new Date().toISOString().split("T")[0]} />
          </div>
          
          <div>
            <label htmlFor="notes" className="label">Notes / Gift Ideas</label>
            <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="input-field mt-1" />
          </div>

          <div className="flex justify-end gap-4 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md">{isEditing ? 'Save Changes' : 'Add Birthday'}</button>
          </div>
        </form>
        <style>{`.label { display: block; font-size: 0.875rem; font-weight: 500; color: #374151; } .dark .label { color: #D1D5DB; } .input-field { background-color: white; border: 1px solid #D1D5DB; border-radius: 0.375rem; padding: 0.5rem 0.75rem; width: 100%;} .dark .input-field { background-color: #374151; border-color: #4B5563; color: #F9FAFB; }`}</style>
      </div>
    </div>
  );
};

export default BirthdayFormModal;
