import React, { useState, useMemo, useCallback } from 'react';
import { Note, NoteFolder } from '../../types';
import NoteEditor from './NoteEditor';
import FolderList from './FolderList';
import NoteList from './NoteList';

interface NotesProps {
  notes: Note[];
  setNotes: (value: Note[] | ((val: Note[]) => Note[])) => void;
  onDeleteNote: (note: Note) => void;
  folders: NoteFolder[];
  setFolders: (value: NoteFolder[] | ((val: NoteFolder[]) => NoteFolder[])) => void;
  onDeleteFolder: (folder: NoteFolder) => void;
}

type NotesView = 'folders' | 'notes' | 'editor';

const Notes: React.FC<NotesProps> = ({ notes, setNotes, onDeleteNote, folders, setFolders, onDeleteFolder }) => {
  const [view, setView] = useState<NotesView>('folders');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const handleSelectFolder = (folderId: string | null) => {
    setSelectedFolderId(folderId);
    setView('notes');
  };

  const handleSelectNote = (noteId: string) => {
    setSelectedNoteId(noteId);
    setView('editor');
  };

  const handleBackToFolders = () => {
    setView('folders');
    setSelectedFolderId(null);
  };
  
  const handleBackToNotes = () => {
    setView('notes');
    setSelectedNoteId(null);
  };

  const handleSaveNote = useCallback((noteData: Note) => {
    setNotes(prev => {
      const exists = prev.some(n => n.id === noteData.id);
      if (exists) {
        return prev.map(n => n.id === noteData.id ? noteData : n).sort((a,b) => b.updatedAt - a.updatedAt);
      }
      return [noteData, ...prev].sort((a,b) => b.updatedAt - a.updatedAt);
    });
  }, [setNotes]);

  const handleCreateNewNote = () => {
    const activeFolderId = (selectedFolderId === 'all' || selectedFolderId === 'unfiled' || selectedFolderId === null) ? null : selectedFolderId;
    const newNote: Note = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      title: 'Untitled Note',
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      folderId: activeFolderId,
      priority: 'medium',
      color: 'default',
      attachments: [],
    };
    setNotes(prev => [newNote, ...prev]);
    handleSelectNote(newNote.id);
  };
  
  const handleDeleteNote = (noteToDelete: Note) => {
    onDeleteNote(noteToDelete);
    // If we were viewing this note, go back to the list
    if (noteToDelete.id === selectedNoteId) {
        setView('notes');
        setSelectedNoteId(null);
    }
  };

  const selectedNote = useMemo(() => {
    return notes.find(n => n.id === selectedNoteId) || null;
  }, [selectedNoteId, notes]);

  const filteredNotes = useMemo(() => {
    if (selectedFolderId === 'unfiled') {
      return notes.filter(note => !note.folderId);
    }
    if (selectedFolderId === 'all' || selectedFolderId === null) {
      return notes;
    }
    return notes.filter(note => note.folderId === selectedFolderId);
  }, [notes, selectedFolderId]);
  
  const folderName = useMemo(() => {
      if (selectedFolderId === 'all') return 'All Notes';
      if (selectedFolderId === 'unfiled') return 'Unfiled Notes';
      return folders.find(f => f.id === selectedFolderId)?.name || 'Notes';
  }, [selectedFolderId, folders]);

  if (view === 'editor' && selectedNote) {
    return (
      <NoteEditor
        key={selectedNote.id}
        note={selectedNote}
        onSave={handleSaveNote}
        onDelete={() => handleDeleteNote(selectedNote)}
        onBack={handleBackToNotes}
      />
    );
  }

  if (view === 'notes' && selectedFolderId !== null) {
    return (
      <NoteList
        notes={filteredNotes}
        onSelectNote={handleSelectNote}
        onCreateNote={handleCreateNewNote}
        folderName={folderName}
        onBack={handleBackToFolders}
        onDeleteNote={onDeleteNote}
      />
    );
  }

  return (
    <FolderList
      folders={folders}
      setFolders={setFolders}
      onSelectFolder={handleSelectFolder}
      onDeleteFolder={onDeleteFolder}
      notesCount={notes.reduce((acc, note) => {
        const key = note.folderId || 'unfiled';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)}
      allNotesCount={notes.length}
    />
  );
};

export default Notes;
