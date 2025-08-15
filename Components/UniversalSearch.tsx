import React, { useState, useEffect, useRef } from 'react';
import { SearchResult } from '../types';
import SearchIcon from './icons/SearchIcon';
import CloseIcon from './icons/CloseIcon';

interface UniversalSearchProps {
  onSearch: (query: string) => void;
  results: SearchResult[];
  onNavigate: (section: any) => void;
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;
}

const UniversalSearch: React.FC<UniversalSearchProps> = ({ onSearch, results, onNavigate, isSearching, setIsSearching }) => {
  const [query, setQuery] = useState('');
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        if(isSearching && !query) {
           setIsSearching(false);
        }
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isSearching, query, setIsSearching]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onSearch(newQuery);
  };

  const handleFocus = () => {
    setIsSearching(true);
  };
  
  const handleClear = () => {
    setQuery('');
    onSearch('');
    setIsSearching(false);
  };

  return (
    <div ref={searchContainerRef} className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search anything..."
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          className="block w-full h-10 pl-10 pr-10 py-2 border border-transparent rounded-full text-white bg-white/20 dark:bg-white/10 placeholder-gray-300 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 dark:focus:bg-white/20 sm:text-sm"
        />
        {query && (
            <button onClick={handleClear} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <CloseIcon className="h-5 w-5 text-gray-300 hover:text-white"/>
            </button>
        )}
      </div>
      {isSearching && query && (
        <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md max-h-80 overflow-auto text-sm">
          {results.length > 0 ? (
            results.map(result => (
              <li key={result.id}>
                <button
                  onClick={() => onNavigate(result.section)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{result.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{result.context}</p>
                </button>
              </li>
            ))
          ) : (
            <li className="px-4 py-3 text-gray-500 dark:text-gray-400">No results found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default UniversalSearch;