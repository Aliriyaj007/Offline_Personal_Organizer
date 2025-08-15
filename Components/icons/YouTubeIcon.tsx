import React from 'react';

const YouTubeIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "w-6 h-6"} style={style} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <rect x="3" y="5" width="18" height="14" rx="4"></rect>
        <path d="M10 9l5 3l-5 3z"></path>
    </svg>
);

export default YouTubeIcon;