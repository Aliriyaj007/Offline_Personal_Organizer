import React from 'react';

const LogoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 100 100" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="8" 
    className={className}
    aria-hidden="true"
  >
    {/* Stylized "O" - open ring */}
    <circle cx="50" cy="50" r="38" strokeLinecap="round" strokeDasharray="220 100" transform="rotate(-45 50 50)" />
    
    {/* Integrated Checkmark */}
    <path 
      d="M30 50 L45 65 L70 35" 
      strokeWidth="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    
    {/* Subtle Upward Arrow element (simple) */}
    {/* <path 
      d="M58 70 L65 63 M65 63 L72 70 M65 63 L65 50"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    /> */}
  </svg>
);

export default LogoIcon;
