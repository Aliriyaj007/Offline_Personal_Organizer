import React, { useState, useEffect } from 'react';
import { SocialMediaPost, PostStatus } from '../../types';
import { SOCIAL_PLATFORMS, POST_STATUSES } from '../../constants';
import TrashIcon from '../icons/TrashIcon';

interface PostFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (postData: Omit<SocialMediaPost, 'id' | 'createdAt'>, isEditing: boolean) => void;
  onDelete: () => void;
  post: SocialMediaPost | null;
}

const PostFormModal: React.FC<PostFormModalProps> = ({ isOpen, onClose, onSave, onDelete, post }) => {
  const [platform, setPlatform] = useState(SOCIAL_PLATFORMS[0].id);
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<PostStatus>('Idea');
  const [scheduledAt, setScheduledAt] = useState<string>('');

  const isEditing = post !== null;

  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        setPlatform(post.platform);
        setContent(post.content);
        setStatus(post.status);
        setScheduledAt(post.scheduledAt ? new Date(post.scheduledAt).toISOString().slice(0, 16) : '');
      } else {
        setPlatform(SOCIAL_PLATFORMS[0].id);
        setContent('');
        setStatus('Idea');
        setScheduledAt('');
      }
    }
  }, [post, isEditing, isOpen]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return alert('Content cannot be empty.');

    const scheduledTimestamp = scheduledAt ? new Date(scheduledAt).getTime() : null;

    onSave({
      platform,
      content,
      status,
      scheduledAt: scheduledTimestamp,
      publishedAt: isEditing ? post.publishedAt : undefined, // preserve original
    }, isEditing);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-[100]" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="flex-grow flex flex-col space-y-4">
          <h2 className="text-2xl font-bold flex-shrink-0">{isEditing ? 'Edit Post' : 'Create New Post'}</h2>
          
          <div className="flex-grow overflow-y-auto pr-2 -mr-2 space-y-4">
            <div>
              <label className="label">Platform</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {SOCIAL_PLATFORMS.map(p => (
                  <button type="button" key={p.id} onClick={() => setPlatform(p.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border-2 transition-colors ${platform === p.id ? 'text-white' : 'text-gray-700 dark:text-gray-200'}`}
                    style={{ backgroundColor: platform === p.id ? p.color : 'transparent', borderColor: p.color }}
                  >
                    <p.icon className="w-4 h-4"/> {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Content</label>
              <textarea value={content} onChange={e => setContent(e.target.value)} rows={6} className="input-field mt-1" required />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div>
                  <label className="label">Status</label>
                  <select value={status} onChange={e => setStatus(e.target.value as PostStatus)} className="input-field mt-1">
                    {POST_STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
               </div>
               <div>
                  <label className="label">Schedule Date & Time</label>
                  <input type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} className="input-field mt-1"/>
               </div>
            </div>
          </div>

          <div className="flex-shrink-0 mt-6 flex justify-between items-center">
             <div>
                {isEditing && <button type="button" onClick={onDelete} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"><TrashIcon/></button>}
             </div>
             <div className="flex gap-4">
                <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md">{isEditing ? 'Save Changes' : 'Create Post'}</button>
            </div>
          </div>
        </form>
        <style>{`.label { display: block; font-size: 0.875rem; font-weight: 500; color: #374151; } .dark .label { color: #D1D5DB; } .input-field { background-color: white; border: 1px solid #D1D5DB; border-radius: 0.375rem; padding: 0.5rem 0.75rem; width: 100%;} .dark .input-field { background-color: #374151; border-color: #4B5563; color: #F9FAFB; }`}</style>
      </div>
    </div>
  );
};

export default PostFormModal;
