import React from 'react';

const InfoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.353-.354M9 11.25l4.5 4.5m0-13.5h.008v.008H13.5V2.25Zm-3 18.75h-.008v.008H10.5v-.008Zm4.5 0h.008v.008H15v-.008Zm.354-12.354-4.5 4.5m6-6.354-.353.354m0 0h.008v.008h-.008v-.008Zm-3 3h.008v.008H12v-.008Zm-3 3h.008v.008H9v-.008Zm3 3h.008v.008H12v-.008Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

export default InfoIcon;
