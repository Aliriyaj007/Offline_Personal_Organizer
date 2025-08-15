import React from 'react';
import { TVShow, TVShowWatchStatus } from '../../types';
import StarIcon from '../icons/StarIcon';
import TrashIcon from '../icons/TrashIcon';

interface TVShowItemProps {
  show: TVShow;
  onSelect: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

const getStatusColor = (status: TVShowWatchStatus) => {
    switch(status) {
        case TVShowWatchStatus.Watching: return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
        case TVShowWatchStatus.Completed: return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
        case TVShowWatchStatus.OnHold: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
        case TVShowWatchStatus.Dropped: return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
        case TVShowWatchStatus.PlanToWatch: return 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-100';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-100';
    }
}

const TVShowItem: React.FC<TVShowItemProps> = ({ show, onSelect, onDelete }) => {
  const progressSeason = show.progress.season.toString().padStart(2, '0');
  const progressEpisode = show.progress.episode.toString().padStart(2, '0');

  return (
    <div onClick={onSelect} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 flex flex-col relative transition-transform transform hover:-translate-y-1 cursor-pointer group">
      <div className="flex-grow">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white pr-8">{show.title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
            {show.startYear} {show.genre && `• ${show.genre}`}
        </p>
      </div>

      <div className="mt-4 space-y-2">
         {show.status === TVShowWatchStatus.Watching && (
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Progress: <span className="font-mono bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">S{progressSeason}E{progressEpisode}</span>
            </div>
         )}
         <div className="text-sm">
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(show.status)}`}>{show.status}</span>
         </div>
      </div>
     
      <div className="mt-4 flex justify-between items-center">
        {show.rating !== null ? (
            <div className="flex items-center gap-1 text-yellow-500">
                <StarIcon className="w-5 h-5 fill-current"/>
                <span className="font-bold text-md">{show.rating}</span>
                <span className="text-sm text-gray-400">/ 10</span>
            </div>
        ) : <div />}
      </div>

       <button onClick={onDelete} className="absolute top-2 right-2 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity">
            <TrashIcon className="w-5 h-5 text-red-500"/>
        </button>
    </div>
  );
};

export default TVShowItem;
