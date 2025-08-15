import React from 'react';

const KanbanIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "w-6 h-6"} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <line x1="4" y1="4" x2="10" y2="4"></line>
        <line x1="14" y1="4" x2="20" y2="4"></line>
        <rect x="4" y="8" width="6" height="12" rx="2"></rect>
        <rect x="14" y="8" width="6" height="6" rx="2"></rect>
    </svg>
);

export default KanbanIcon;
