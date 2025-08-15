import React from 'react';

const Icon: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    {children}
  </svg>
);

export const BoldIcon = () => <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M6 4h5.5a3.5 3.5 0 0 1 0 7H6zM6 7h5a1.5 1.5 0 0 0 0-3H6z" strokeWidth="2.5" transform="translate(3 4) scale(0.9)"/></Icon>;
export const ItalicIcon = () => <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M8 4h8M6 20h8M9 4l-3 16" /></Icon>;
export const UnderlineIcon = () => <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M6 4v11a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4V4M4 21h16" /></Icon>;
export const StrikethroughIcon = () => <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 7c-2 0-3 2-4 2s-2-2-4-2" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 17c-2 0-3-2-4-2s-2 2-4 2" /></Icon>;

export const HeadingIcon = () => <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M3 12h8m-8-5v10m8-10v10M17 5v14" /></Icon>;
export const Heading2Icon = () => <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M4 12h8m-8-5v10m8-10v10m5-10h2a2 2 0 1 1-2 3.75V15" /></Icon>;
export const Heading3Icon = () => <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M4 12h8m-8-5v10m8-10v10m5-10h2a2 2 0 1 1 0 4.5h-2m2 0h-2a2 2 0 1 0 0 4.5h2" /></Icon>;

export const ListUlIcon = () => <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M8 6h13M8 12h13M8 18h13M4 6h.01M4 12h.01M4 18h.01" /></Icon>;
export const ListOlIcon = () => <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M8 6h13M8 12h13M8 18h13M4.5 6H3m1.5 6H3m1.5 6H3" /></Icon>;

export const TableIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125V5.625c0-.621.504-1.125 1.125-1.125h17.25c.621 0 1.125.504 1.125 1.125v12.75c0 .621-.504 1.125-1.125 1.125m-17.25 0h17.25m-17.25 0h17.25M9 4.5v15m6-15v15" />
  </svg>
);
