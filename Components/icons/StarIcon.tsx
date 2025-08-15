import React from 'react';

const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.321h5.365a.562.562 0 0 1 .321.988l-4.204 3.055a.563.563 0 0 0-.184.532l1.581 5.318a.562.562 0 0 1-.844.62l-4.502-3.28a.562.562 0 0 0-.634 0l-4.502 3.28a.562.562 0 0 1-.844-.62l1.581-5.318a.563.563 0 0 0-.184-.532l-4.204-3.055a.562.562 0 0 1 .321-.988h5.365a.563.563 0 0 0 .475-.321l2.125-5.111Z" />
    </svg>
);

export default StarIcon;
