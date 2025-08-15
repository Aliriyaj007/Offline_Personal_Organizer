import React, { useState, useEffect } from 'react';
import { Book } from '../../types';

interface UpdateProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bookId: string, currentPage: number) => void;
  book: Book | null;
}

const UpdateProgressModal: React.FC<UpdateProgressModalProps> = ({ isOpen, onClose, onSave, book }) => {
  const [currentPage, setCurrentPage] = useState<string>('');

  useEffect(() => {
    if (book) {
      setCurrentPage(book.currentPage.toString());
    }
  }, [book]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!book) return;
    const page = parseInt(currentPage, 10);
    if (isNaN(page) || page < 0) return alert('Please enter a valid page number.');
    if (book.pageCount && page > book.pageCount) return alert(`Page number cannot exceed total pages (${book.pageCount}).`);
    
    onSave(book.id, page);
  };
  
  if (!isOpen || !book) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-[100]" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold mb-2">Update Progress</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 truncate">{book.title}</p>

          <div className="space-y-4">
             <div>
                <label htmlFor="currentPage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Current Page {book.pageCount && `(out of ${book.pageCount})`}
                </label>
                <input
                    id="currentPage" type="number" value={currentPage}
                    onChange={e => setCurrentPage(e.target.value)}
                    className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600"
                    autoFocus
                />
             </div>
          </div>
          
          <div className="mt-6 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProgressModal;
