import React, { useState, useEffect } from 'react';
import { Book, BookStatus } from '../../types';
import StarIcon from '../icons/StarIcon';

interface BookFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (book: Book) => void;
  book: Book | null;
}

const BookFormModal: React.FC<BookFormModalProps> = ({ isOpen, onClose, onSave, book }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [status, setStatus] = useState<BookStatus>(BookStatus.ToRead);
  const [coverImage, setCoverImage] = useState<string | undefined>(undefined);
  const [pageCount, setPageCount] = useState<string>('');
  const [rating, setRating] = useState<number | null>(null);
  const [review, setReview] = useState('');

  const isEditing = book !== null;

  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        setTitle(book.title);
        setAuthor(book.author);
        setGenre(book.genre);
        setStatus(book.status);
        setCoverImage(book.coverImage);
        setPageCount(book.pageCount?.toString() || '');
        setRating(book.rating);
        setReview(book.review);
      } else {
        setTitle(''); setAuthor(''); setGenre(''); setStatus(BookStatus.ToRead);
        setCoverImage(undefined); setPageCount(''); setRating(null); setReview('');
      }
    }
  }, [book, isEditing, isOpen]);

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCoverImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return alert('Title and Author are required.');

    const bookData: Book = {
      id: isEditing ? book.id : Date.now().toString(),
      title, author, genre, status, coverImage,
      pageCount: pageCount ? parseInt(pageCount, 10) : null,
      currentPage: isEditing ? (status === BookStatus.Finished && pageCount ? parseInt(pageCount) : book.currentPage) : 0,
      rating, review,
      createdAt: isEditing ? book.createdAt : Date.now(),
    };
    onSave(bookData);
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-[100]" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
          <h2 className="text-2xl font-bold mb-6 flex-shrink-0">{isEditing ? 'Edit Book' : 'Add New Book'}</h2>
          
          <div className="flex-grow overflow-y-auto space-y-4 pr-2 -mr-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Title" value={title} onChange={e => setTitle(e.target.value)} required />
              <InputField label="Author" value={author} onChange={e => setAuthor(e.target.value)} required />
            </div>
            <InputField label="Genre" value={genre} onChange={e => setGenre(e.target.value)} />
            <InputField label="Page Count" type="number" value={pageCount} onChange={e => setPageCount(e.target.value)} />
            <div>
              <label className="label">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value as BookStatus)} className="input-field w-full mt-1">
                {Object.values(BookStatus).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            
            {status === BookStatus.Finished && (
                <div>
                    <label className="label">Rating</label>
                    <StarRating rating={rating} setRating={setRating} />
                </div>
            )}
            <div>
                <label className="label">Review / Notes</label>
                <textarea value={review} onChange={e => setReview(e.target.value)} rows={4} className="input-field w-full mt-1" />
            </div>
            
            <div>
              <label className="label">Cover Image</label>
              <input type="file" accept="image/*" onChange={handleCoverImageChange} className="input-field w-full mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
            </div>
          </div>

          <div className="flex-shrink-0 mt-6 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md">Save</button>
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

const StarRating: React.FC<{ rating: number | null, setRating: (r: number | null) => void }> = ({ rating, setRating }) => {
    const [hover, setHover] = useState<number|null>(null);
    return (
        <div className="flex items-center space-x-1 mt-1">
            {[...Array(5)].map((_, i) => {
                const value = i + 1;
                return (
                    <button type="button" key={value} onClick={() => setRating(value === rating ? null : value)} onMouseEnter={() => setHover(value)} onMouseLeave={() => setHover(null)} >
                        <StarIcon className={`w-7 h-7 transition-colors ${value <= (hover || rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    </button>
                );
            })}
        </div>
    );
};

export default BookFormModal;