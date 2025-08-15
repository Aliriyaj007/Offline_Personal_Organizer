import React from 'react';

const ReportIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-1.5m18 1.5v-1.5M21 3v1.5M3 12h18M3 7.5h18M3 16.5h18" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12" />
    </svg>
);

export default ReportIcon;
