
import React from 'react';

const RecipeBookIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25v14.25" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.966 8.966 0 0 1 18 3.75c1.052 0 2.062.18 3 .512v11.25a2.25 2.25 0 0 1-2.25 2.25h-1.5a2.25 2.25 0 0 1-2.25-2.25V6.042Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 8.25h3M15 11.25h3" />
    </svg>
);

export default RecipeBookIcon;
