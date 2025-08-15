import React from 'react';
import NotesIcon from '../icons/NotesIcon';

interface NoteEditorWelcomeProps {
    onCreateNote: () => void;
}

const NoteEditorWelcome: React.FC<NoteEditorWelcomeProps> = ({ onCreateNote }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-8">
            <NotesIcon className="w-24 h-24 text-gray-300 dark:text-gray-600" />
            <h2 className="mt-6 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Your notes live here
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Select a note from the list to view it, or create a new one.
            </p>
            <button
                onClick={onCreateNote}
                className="mt-6 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Create a New Note
            </button>
        </div>
    );
};

export default NoteEditorWelcome;
