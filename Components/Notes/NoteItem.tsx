import React from 'react';
import { Note } from '../../types';
import TrashIcon from '../icons/TrashIcon';

interface NoteItemProps {
  note: Note;
  onClick: () => void;
  onDelete: () => void;
}

const NoteItem: React.FC<NoteItemProps> = ({ note, onClick, onDelete }) => {
  const formattedDate = new Date(note.updatedAt).toLocaleDateString(undefined, {
    month: 'short', day: 'numeric'
  });

  const contentToDisplay = (htmlContent: string) => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      let text = tempDiv.textContent || '';
      return text.trim() ? text : "No additional text";
  };
  
  return (
    <li className="group relative pr-10">
      <button 
          onClick={onClick}
          className="block w-full text-left p-3.5 rounded-lg transition-colors duration-150 hover:bg-gray-100 dark:hover:bg-slate-700"
      >
        <h3 className="text-md font-semibold text-gray-800 dark:text-gray-100 truncate mb-1">
          {note.title || "Untitled Note"}
        </h3>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 flex-grow truncate">
            {contentToDisplay(note.content)}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0 ml-2">{formattedDate}</p>
        </div>
      </button>
      <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-red-500 rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
            aria-label="Delete note"
        >
            <TrashIcon className="w-5 h-5"/>
        </button>
    </li>
  );
};

export default NoteItem;
