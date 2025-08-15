import React, { useState, useRef, useEffect } from 'react';
import { NoteFolder } from '../../types';
import FolderIcon from '../icons/FolderIcon';
import FolderPlusIcon from '../icons/FolderPlusIcon';
import PencilIcon from '../icons/PencilIcon';
import TrashIcon from '../icons/TrashIcon';
import DotsVerticalIcon from '../icons/DotsVerticalIcon';

interface FolderListProps {
  folders: NoteFolder[];
  setFolders: (value: NoteFolder[] | ((val: NoteFolder[]) => NoteFolder[])) => void;
  onSelectFolder: (id: string | null) => void;
  onDeleteFolder: (folder: NoteFolder) => void;
  notesCount: Record<string, number>;
  allNotesCount: number;
}

const FolderList: React.FC<FolderListProps> = ({ folders, setFolders, onSelectFolder, onDeleteFolder, notesCount, allNotesCount }) => {
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingFolderName, setEditingFolderName] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const handleAddFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    const newFolder: NoteFolder = {
      id: Date.now().toString(),
      name: newFolderName,
      createdAt: Date.now(),
    };
    setFolders(prev => [newFolder, ...prev]);
    setNewFolderName('');
  };

  const handleRenameFolder = (folderId: string) => {
    if (!editingFolderName.trim()) {
        setEditingFolderId(null);
        setEditingFolderName('');
        return;
    };
    setFolders(prev => prev.map(f => f.id === folderId ? { ...f, name: editingFolderName } : f));
    setEditingFolderId(null);
    setEditingFolderName('');
    setActiveMenu(null);
  };
  
  const unfiledNotesCount = notesCount['unfiled'] || 0;

  return (
    <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-xl h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-3 border-b-2 border-indigo-500 dark:border-indigo-400">
         <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Note Folders</h2>
          <form onSubmit={handleAddFolder} className="flex-shrink-0 flex gap-2 w-full sm:w-auto">
            <input type="text" value={newFolderName} onChange={e => setNewFolderName(e.target.value)} placeholder="Create a new folder..."
                className="w-full flex-grow bg-gray-100 dark:bg-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
            <button type="submit" className="p-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex-shrink-0" disabled={!newFolderName.trim()}>
                <FolderPlusIcon className="w-5 h-5"/>
            </button>
          </form>
      </div>

      <nav className="flex-grow overflow-y-auto -mr-2 pr-2">
        <ul className="space-y-1.5">
          <li>
            <FolderItem 
              label="All Notes"
              onSelect={() => onSelectFolder('all')}
              count={allNotesCount}
            />
          </li>
          <li>
            <FolderItem 
              label="Unfiled Notes"
              onSelect={() => onSelectFolder('unfiled')}
              count={unfiledNotesCount}
            />
          </li>
          
          <hr className="my-3 border-gray-200 dark:border-gray-700"/>

          {folders.map(folder => (
            <li key={folder.id} className="relative group/item">
              {editingFolderId === folder.id ? (
                 <form onSubmit={(e) => { e.preventDefault(); handleRenameFolder(folder.id); }} className="flex items-center w-full px-2">
                    <input type="text" value={editingFolderName} onChange={e => setEditingFolderName(e.target.value)} autoFocus onBlur={() => handleRenameFolder(folder.id)}
                        className="w-full bg-gray-200 dark:bg-slate-600 rounded-md px-2 py-2 text-md font-semibold"
                    />
                 </form>
              ) : (
                <>
                <FolderItem 
                  label={folder.name}
                  onSelect={() => onSelectFolder(folder.id)}
                  count={notesCount[folder.id] || 0}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <button onClick={() => setActiveMenu(activeMenu === folder.id ? null : folder.id)} className="p-1.5 rounded-full opacity-0 group-hover/item:opacity-100 focus:opacity-100 hover:bg-gray-200 dark:hover:bg-slate-600">
                        <DotsVerticalIcon className="w-5 h-5" />
                    </button>
                    {activeMenu === folder.id && (
                       <PopUpMenu onClose={() => setActiveMenu(null)}>
                            <button onClick={() => { setEditingFolderId(folder.id); setEditingFolderName(folder.name); setActiveMenu(null); }} className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-slate-700">
                                <PencilIcon className="w-4 h-4" /> Rename
                            </button>
                            <button onClick={() => { onDeleteFolder(folder); setActiveMenu(null); }} className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-500/10">
                                <TrashIcon className="w-4 h-4" /> Delete
                            </button>
                       </PopUpMenu>
                    )}
                </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

const PopUpMenu: React.FC<{onClose: () => void, children: React.ReactNode}> = ({onClose, children}) => {
    const menuRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);
    return (
        <div ref={menuRef} className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-900 rounded-md shadow-lg z-10 border dark:border-slate-700">
           {children}
        </div>
    )
}

const FolderItem: React.FC<{label: string, onSelect: () => void, count: number}> = ({ label, onSelect, count }) => (
    <button onClick={onSelect} className="w-full text-left flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-md transition-colors text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700/50">
        <div className="flex items-center gap-3 truncate">
            <FolderIcon className="w-6 h-6 flex-shrink-0 text-indigo-500 dark:text-indigo-400"/>
            <span className="font-semibold truncate">{label}</span>
        </div>
        <span className="text-sm font-mono text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-slate-600/80 px-2.5 py-1 rounded-full">{count}</span>
    </button>
);

export default FolderList;
