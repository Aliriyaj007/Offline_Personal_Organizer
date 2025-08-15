import React from 'react';
import { SocialMediaPost, PostStatus } from '../../types';
import { POST_STATUSES } from '../../constants';
import PostCard from './PostCard';

interface KanbanBoardProps {
  posts: SocialMediaPost[];
  setPosts: (value: SocialMediaPost[] | ((val: SocialMediaPost[]) => SocialMediaPost[])) => void;
  onEditPost: (post: SocialMediaPost) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ posts, setPosts, onEditPost }) => {

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, postId: string) => {
    e.dataTransfer.setData("postId", postId);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: PostStatus) => {
    e.preventDefault();
    const postId = e.dataTransfer.getData("postId");
    setPosts(prevPosts => prevPosts.map(p => p.id === postId ? { ...p, status: newStatus } : p));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex gap-4 overflow-x-auto p-2 -m-2">
      {POST_STATUSES.map(statusInfo => (
        <div 
          key={statusInfo.id} 
          className="w-72 flex-shrink-0 bg-gray-100 dark:bg-slate-800 rounded-xl"
          onDrop={(e) => handleDrop(e, statusInfo.id)}
          onDragOver={handleDragOver}
        >
          <div className={`p-3 font-semibold text-white rounded-t-xl ${statusInfo.color}`}>
            {statusInfo.label}
          </div>
          <div className="p-3 space-y-3 h-full">
            {posts
              .filter(p => p.status === statusInfo.id)
              .sort((a, b) => (a.scheduledAt || a.createdAt) - (b.scheduledAt || b.createdAt))
              .map(post => (
                <PostCard 
                  key={post.id}
                  post={post}
                  onEditPost={onEditPost}
                  onDragStart={handleDragStart}
                />
            ))}
             {posts.filter(p => p.status === statusInfo.id).length === 0 && (
                <div className="text-center text-sm text-gray-400 dark:text-gray-500 pt-8">
                    Drop posts here
                </div>
             )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
