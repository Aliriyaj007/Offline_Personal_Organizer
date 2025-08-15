import React from 'react';

interface ToolCardProps {
  label: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  onClick: () => void;
  viewMode: 'grid' | 'list';
}

const ToolCard: React.FC<ToolCardProps> = ({ label, description, icon: Icon, onClick, viewMode }) => {
  if (viewMode === 'list') {
    return (
      <button
        onClick={onClick}
        className="w-full text-left flex items-center gap-5 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200 ease-in-out transform hover:-translate-y-1"
      >
        <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-lg">
          <Icon className="w-7 h-7 text-indigo-600 dark:text-indigo-300" />
        </div>
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{label}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
        </div>
        <div className="flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400 dark:text-gray-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
        </div>
      </button>
    );
  }

  // Grid view is the default
  return (
    <button
      onClick={onClick}
      className="text-left flex flex-col h-full bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl p-6 transition-all duration-300 ease-in-out transform hover:-translate-y-1.5"
    >
      <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/50 p-4 rounded-xl self-start">
        <Icon className="w-8 h-8 text-indigo-600 dark:text-indigo-300" />
      </div>
      <div className="flex-grow mt-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{label}</h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
      <div className="mt-4 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
        Open Tool &rarr;
      </div>
    </button>
  );
};

export default ToolCard;