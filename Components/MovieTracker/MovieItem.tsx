import React from 'react';
import { Movie } from '../../types';
import StarIcon from '../icons/StarIcon';
import TrashIcon from '../icons/TrashIcon';
import PencilIcon from '../icons/PencilIcon';

interface MovieItemProps {
  movie: Movie;
  viewMode: 'grid' | 'list';
  onEdit: (movie: Movie) => void;
  onDelete: (movie: Movie) => void;
}

const MovieItem: React.FC<MovieItemProps> = ({ movie, viewMode, onEdit, onDelete }) => {
  const CardContent = () => (
    <>
      <div className="flex-grow">
        <span className={`absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded-full ${
            movie.status === 'Watched' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
        }`}>{movie.status}</span>
        
        <h3 className="text-lg font-bold text-gray-800 dark:text-white pr-10">{movie.title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
            {movie.releaseYear} {movie.director && `• ${movie.director}`}
        </p>
         <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 italic">{movie.genre}</p>
      </div>
      <div className="mt-4 flex justify-between items-center">
        {movie.rating !== null ? (
            <div className="flex items-center gap-1 text-yellow-500">
                <StarIcon className="w-5 h-5 fill-current"/>
                <span className="font-bold text-md">{movie.rating}</span>
                <span className="text-sm text-gray-400">/ 10</span>
            </div>
        ) : <div />}
        <div className="flex items-center gap-2">
            <button onClick={() => onEdit(movie)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700">
                <PencilIcon className="w-4 h-4 text-gray-600 dark:text-gray-300"/>
            </button>
            <button onClick={() => onDelete(movie)} className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50">
                <TrashIcon className="w-4 h-4 text-red-500"/>
            </button>
        </div>
      </div>
    </>
  );

  if (viewMode === 'grid') {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 flex flex-col relative transition-transform transform hover:-translate-y-1">
        <CardContent />
      </div>
    );
  }

  return (
     <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 flex items-center gap-4 relative">
        <div className="flex-grow flex items-center gap-4">
             <div className="flex-grow">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">{movie.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {movie.releaseYear} {movie.director && `• ${movie.director}`} {movie.genre && `• ${movie.genre}`}
                </p>
             </div>
             <span className={`flex-shrink-0 text-sm font-semibold px-2.5 py-1 rounded-full ${
                movie.status === 'Watched' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
            }`}>{movie.status}</span>
             {movie.rating !== null && (
                <div className="flex-shrink-0 flex items-center gap-1 text-yellow-500">
                    <StarIcon className="w-5 h-5 fill-current"/>
                    <span className="font-bold text-md">{movie.rating}</span>
                </div>
            )}
        </div>
        <div className="flex items-center gap-2">
            <button onClick={() => onEdit(movie)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700">
                <PencilIcon className="w-5 h-5 text-gray-600 dark:text-gray-300"/>
            </button>
            <button onClick={() => onDelete(movie)} className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50">
                <TrashIcon className="w-5 h-5 text-red-500"/>
            </button>
        </div>
     </div>
  )
};

export default MovieItem;
