import React from 'react';
import LogoIcon from './LogoIcon';
import MenuIcon from './icons/MenuIcon';
import UniversalSearch from './UniversalSearch';
import { SearchResult } from '../types';

interface NavbarProps {
  onOpenSidebar: () => void;
  onOpenSettings: () => void;
  onGoHome: () => void;
  onSearch: (query: string) => void;
  searchResults: SearchResult[];
  onNavigateToResult: (section: any) => void;
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;
}

const SettingsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.646.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 1.905c-.007.379.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.333.184-.582.496-.646.87l-.212 1.282a1.125 1.125 0 0 1-1.11.94h-2.594a1.125 1.125 0 0 1-1.11-.94l-.213-1.282c-.062-.374-.312-.686-.645-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.759 6.759 0 0 1 0-1.905c.007-.379-.137-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.184.582-.496.645-.87l.212-1.281Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);


const Navbar: React.FC<NavbarProps> = ({ 
  onOpenSidebar, onOpenSettings, onGoHome, 
  onSearch, searchResults, onNavigateToResult,
  isSearching, setIsSearching
}) => {
  return (
    <nav className="flex items-center justify-between h-16">
      <div className="flex items-center space-x-2 flex-1 min-w-0">
        <button
          onClick={onOpenSidebar}
          className="p-2 rounded-full text-indigo-100 hover:bg-white/20 dark:text-indigo-200 dark:hover:bg-white/10 transition-colors"
          aria-label="Open navigation menu"
        >
          <MenuIcon className="h-6 w-6" />
        </button>
        <div className={`flex items-center transition-opacity duration-300 ${isSearching ? 'opacity-0 pointer-events-none w-0' : 'opacity-100'}`}>
          <button onClick={onGoHome} className="flex items-center" aria-label="Go to dashboard">
              <LogoIcon className="h-8 w-8 text-white" />
              <h1 className="ml-3 text-2xl font-bold text-white hidden sm:block">Organizer</h1>
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex justify-center px-4">
        <UniversalSearch 
          onSearch={onSearch}
          results={searchResults}
          onNavigate={onNavigateToResult}
          isSearching={isSearching}
          setIsSearching={setIsSearching}
        />
      </div>

      <div className="flex items-center flex-1 justify-end">
         <button
          onClick={onOpenSettings}
          className="p-2 rounded-full text-indigo-100 hover:bg-white/20 dark:text-indigo-200 dark:hover:bg-white/10 transition-all duration-150 ease-in-out transform hover:scale-110"
          aria-label="Open settings"
        >
          <SettingsIcon className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;