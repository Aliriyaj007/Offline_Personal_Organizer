import React, { useState, useMemo } from 'react';
import { Book, BookStatus } from '../../types';
import BookIcon from '../icons/BookIcon';
import PlusIcon from '../icons/PlusIcon';
import BookFormModal from './BookFormModal';
import BookItem from './BookItem';
import UpdateProgressModal from './UpdateProgressModal';
import GridViewIcon from '../icons/GridViewIcon';
import ListViewIcon from '../icons/ListViewIcon';

interface BookTrackerProps {
  books: Book[];
  setBooks: (value: Book[] | ((val: Book[]) => Book[])) => void;
  onDeleteBook: (book: Book) => void;
}

type ViewMode = 'grid' | 'list';

const BookTracker: React.FC<BookTrackerProps> = ({ books, setBooks, onDeleteBook }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const handleSaveBook = (bookData: Book) => {
    setBooks(prev => {
      const exists = prev.some(b => b.id === bookData.id);
      if (exists) {
        return prev.map(b => (b.id === bookData.id ? bookData : b));
      }
      return [bookData, ...prev];
    });
    setIsFormOpen(false);
    setEditingBook(null);
  };

  const handleUpdateProgress = (bookId: string, currentPage: number) => {
    setBooks(prev => prev.map(b => (b.id === bookId ? { ...b, currentPage } : b)));
    setIsProgressOpen(false);
    setEditingBook(null);
  };

  const openAddModal = () => {
    setEditingBook(null);
    setIsFormOpen(true);
  };

  const openEditModal = (book: Book) => {
    setEditingBook(book);
    setIsFormOpen(true);
  };
  
  const openProgressModal = (book: Book) => {
    setEditingBook(book);
    setIsProgressOpen(true);
  }

  const groupedBooks = useMemo(() => {
    return books.reduce((acc, book) => {
      const status = book.status;
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(book);
      return acc;
    }, {} as Record<BookStatus, Book[]>);
  }, [books]);

  const statusOrder: BookStatus[] = [BookStatus.Reading, BookStatus.ToRead, BookStatus.Finished];

  return (
    <>
      <div className="space-y-6">
        <header className="flex items-center gap-4 pb-3 border-b-2 border-indigo-500 dark:border-indigo-400">
          <BookIcon className="w-10 h-10 text-indigo-500 dark:text-indigo-400" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex-grow">
            Book Tracker
          </h2>
           <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-gray-500'}`}><GridViewIcon/></button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-gray-500'}`}><ListViewIcon/></button>
            </div>
            <button onClick={openAddModal} className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-colors">
              <PlusIcon className="w-5 h-5"/>
              <span className="hidden sm:inline">Add Book</span>
            </button>
           </div>
        </header>
        
        <div className="space-y-8">
            {statusOrder.map(status => (
                groupedBooks[status] && groupedBooks[status].length > 0 && (
                    <section key={status}>
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">{status}</h3>
                        <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5' : 'space-y-3'}>
                            {groupedBooks[status].map(book => (
                                <BookItem
                                    key={book.id}
                                    book={book}
                                    viewMode={viewMode}
                                    onEdit={() => openEditModal(book)}
                                    onDelete={() => onDeleteBook(book)}
                                    onUpdateProgress={() => openProgressModal(book)}
                                />
                            ))}
                        </div>
                    </section>
                )
            ))}
            {books.length === 0 && (
                 <div className="text-center py-16">
                    <p className="text-lg text-gray-500 dark:text-gray-400">Your library is empty.</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">Click 'Add Book' to start cataloging your reads!</p>
                </div>
            )}
        </div>
      </div>

      {isFormOpen && <BookFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSave={handleSaveBook} book={editingBook} />}
      {isProgressOpen && <UpdateProgressModal isOpen={isProgressOpen} onClose={() => setIsProgressOpen(false)} onSave={handleUpdateProgress} book={editingBook} />}
    </>
  );
};

export default BookTracker;
