import React, { useState } from 'react';
import { SocialMediaPost } from '../../types';
import { SOCIAL_PLATFORMS } from '../../constants';

interface CalendarViewProps {
  posts: SocialMediaPost[];
  onEditPost: (post: SocialMediaPost) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ posts, onEditPost }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay(); // 0 = Sunday, 1 = Monday...
  const daysInMonth = endOfMonth.getDate();
  const days = Array.from({ length: startDay + daysInMonth }, (_, i) => {
    if (i < startDay) return null;
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), i - startDay + 1);
  });
  
  const postsByDate = posts.reduce((acc, post) => {
    if (post.scheduledAt) {
      const dateKey = new Date(post.scheduledAt).toISOString().split('T')[0];
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(post);
    }
    return acc;
  }, {} as Record<string, SocialMediaPost[]>);

  const changeMonth = (offset: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };
  
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => changeMonth(-1)} className="px-3 py-1 rounded-md bg-gray-200 dark:bg-slate-700">&lt;</button>
        <h3 className="text-lg font-semibold">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
        <button onClick={() => changeMonth(1)} className="px-3 py-1 rounded-md bg-gray-200 dark:bg-slate-700">&gt;</button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-gray-500 dark:text-gray-400">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="py-2">{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (!day) return <div key={`empty-${index}`} className="border dark:border-slate-700 rounded-md min-h-[100px]"></div>;
          
          const dateKey = day.toISOString().split('T')[0];
          const dailyPosts = postsByDate[dateKey] || [];
          
          return (
            <div key={dateKey} className="border dark:border-slate-700 rounded-md min-h-[100px] p-1.5 flex flex-col">
              <span className="font-semibold text-sm">{day.getDate()}</span>
              <div className="flex-grow space-y-1 mt-1">
                {dailyPosts.map(post => {
                  const platform = SOCIAL_PLATFORMS.find(p => p.id === post.platform);
                  const Icon = platform?.icon;
                  return (
                    <button key={post.id} onClick={() => onEditPost(post)} className="w-full text-left flex items-center gap-1.5 p-1 rounded-md" style={{ backgroundColor: platform?.color + '20', color: platform?.color }}>
                      {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
                      <p className="text-xs truncate">{post.content}</p>
                    </button>
                  )
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;