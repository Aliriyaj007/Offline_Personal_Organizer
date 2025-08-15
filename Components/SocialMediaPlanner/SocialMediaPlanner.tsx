
import React, { useState } from 'react';
import { SocialMediaPost } from '../../types';
import SocialMediaIcon from '../icons/SocialMediaIcon';
import PlusIcon from '../icons/PlusIcon';
import KanbanIcon from '../icons/KanbanIcon';
import CalendarDaysIcon from '../icons/CalendarDaysIcon';
import PostFormModal from './PostFormModal';
import KanbanBoard from './KanbanBoard';
import CalendarView from './CalendarView';

interface SocialMediaPlannerProps {
  posts: SocialMediaPost[];
  setPosts: (value: SocialMediaPost[] | ((val: SocialMediaPost[]) => SocialMediaPost[])) => void;
  onDeletePost: (post: SocialMediaPost) => void;
}

type ViewMode = 'kanban' | 'calendar';

const SocialMediaPlanner: React.FC<SocialMediaPlannerProps> = ({ posts, setPosts, onDeletePost }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<SocialMediaPost | null>(null);

  const handleSavePost = (postData: Omit<SocialMediaPost, 'id' | 'createdAt'>, isEditing: boolean) => {
    if (isEditing && editingPost) {
      const updatedPost = { ...editingPost, ...postData };
      setPosts(prev => prev.map(p => (p.id === updatedPost.id ? updatedPost : p)));
    } else {
      const newPost: SocialMediaPost = {
        id: Date.now().toString(),
        createdAt: Date.now(),
        ...postData,
      };
      setPosts(prev => [newPost, ...prev]);
    }
    setIsModalOpen(false);
    setEditingPost(null);
  };
  
  const openAddModal = () => {
    setEditingPost(null);
    setIsModalOpen(true);
  };

  const openEditModal = (post: SocialMediaPost) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };
  
  const TabButton: React.FC<{icon: React.FC<{className?: string}>, label: string, isActive: boolean, onClick: () => void}> = ({icon: Icon, label, isActive, onClick}) => (
     <button onClick={onClick} className={`flex items-center gap-2 whitespace-nowrap py-2 px-3 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${ isActive ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700' }`}>
        <Icon className="w-5 h-5"/> {label}
      </button>
  );

  return (
    <>
      <div className="space-y-6">
        <header className="flex items-center gap-4 pb-3 border-b-2 border-indigo-500 dark:border-indigo-400">
          <SocialMediaIcon className="w-10 h-10 text-indigo-500 dark:text-indigo-400" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex-grow">
            Social Media Planner
          </h2>
           <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                <TabButton icon={KanbanIcon} label="Board" isActive={viewMode === 'kanban'} onClick={() => setViewMode('kanban')} />
                <TabButton icon={CalendarDaysIcon} label="Calendar" isActive={viewMode === 'calendar'} onClick={() => setViewMode('calendar')} />
            </div>
            <button onClick={openAddModal} className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-colors">
              <PlusIcon className="w-5 h-5"/>
              <span className="hidden sm:inline">New Post</span>
            </button>
           </div>
        </header>

        {viewMode === 'kanban' ? (
          <KanbanBoard posts={posts} setPosts={setPosts} onEditPost={openEditModal} />
        ) : (
          <CalendarView posts={posts} onEditPost={openEditModal} />
        )}
      </div>

      {isModalOpen && (
        <PostFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSavePost}
          onDelete={() => {
            if(editingPost) onDeletePost(editingPost);
            setIsModalOpen(false);
          }}
          post={editingPost}
        />
      )}
    </>
  );
};

export default SocialMediaPlanner;
