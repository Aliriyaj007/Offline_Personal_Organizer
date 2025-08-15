import React from 'react';
import { Book, BookStatus } from '../../types';
import StarIcon from '../icons/StarIcon';
import TrashIcon from '../icons/TrashIcon';
import PencilIcon from '../icons/PencilIcon';
import BookIcon from '../icons/BookIcon';

interface BookItemProps {
  book: Book;
  viewMode: 'grid' | 'list';
  onEdit: () => void;
  onDelete: () => void;
  onUpdateProgress: () => void;
}

const BookItem: React.FC<BookItemProps> = ({ book, viewMode, onEdit, onDelete, onUpdateProgress }) => {
  const progressPercent = book.pageCount ? (book.currentPage / book.pageCount) * 100 : 0;

  const coverImage = book.coverImage
    ? <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
    : <div className="w-full h-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center"><BookIcon className="w-1/2 h-1/2 text-gray-400 dark:text-slate-500"/></div>;

  const content = (
    <>
      <div className="flex-grow">
        <h4 className="font-bold text-gray-800 dark:text-white truncate">{book.title}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{book.author}</p>
      </div>
      {book.status === BookStatus.Reading && book.pageCount && (
        <div className="w-full mt-2">
            <div className="h-1.5 w-full bg-gray-200 dark:bg-slate-600 rounded-full">
                <div className="h-1.5 bg-indigo-500 rounded-full" style={{width: `${progressPercent}%`}}></div>
            </div>
            <p className="text-xs text-right mt-1 text-gray-400 dark:text-gray-500">{Math.round(progressPercent)}%</p>
        </div>
      )}
      {book.status === BookStatus.Finished && book.rating && (
        <div className="flex items-center gap-1 mt-2 text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className={`w-4 h-4 ${i < book.rating! ? 'fill-current' : ''}`} />
          ))}
        </div>
      )}
    </>
  );

  if (viewMode === 'grid') {
    return (
      <div className="group relative">
        <div className="aspect-[2/3] bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:-translate-y-1">
          {coverImage}
        </div>
        <div className="mt-2 text-center">{content}</div>
        <div className="absolute inset-0 bg-black/70 rounded-lg flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
            {book.status === BookStatus.Reading &&
                <button onClick={onUpdateProgress} className="bg-white/90 text-black px-3 py-1.5 rounded-full text-sm font-semibold">Update Progress</button>
            }
            <button onClick={onEdit} className="bg-white/90 text-black px-3 py-1.5 rounded-full text-sm font-semibold">Edit Details</button>
            <button onClick={onDelete} className="bg-red-500/90 text-white px-3 py-1.5 rounded-full text-sm font-semibold">Delete</button>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex items-center gap-4 p-3 bg-white dark:bg-slate-800 rounded-lg shadow-md">
       <div className="w-12 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-200 dark:bg-slate-700">
           {coverImage}
       </div>
       <div className="flex-grow">{content}</div>
       <div className="flex-shrink-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {book.status === BookStatus.Reading &&
                <button onClick={onUpdateProgress} title="Update Progress" className="p-2 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200"><PencilIcon className="w-5 h-5"/></button>
            }
           <button onClick={onEdit} title="Edit" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"><PencilIcon className="w-5 h-5"/></button>
           <button onClick={onDelete} title="Delete" className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50"><TrashIcon className="w-5 h-5 text-red-500"/></button>
       </div>
    </div>
  )
};

export default BookItem;
