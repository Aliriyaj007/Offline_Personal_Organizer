import React from 'react';

const AnalyticsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v18h18" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 18.75V9.75l4.5 4.5 6-7.5" />
  </svg>
);

export default AnalyticsIcon;
