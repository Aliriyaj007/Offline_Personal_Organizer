import React, { useState, useEffect } from 'react';
import { TVShow } from '../../types';
import BackIcon from '../icons/BackIcon';
import StarIcon from '../icons/StarIcon';
import PencilIcon from '../icons/PencilIcon';
import TrashIcon from '../icons/TrashIcon';
import TVShowFormModal from './TVShowFormModal';

interface TVShowDetailProps {
  show: TVShow;
  onBack: () => void;
  onSave: (show: TVShow) => void;
  onDelete: (show: TVShow) => void;
}

const TVShowDetail: React.FC<TVShowDetailProps> = ({ show, onBack, onSave, onDelete }) => {
  const [currentShow, setCurrentShow] = useState(show);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [rating, setRating] = useState<number | null>(show.rating);
  const [notes, setNotes] = useState(show.notes);

  useEffect(() => {
    const handler = setTimeout(() => {
        if(rating !== currentShow.rating || notes !== currentShow.notes) {
            onSave({ ...currentShow, rating, notes });
        }
    }, 1000); // Debounce saving rating/notes
    return () => clearTimeout(handler);
  }, [rating, notes, currentShow, onSave]);

  const handleProgressChange = (season: number, episode: number) => {
    const newShowState = { ...currentShow, progress: { season, episode }};
    setCurrentShow(newShowState);
    onSave(newShowState);
  };
  
  const handleUpdateAndSave = (updatedShow: TVShow) => {
      setCurrentShow(updatedShow);
      onSave(updatedShow);
      setIsFormOpen(false);
  }

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${show.title}"? This cannot be undone.`)) {
        onDelete(show);
    }
  }

  return (
    <>
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-xl">
            <header className="flex items-start justify-between gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-4">
                    <button onClick={onBack} className="p-2 mt-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 flex-shrink-0">
                        <BackIcon className="w-6 h-6" />
                    </button>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{currentShow.title}</h2>
                        <p className="text-md text-gray-500 dark:text-gray-400">
                           {currentShow.startYear} {currentShow.genre && `• ${currentShow.genre}`}
                        </p>
                    </div>
                </div>
                <div className="flex-shrink-0 flex items-center gap-2">
                     <button onClick={() => setIsFormOpen(true)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700" title="Edit Show Details">
                        <PencilIcon className="w-5 h-5"/>
                    </button>
                     <button onClick={handleDelete} className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50" title="Delete Show">
                        <TrashIcon className="w-5 h-5 text-red-500"/>
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Progress & Notes */}
                <div className="md:col-span-2 space-y-6">
                     {/* Progress Tracker */}
                    <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                        <h3 className="text-lg font-semibold mb-3">Progress Tracker</h3>
                        <div className="flex items-center justify-center gap-4">
                            {/* Season */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">S</span>
                                <input type="number" value={currentShow.progress.season} 
                                    onChange={e => handleProgressChange(parseInt(e.target.value) || 1, currentShow.progress.episode)}
                                    className="w-16 text-center font-mono text-lg p-2 border rounded-md dark:bg-slate-800 dark:border-gray-600"/>
                            </div>
                            {/* Episode */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">E</span>
                                <input type="number" value={currentShow.progress.episode}
                                     onChange={e => handleProgressChange(currentShow.progress.season, parseInt(e.target.value) || 0)}
                                     className="w-16 text-center font-mono text-lg p-2 border rounded-md dark:bg-slate-800 dark:border-gray-600"/>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <button onClick={() => handleProgressChange(currentShow.progress.season, currentShow.progress.episode + 1)} className="px-3 py-1 bg-indigo-500 text-white rounded text-sm hover:bg-indigo-600">+1 Ep</button>
                                <button onClick={() => handleProgressChange(currentShow.progress.season + 1, 0)} className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600">+1 Sea</button>
                            </div>
                        </div>
                    </div>
                    {/* Notes */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">My Notes</h3>
                         <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={8}
                            className="w-full p-3 border rounded-md dark:bg-slate-900 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Your thoughts, theories, favorite moments..."
                        />
                    </div>
                </div>
                {/* Right Column: Status & Rating */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Status</h3>
                        <p className={`inline-block font-semibold px-3 py-1 rounded-full text-sm ${getStatusColor(currentShow.status)}`}>
                            {currentShow.status}
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2">My Rating</h3>
                        <StarRating rating={rating} setRating={setRating} />
                    </div>
                    {currentShow.totalSeasons && (
                         <div>
                            <h3 className="text-lg font-semibold mb-2">Seasons</h3>
                            <p className="text-md text-gray-600 dark:text-gray-300">Total: {currentShow.totalSeasons}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
        
        {isFormOpen && (
            <TVShowFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSave={handleUpdateAndSave}
                show={currentShow}
            />
        )}
    </>
  );
};

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

const getStatusColor = (status: TVShow['status']) => {
    switch(status) {
        case 'Watching': return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
        case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
        case 'On Hold': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
        case 'Dropped': return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
        case 'Plan to Watch': return 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-100';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-100';
    }
}

export default TVShowDetail;
