import React from 'react';
import { SocialMediaPost } from '../../types';
import { SOCIAL_PLATFORMS } from '../../constants';

interface PostCardProps {
  post: SocialMediaPost;
  onEditPost: (post: SocialMediaPost) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onEditPost, onDragStart }) => {
  const platform = SOCIAL_PLATFORMS.find(p => p.id === post.platform);
  const Icon = platform?.icon;
  const color = platform?.color || '#78716c';

  const scheduledDate = post.scheduledAt
    ? new Date(post.scheduledAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    : null;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, post.id)}
      onClick={() => onEditPost(post)}
      className="bg-white dark:bg-slate-700 p-3 rounded-lg shadow-md cursor-pointer border-l-4"
      style={{ borderColor: color }}
    >
      <div className="flex items-center gap-2 mb-2" style={{ color }}>
        {Icon && <Icon className="w-5 h-5" />}
        <span className="text-sm font-bold">{post.platform}</span>
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-200 line-clamp-3">{post.content}</p>
      {scheduledDate && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">
          {scheduledDate}
        </p>
      )}
    </div>
  );
};

export default PostCard;