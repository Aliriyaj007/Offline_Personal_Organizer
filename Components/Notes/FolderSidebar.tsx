import React, { useState, useRef, useEffect } from 'react';
import { NoteFolder } from '../../types';
import FolderIcon from '../icons/FolderIcon';
import FolderPlusIcon from '../icons/FolderPlusIcon';
import PencilIcon from '../icons/PencilIcon';
import TrashIcon from '../icons/TrashIcon';
import DotsVerticalIcon from '../icons/DotsVerticalIcon';

interface FolderSidebarProps {
  folders: NoteFolder[];
  setFolders: (value: NoteFolder[] | ((val: NoteFolder[]) => NoteFolder[])) => void;
  selectedFolderId: string | null;
  setSelectedFolderId: (id: string | null) => void;
  onDeleteFolder: (folder: NoteFolder) => void;
  notesCount: Record<string, number>;
  allNotesCount: number;
}

const FolderSidebar: React.FC<FolderSidebarProps> = ({ folders, setFolders, selectedFolderId, setSelectedFolderId, onDeleteFolder, notesCount, allNotesCount }) => {
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
    if (!editingFolderName.trim()) return;
    setFolders(prev => prev.map(f => f.id === folderId ? { ...f, name: editingFolderName } : f));
    setEditingFolderId(null);
    setEditingFolderName('');
    setActiveMenu(null);
  };
  
  const unfiledNotesCount = notesCount['unfiled'] || 0;

  return (
    <aside className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-lg h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white px-2">Folders</h3>
      <nav className="flex-grow overflow-y-auto -mr-2 pr-2">
        <ul className="space-y-1">
          <li>
            <FolderItem 
              label="All Notes"
              isActive={selectedFolderId === 'all'}
              onClick={() => setSelectedFolderId('all')}
              count={allNotesCount}
            />
          </li>
          <li>
            <FolderItem 
              label="Unfiled"
              isActive={selectedFolderId === 'unfiled'}
              onClick={() => setSelectedFolderId('unfiled')}
              count={unfiledNotesCount}
            />
          </li>
          
          <hr className="my-2 border-gray-200 dark:border-gray-700"/>

          {folders.map(folder => (
            <li key={folder.id} className="relative group/item">
              {editingFolderId === folder.id ? (
                 <form onSubmit={(e) => { e.preventDefault(); handleRenameFolder(folder.id); }} className="flex items-center w-full px-2">
                    <input type="text" value={editingFolderName} onChange={e => setEditingFolderName(e.target.value)} autoFocus onBlur={() => handleRenameFolder(folder.id)}
                        className="w-full bg-gray-200 dark:bg-slate-600 rounded-md px-2 py-1.5 text-sm"
                    />
                 </form>
              ) : (
                <>
                <FolderItem 
                  label={folder.name}
                  isActive={selectedFolderId === folder.id}
                  onClick={() => setSelectedFolderId(folder.id)}
                  count={notesCount[folder.id] || 0}
                />
                <div className="absolute right-1 top-1/2 -translate-y-1/2">
                    <button onClick={() => setActiveMenu(activeMenu === folder.id ? null : folder.id)} className="p-1.5 rounded-full opacity-0 group-hover/item:opacity-100 focus:opacity-100 hover:bg-gray-200 dark:hover:bg-slate-600">
                        <DotsVerticalIcon className="w-4 h-4" />
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
      <form onSubmit={handleAddFolder} className="mt-4 flex-shrink-0 flex gap-2">
        <input type="text" value={newFolderName} onChange={e => setNewFolderName(e.target.value)} placeholder="New folder..."
            className="w-full flex-grow bg-gray-100 dark:bg-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none"
        />
        <button type="submit" className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50" disabled={!newFolderName.trim()}>
            <FolderPlusIcon className="w-5 h-5"/>
        </button>
      </form>
    </aside>
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
        <div ref={menuRef} className="absolute left-1/2 mt-2 w-32 bg-white dark:bg-slate-900 rounded-md shadow-lg z-10 border dark:border-slate-700">
           {children}
        </div>
    )
}

const FolderItem: React.FC<{label: string, isActive: boolean, onClick: () => void, count: number}> = ({ label, isActive, onClick, count }) => (
    <button onClick={onClick} className={`w-full text-left flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors ${
        isActive ? 'bg-indigo-100 text-indigo-800 dark:bg-slate-700 dark:text-indigo-300' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700/50'
    }`}>
        <div className="flex items-center gap-3 truncate">
            <FolderIcon className="w-5 h-5 flex-shrink-0"/>
            <span className="font-medium truncate">{label}</span>
        </div>
        <span className={`text-xs font-mono px-1.5 py-0.5 rounded-full ${isActive ? 'bg-indigo-200/80 dark:bg-slate-600' : 'bg-gray-200 dark:bg-slate-600/80'}`}>{count}</span>
    </button>
);

export default FolderSidebar;
