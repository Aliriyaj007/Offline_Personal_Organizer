import React from 'react';
import { AppSection } from '../types';
import { APP_SECTIONS_CONFIG, SectionConfig } from '../constants';
import LogoIcon from './LogoIcon';
import CloseIcon from './icons/CloseIcon';
import HomeIcon from './icons/HomeIcon';


interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: AppSection | null) => void;
  activeSection: AppSection | null;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onNavigate, activeSection }) => {
  const groupedSections = APP_SECTIONS_CONFIG.reduce((acc, section) => {
    const category = section.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(section);
    return acc;
  }, {} as Record<string, SectionConfig[]>);

  const categoryOrder: (keyof typeof groupedSections)[] = ['Daily Tools', 'Health & Wellness', 'Productivity', 'Organization', 'Media & Leisure', 'Professional'];

  const NavItem: React.FC<{
    config: { label: string; icon: React.FC<{ className?: string }>; id: AppSection | null };
    isActive: boolean;
   }> = ({ config, isActive }) => {
    const Icon = config.icon;
    return (
        <li>
            <button
            onClick={() => onNavigate(config.id)}
            className={`flex items-center w-full p-3 rounded-lg text-left transition-colors duration-200 ${
                isActive
                ? 'bg-indigo-500 text-white shadow-lg'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            >
            <Icon className="w-6 h-6 mr-4" />
            <span className="font-medium">{config.label}</span>
            </button>
        </li>
    );
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sidebar-title"
      >
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                    <LogoIcon className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />
                    <h2 id="sidebar-title" className="ml-3 text-xl font-bold text-gray-800 dark:text-white">Organizer Menu</h2>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    aria-label="Close menu"
                >
                    <CloseIcon className="w-6 h-6" />
                </button>
            </div>
            <nav className="flex-grow p-4 overflow-y-auto">
              <ul className="space-y-2">
                <NavItem 
                    config={{ label: 'Dashboard', icon: HomeIcon, id: null}} 
                    isActive={activeSection === null}
                />
                <hr className="my-3 border-gray-200 dark:border-gray-700" />
                
                {categoryOrder.map(category => (
                  groupedSections[category] ? (
                    <div key={category}>
                      <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 px-3 mt-4 mb-2">{category}</h3>
                      <ul className="space-y-1">
                        {groupedSections[category].map((section) => (
                            <NavItem 
                                key={section.id} 
                                config={section} 
                                isActive={activeSection === section.id}
                            />
                        ))}
                      </ul>
                    </div>
                  ) : null
                ))}
              </ul>
            </nav>
        </div>
      </aside>
    </>
  );
};

const HomeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
    </svg>
);


export default Sidebar;
