import React, { useState, useMemo } from 'react';
import { Movie, MovieWatchStatus } from '../../types';
import MovieIcon from '../icons/MovieIcon';
import PlusIcon from '../icons/PlusIcon';
import MovieFormModal from './MovieFormModal';
import MovieItem from './MovieItem';
import GridViewIcon from '../icons/GridViewIcon';
import ListViewIcon from '../icons/ListViewIcon';
import SearchIcon from '../icons/SearchIcon';

interface MovieTrackerProps {
  movies: Movie[];
  setMovies: (value: Movie[] | ((val: Movie[]) => Movie[])) => void;
  onDeleteMovie: (movie: Movie) => void;
}

type ViewMode = 'grid' | 'list';
type SortOption = 'createdAt' | 'releaseYear' | 'title' | 'rating';

const MovieTracker: React.FC<MovieTrackerProps> = ({ movies, setMovies, onDeleteMovie }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortOption, setSortOption] = useState<SortOption>('createdAt');
  const [filterStatus, setFilterStatus] = useState<MovieWatchStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSaveMovie = (movieData: Movie) => {
    setMovies(prev => {
      const exists = prev.some(m => m.id === movieData.id);
      if (exists) {
        return prev.map(m => (m.id === movieData.id ? movieData : m));
      }
      return [movieData, ...prev];
    });
    setIsModalOpen(false);
    setEditingMovie(null);
  };

  const openAddModal = () => {
    setEditingMovie(null);
    setIsModalOpen(true);
  };

  const openEditModal = (movie: Movie) => {
    setEditingMovie(movie);
    setIsModalOpen(true);
  };

  const filteredAndSortedMovies = useMemo(() => {
    let filtered = [...movies];

    if (filterStatus !== 'all') {
      filtered = filtered.filter(m => m.status === filterStatus);
    }
    
    if (searchQuery) {
        const lowerCaseQuery = searchQuery.toLowerCase();
        filtered = filtered.filter(m => 
            m.title.toLowerCase().includes(lowerCaseQuery) ||
            m.director.toLowerCase().includes(lowerCaseQuery) ||
            m.genre.toLowerCase().includes(lowerCaseQuery)
        );
    }

    return filtered.sort((a, b) => {
      switch (sortOption) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'releaseYear':
          return (b.releaseYear || 0) - (a.releaseYear || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'createdAt':
        default:
          return b.createdAt - a.createdAt;
      }
    });
  }, [movies, filterStatus, sortOption, searchQuery]);
  
  const ViewSwitcherButton: React.FC<{ mode: ViewMode, label: string, Icon: React.FC<{className?: string}> }> = ({ mode, label, Icon }) => (
    <button
        onClick={() => setViewMode(mode)}
        className={`p-2 rounded-md transition-colors ${viewMode === mode ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700'}`}
        aria-label={`Switch to ${label} view`}
        title={label}
    >
        <Icon className="w-5 h-5" />
    </button>
  );

  return (
    <>
      <div className="space-y-6">
        <header className="flex items-center gap-4 pb-3 border-b-2 border-indigo-500 dark:border-indigo-400">
          <MovieIcon className="w-10 h-10 text-indigo-500 dark:text-indigo-400" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex-grow">
            Movie Tracker
          </h2>
           <button onClick={openAddModal} className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-colors">
            <PlusIcon className="w-5 h-5"/>
            <span className="hidden sm:inline">Add Movie</span>
          </button>
        </header>

        {/* Controls */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg space-y-4 sm:space-y-0 sm:flex sm:flex-wrap sm:items-center sm:justify-between gap-4">
            <div className="relative flex-grow sm:max-w-xs">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" placeholder="Search movies..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-slate-700 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>
            <div className="flex items-center gap-4 flex-wrap">
                 <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)} className="border-gray-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-gray-600">
                    <option value="all">All Statuses</option>
                    <option value={MovieWatchStatus.Watched}>Watched</option>
                    <option value={MovieWatchStatus.WantToWatch}>Want to Watch</option>
                </select>
                <select value={sortOption} onChange={e => setSortOption(e.target.value as SortOption)} className="border-gray-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-gray-600">
                    <option value="createdAt">Sort by Date Added</option>
                    <option value="releaseYear">Sort by Release Year</option>
                    <option value="title">Sort by Title</option>
                    <option value="rating">Sort by Rating</option>
                </select>
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-900/50 p-1 rounded-lg">
                    <ViewSwitcherButton mode="grid" label="Grid View" Icon={GridViewIcon} />
                    <ViewSwitcherButton mode="list" label="List View" Icon={ListViewIcon} />
                </div>
            </div>
        </div>

        {/* Movie List */}
        {filteredAndSortedMovies.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
            {filteredAndSortedMovies.map(movie => (
              <MovieItem key={movie.id} movie={movie} viewMode={viewMode} onEdit={openEditModal} onDelete={onDeleteMovie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-gray-500 dark:text-gray-400">No movies found.</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
                {searchQuery || filterStatus !== 'all' ? "Try adjusting your filters or search." : "Click 'Add Movie' to start your collection!"}
            </p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <MovieFormModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setEditingMovie(null); }}
          onSave={handleSaveMovie}
          movie={editingMovie}
        />
      )}
    </>
  );
};

export default MovieTracker;
