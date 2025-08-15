import React from 'react';

const BirthdayIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a2.25 2.25 0 0 1-2.25 2.25H5.25a2.25 2.25 0 0 1-2.25-2.25v-8.25M12 15v-7.5M12 7.5h.008v.008H12V7.5Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c-2.485 0-4.5 2.015-4.5 4.5s4.5 4.5 4.5 4.5 4.5-2.015 4.5-4.5S14.485 2.25 12 2.25Z" />
    </svg>
);

export default BirthdayIcon;
