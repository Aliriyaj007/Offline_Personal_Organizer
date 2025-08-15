import React from 'react';

const ProjectIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h12A2.25 2.25 0 0 0 20.25 14.25V3M3.75 3h16.5M3.75 3v-1.5A2.25 2.25 0 0 1 6 0h12a2.25 2.25 0 0 1 2.25 2.25v1.5m-16.5 0h16.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 6.75 5.25 5.25 5.25-5.25M16.5 6.75l-5.25 5.25" />
    </svg>
);

export default ProjectIcon;