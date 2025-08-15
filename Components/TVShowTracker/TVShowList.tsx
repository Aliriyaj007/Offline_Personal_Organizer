import React, { useState, useMemo } from 'react';
import { TVShow, TVShowWatchStatus } from '../../types';
import TVShowIcon from '../icons/TVShowIcon';
import PlusIcon from '../icons/PlusIcon';
import SearchIcon from '../icons/SearchIcon';
import TVShowItem from './TVShowItem';
import TVShowFormModal from './TVShowFormModal';

interface TVShowListProps {
  tvShows: TVShow[];
  setTvShows: (value: TVShow[] | ((val: TVShow[]) => TVShow[])) => void;
  onDeleteShow: (show: TVShow) => void;
  onSelectShow: (id: string) => void;
}

type SortOption = 'createdAt' | 'startYear' | 'title' | 'rating';

const TVShowList: React.FC<TVShowListProps> = ({ tvShows, setTvShows, onDeleteShow, onSelectShow }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShow, setEditingShow] = useState<TVShow | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('createdAt');
  const [filterStatus, setFilterStatus] = useState<TVShowWatchStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSaveShow = (showData: TVShow) => {
    setTvShows(prev => {
      const exists = prev.some(s => s.id === showData.id);
      if (exists) {
        return prev.map(s => (s.id === showData.id ? showData : s));
      }
      return [showData, ...prev];
    });
    setIsModalOpen(false);
    setEditingShow(null);
  };

  const openAddModal = () => {
    setEditingShow(null);
    setIsModalOpen(true);
  };

  const filteredAndSortedShows = useMemo(() => {
    let filtered = [...tvShows];

    if (filterStatus !== 'all') {
      filtered = filtered.filter(s => s.status === filterStatus);
    }
    
    if (searchQuery) {
        const lowerCaseQuery = searchQuery.toLowerCase();
        filtered = filtered.filter(s => 
            s.title.toLowerCase().includes(lowerCaseQuery) ||
            s.genre.toLowerCase().includes(lowerCaseQuery)
        );
    }

    return filtered.sort((a, b) => {
      switch (sortOption) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'startYear':
          return (b.startYear || 0) - (a.startYear || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'createdAt':
        default:
          return b.createdAt - a.createdAt;
      }
    });
  }, [tvShows, filterStatus, sortOption, searchQuery]);
  
  return (
    <>
      <div className="space-y-6">
        <header className="flex items-center gap-4 pb-3 border-b-2 border-indigo-500 dark:border-indigo-400">
          <TVShowIcon className="w-10 h-10 text-indigo-500 dark:text-indigo-400" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex-grow">
            TV Show Tracker
          </h2>
           <button onClick={openAddModal} className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-colors">
            <PlusIcon className="w-5 h-5"/>
            <span className="hidden sm:inline">Add Show</span>
          </button>
        </header>

        {/* Controls */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg sm:flex sm:flex-wrap sm:items-center sm:justify-between gap-4">
            <div className="relative flex-grow sm:max-w-xs">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" placeholder="Search shows..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-slate-700 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>
            <div className="flex items-center gap-4 flex-wrap mt-4 sm:mt-0">
                 <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)} className="border-gray-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-gray-600">
                    <option value="all">All Statuses</option>
                    {Object.values(TVShowWatchStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={sortOption} onChange={e => setSortOption(e.target.value as SortOption)} className="border-gray-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-gray-600">
                    <option value="createdAt">Sort by Date Added</option>
                    <option value="startYear">Sort by Start Year</option>
                    <option value="title">Sort by Title</option>
                    <option value="rating">Sort by Rating</option>
                </select>
            </div>
        </div>

        {/* Show List */}
        {filteredAndSortedShows.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedShows.map(show => (
              <TVShowItem 
                key={show.id} 
                show={show} 
                onSelect={() => onSelectShow(show.id)} 
                onDelete={(e) => { e.stopPropagation(); onDeleteShow(show); }} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-gray-500 dark:text-gray-400">No TV shows found.</p>
             <p className="text-sm text-gray-400 dark:text-gray-500">
                {searchQuery || filterStatus !== 'all' ? "Try adjusting your filters or search." : "Click 'Add Show' to start your watchlist!"}
            </p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <TVShowFormModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setEditingShow(null); }}
          onSave={handleSaveShow}
          show={editingShow}
        />
      )}
    </>
  );
};

export default TVShowList;
