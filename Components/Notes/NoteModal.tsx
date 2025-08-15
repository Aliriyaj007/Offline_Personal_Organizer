import React, { useState, useEffect } from 'react';
import { Note } from '../../types';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (noteData: { title: string; content: string }) => void;
  note: Note | null;
}

const NoteModal: React.FC<NoteModalProps> = ({ isOpen, onClose, onSave, note }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [note, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
        alert('Title is required.');
        return;
    }
    onSave({ title, content });
  };
  
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-[100]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="note-modal-title"
    >
      <div
        className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-6">
            <h2 id="note-modal-title" className="text-2xl font-semibold text-gray-800 dark:text-white">
              {note ? 'Edit Note' : 'Add New Note'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="note-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Title
              </label>
              <input
                id="note-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-100"
                required
              />
            </div>
            <div>
              <label htmlFor="note-content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Content
              </label>
              <textarea
                id="note-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-100"
                placeholder="Write your thoughts here..."
              ></textarea>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;
