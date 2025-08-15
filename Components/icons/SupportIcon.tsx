import React from 'react';

const SupportIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.375a6.375 6.375 0 0 0 6.375-6.375h-1.5a4.875 4.875 0 0 1-4.875 4.875v1.5ZM12 3.375A6.375 6.375 0 0 0 5.625 9.75h1.5a4.875 4.875 0 0 1 4.875-4.875v-1.5Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0Zm0 0H3.375m6.375 0h6.375" />
    </svg>
);

export default SupportIcon;
