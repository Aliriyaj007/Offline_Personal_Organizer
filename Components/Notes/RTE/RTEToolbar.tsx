import React, { useState, useRef, useEffect } from 'react';
import * as RTEIcons from './RTEIcons';
import AttachmentIcon from '../../icons/AttachmentIcon';

interface RTEToolbarProps {
  onAttachClick: () => void;
}

const RTEToolbar: React.FC<RTEToolbarProps> = ({ onAttachClick }) => {
  const [showHeadingsMenu, setShowHeadingsMenu] = useState(false);
  
  const handleCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };
  
  return (
    <div className="flex-shrink-0 flex flex-wrap items-center gap-x-1.5 p-2 bg-white/50 dark:bg-slate-800/50 border-b border-black/10 dark:border-white/10 backdrop-blur-sm sticky top-0 z-10">
      {/* Headings Dropdown */}
      <div className="relative">
        <ToolbarButton onClick={() => setShowHeadingsMenu(!showHeadingsMenu)} tooltip="Headings">
            <RTEIcons.HeadingIcon />
        </ToolbarButton>
        {showHeadingsMenu && (
          <PopUpMenu onClose={() => setShowHeadingsMenu(false)}>
            <button onClick={() => {handleCommand('formatBlock', '<h2>'); setShowHeadingsMenu(false);}} className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-slate-700"><h2>Heading 2</h2></button>
            <button onClick={() => {handleCommand('formatBlock', '<h3>'); setShowHeadingsMenu(false);}} className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-slate-700"><h3>Heading 3</h3></button>
            <button onClick={() => {handleCommand('formatBlock', '<p>'); setShowHeadingsMenu(false);}} className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-slate-700">Paragraph</button>
          </PopUpMenu>
        )}
      </div>
      <ToolbarSeparator />

      {/* Basic Formatting */}
      <ToolbarButton onClick={() => handleCommand('bold')} tooltip="Bold (Ctrl+B)"><RTEIcons.BoldIcon /></ToolbarButton>
      <ToolbarButton onClick={() => handleCommand('italic')} tooltip="Italic (Ctrl+I)"><RTEIcons.ItalicIcon /></ToolbarButton>
      <ToolbarButton onClick={() => handleCommand('underline')} tooltip="Underline (Ctrl+U)"><RTEIcons.UnderlineIcon /></ToolbarButton>
      <ToolbarButton onClick={() => handleCommand('strikeThrough')} tooltip="Strikethrough"><RTEIcons.StrikethroughIcon /></ToolbarButton>
      <ToolbarSeparator />
      
      {/* Lists */}
      <ToolbarButton onClick={() => handleCommand('insertUnorderedList')} tooltip="Bullet List"><RTEIcons.ListUlIcon /></ToolbarButton>
      <ToolbarButton onClick={() => handleCommand('insertOrderedList')} tooltip="Numbered List"><RTEIcons.ListOlIcon /></ToolbarButton>
      <ToolbarSeparator />

      {/* Insert */}
      <ToolbarButton onClick={onAttachClick} tooltip="Attach File"><AttachmentIcon/></ToolbarButton>
      
    </div>
  );
};

const ToolbarButton: React.FC<{onClick: () => void; tooltip: string; children: React.ReactNode}> = ({onClick, tooltip, children}) => (
    <button onClick={onClick} title={tooltip} className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors">
        {children}
    </button>
);

const ToolbarSeparator = () => <div className="w-px h-5 bg-gray-200 dark:bg-slate-700 mx-1"></div>;

const PopUpMenu: React.FC<{onClose: () => void, children: React.ReactNode}> = ({onClose, children}) => {
    const menuRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);
    return (
        <div ref={menuRef} className="absolute top-full mt-2 min-w-[140px] bg-white dark:bg-slate-900 rounded-lg shadow-xl z-20 border dark:border-slate-700">
           {children}
        </div>
    )
}

export default RTEToolbar;
