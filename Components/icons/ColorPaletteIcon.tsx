import React from 'react';

const ColorPaletteIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a5.25 5.25 0 0 1 7.424 7.424l-4.72 4.72a5.25 5.25 0 0 1-7.424-7.424l4.72-4.72Z" />
    </svg>
);

export default ColorPaletteIcon;
