import React from 'react';

const ClientIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.742-.586l-2.28-2.282M18 18.72a9.094 9.094 0 0 1-3.742-.586m3.742.586c.245.083.49.162.731.235m-3.742-.586a9.094 9.094 0 0 1-3.742-.586m0 0a9.094 9.094 0 0 1-3.742.586m2.28 2.282a9.094 9.094 0 0 1-3.742-.586M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 0a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Zm0 0v.01" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 21a9.094 9.094 0 0 1 13.5 0" />
    </svg>
);

export default ClientIcon;
