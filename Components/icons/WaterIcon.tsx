import React from 'react';

const WaterIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.002 9.002 0 0 0 8.33-5.342c.866-2.855-.42-5.83-3.08-7.391L12 3 6.75 8.267c-2.66 1.56-3.946 4.536-3.08 7.39C4.545 18.155 7.97 21 12 21Z" />
  </svg>
);

export default WaterIcon;