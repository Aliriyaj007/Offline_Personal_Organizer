import React from 'react';

const TabViewIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c1.355 0 2.707-.153 4-.435M12 21c-1.293 0-2.585-.153-3.833-.435m15.666 0A9.001 9.001 0 0 0 12 3c-3.932 0-7.236 2.553-8.5 6" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 9h17" />
  </svg>
);

export default TabViewIcon;