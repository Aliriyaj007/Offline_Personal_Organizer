import React from 'react';

const SocialMediaIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12.032 10.907a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.847 10.907a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907v2.25m4.815 0v2.25m4.814-2.25v2.25" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 13.157 12.032 15m4.814 0-4.815-1.843" />
    </svg>
);

export default SocialMediaIcon;
