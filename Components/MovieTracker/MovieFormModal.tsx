import React, { useState, useEffect } from 'react';
import { Movie, MovieWatchStatus } from '../../types';
import { MOVIE_WATCH_STATUSES } from '../../constants';
import StarIcon from '../icons/StarIcon'; // Re-use for rating

interface MovieFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (movie: Movie) => void;
  movie: Movie | null;
}

const MovieFormModal: React.FC<MovieFormModalProps> = ({ isOpen, onClose, onSave, movie }) => {
  const [title, setTitle] = useState('');
  const [releaseYear, setReleaseYear] = useState<string>('');
  const [director, setDirector] = useState('');
  const [genre, setGenre] = useState('');
  const [status, setStatus] = useState<MovieWatchStatus>(MovieWatchStatus.WantToWatch);
  const [rating, setRating] = useState<number | null>(null);
  const [notes, setNotes] = useState('');

  const isEditing = movie !== null;

  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        setTitle(movie.title);
        setReleaseYear(movie.releaseYear?.toString() || '');
        setDirector(movie.director);
        setGenre(movie.genre);
        setStatus(movie.status);
        setRating(movie.rating);
        setNotes(movie.notes);
      } else {
        // Reset for new entry
        setTitle('');
        setReleaseYear('');
        setDirector('');
        setGenre('');
        setStatus(MovieWatchStatus.WantToWatch);
        setRating(null);
        setNotes('');
      }
    }
  }, [movie, isEditing, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Title is required.');
      return;
    }
    const movieData: Movie = {
      id: isEditing ? movie.id : Date.now().toString(),
      title,
      releaseYear: releaseYear ? parseInt(releaseYear, 10) : null,
      director,
      genre,
      status,
      rating,
      notes,
      watchedDate: status === MovieWatchStatus.Watched && (!isEditing || !movie.watchedDate) ? new Date().toISOString() : (isEditing ? movie.watchedDate : null),
      createdAt: isEditing ? movie.createdAt : Date.now(),
    };
    onSave(movieData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-[100]" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{isEditing ? 'Edit Movie' : 'Add Movie'}</h2>
          
          <div className="flex-grow overflow-y-auto space-y-4 pr-2 -mr-2">
            <InputField label="Title" value={title} onChange={e => setTitle(e.target.value)} required />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Release Year" type="number" value={releaseYear} onChange={e => setReleaseYear(e.target.value)} />
              <InputField label="Director" value={director} onChange={e => setDirector(e.target.value)} />
            </div>
            <InputField label="Genre" value={genre} onChange={e => setGenre(e.target.value)} placeholder="e.g., Sci-Fi, Drama, Comedy" />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value as MovieWatchStatus)} className="input-field mt-1 w-full">
                {MOVIE_WATCH_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rating</label>
              <StarRating rating={rating} setRating={setRating} />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
              <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={4}
                className="input-field mt-1 w-full" placeholder="Your thoughts, favorite quotes, etc."
              />
            </div>
          </div>
          
          <div className="mt-6 flex-shrink-0 flex justify-end gap-4">
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

const StarRating: React.FC<{ rating: number | null, setRating: (r: number | null) => void }> = ({ rating, setRating }) => {
    const [hoverRating, setHoverRating] = useState<number|null>(null);
    return (
        <div className="flex items-center space-x-1 mt-1">
            {[...Array(10)].map((_, i) => {
                const ratingValue = i + 1;
                return (
                    <button
                        type="button"
                        key={ratingValue}
                        onClick={() => setRating(rating === ratingValue ? null : ratingValue)}
                        onMouseEnter={() => setHoverRating(ratingValue)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-1 rounded-full transition-colors"
                    >
                        <StarIcon className={`w-6 h-6 ${ratingValue <= (hoverRating || rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-500'}`} />
                    </button>
                );
            })}
        </div>
    )
}


export default MovieFormModal;
