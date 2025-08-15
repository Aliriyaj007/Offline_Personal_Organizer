import React, { useState } from 'react';
import { Note } from '../../types';
import NoteItem from './NoteItem';
import PlusIcon from '../icons/PlusIcon';
import BackIcon from '../icons/BackIcon';

interface NoteListProps {
  notes: Note[];
  onSelectNote: (id: string) => void;
  onCreateNote: () => void;
  folderName: string;
  onBack: () => void;
  onDeleteNote: (note: Note) => void;
}

type SortOption = 'updatedAt' | 'createdAt' | 'title' | 'priority';

const NoteList: React.FC<NoteListProps> = ({ notes, onSelectNote, onCreateNote, folderName, onBack, onDeleteNote }) => {
    const [sortOption, setSortOption] = useState<SortOption>('updatedAt');

    const sortedNotes = [...notes].sort((a, b) => {
        switch(sortOption) {
            case 'priority':
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            case 'title':
                return a.title.localeCompare(b.title);
            case 'createdAt':
                return b.createdAt - a.createdAt;
            case 'updatedAt':
            default:
                return b.updatedAt - a.updatedAt;
        }
    });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl h-full flex flex-col">
        <header className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
                    <BackIcon className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white truncate mx-4 flex-grow">{folderName}</h2>
                <button onClick={onCreateNote} title="Create New Note" className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow flex-shrink-0">
                    <PlusIcon className="w-6 h-6"/>
                </button>
            </div>
             <div className="mt-3">
                <label htmlFor="sort-notes" className="sr-only">Sort Notes By</label>
                <select id="sort-notes" value={sortOption} onChange={e => setSortOption(e.target.value as SortOption)}
                    className="w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-slate-700 dark:border-gray-600 dark:text-white"
                >
                    <option value="updatedAt">Sort by Last Modified</option>
                    <option value="createdAt">Sort by Date Created</option>
                    <option value="title">Sort by Title (A-Z)</option>
                    <option value="priority">Sort by Priority</option>
                </select>
            </div>
        </header>

        <div className="flex-grow overflow-y-auto p-2">
            {sortedNotes.length > 0 ? (
                 <ul className="space-y-1">
                    {sortedNotes.map(note => (
                        <NoteItem 
                            key={note.id}
                            note={note}
                            onClick={() => onSelectNote(note.id)}
                            onDelete={() => onDeleteNote(note)}
                        />
                    ))}
                </ul>
            ) : (
                <div className="text-center py-16 px-4">
                    <p className="text-lg text-gray-500 dark:text-gray-400">This folder is empty.</p>
                    <button onClick={onCreateNote} className="mt-4 text-indigo-600 dark:text-indigo-400 font-semibold">
                      Create a new note
                    </button>
                </div>
            )}
        </div>
    </div>
  );
};

export default NoteList;
