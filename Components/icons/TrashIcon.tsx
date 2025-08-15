import React from 'react';

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c1.153 0 2.24.032 3.22.096m4.908 0a48.667 48.667 0 0 1-7.618 0m7.618 0a8.966 8.966 0 0 1 1.801.183m-1.801-.183c.166.037.331.074.496.11M6.27 5.79L6.244 4.17a1.125 1.125 0 0 1 1.124-1.125H10.5a1.125 1.125 0 0 1 1.125 1.125v1.62M6.27 5.79h11.46M15 5.79v-1.62a1.125 1.125 0 0 0-1.125-1.125H10.5a1.125 1.125 0 0 0-1.125 1.125v1.62m0 0M9.75 11.25h4.5M9.75 14.25h4.5" />
  </svg>
);

export default TrashIcon;