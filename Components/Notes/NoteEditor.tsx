import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Note, Attachment, NotePriority } from '../../types';
import RTEToolbar from './RTE/RTEToolbar';
import TrashIcon from '../icons/TrashIcon';
import ExportIcon from '../icons/ExportIcon';
import ColorPaletteIcon from '../icons/ColorPaletteIcon';
import AttachmentIcon from '../icons/AttachmentIcon';
import { NOTE_COLORS, NOTE_PRIORITIES } from '../../constants';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import PriorityHighIcon from '../icons/PriorityHighIcon';
import PriorityMediumIcon from '../icons/PriorityMediumIcon';
import PriorityLowIcon from '../icons/PriorityLowIcon';
import BackIcon from '../icons/BackIcon';

interface NoteEditorProps {
  note: Note;
  onSave: (note: Note) => void;
  onDelete: () => void;
  onBack: () => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, onSave, onDelete, onBack }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [currentColor, setCurrentColor] = useState(note.color);
  const [currentPriority, setCurrentPriority] = useState<NotePriority>(note.priority);
  const [attachments, setAttachments] = useState<Attachment[]>(note.attachments);

  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);

  const isDirty = title !== note.title || content !== note.content || currentColor !== note.color || currentPriority !== note.priority || attachments !== note.attachments;

  const handleSave = useCallback(() => {
    const updatedNote = { ...note, title, content, color: currentColor, priority: currentPriority, attachments, updatedAt: Date.now() };
    onSave(updatedNote);
  }, [note, title, content, currentColor, currentPriority, attachments, onSave]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (isDirty) {
        handleSave();
      }
    }, 1500); // Auto-save 1.5s after changes

    return () => clearTimeout(handler);
  }, [title, content, currentColor, currentPriority, attachments, handleSave, isDirty]);
  
  const handleBack = () => {
    if (isDirty) {
      handleSave();
    }
    onBack();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to permanently delete this note? This action cannot be undone.')) {
        onDelete();
    }
  };


  // Set initial content for the editor
  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
        editorRef.current.innerHTML = content;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note.id]); // only on note change

  const handleContentChange = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (file.type.startsWith('image/')) {
        const imgHtml = `<img src="${dataUrl}" alt="${file.name}" style="max-width: 100%; height: auto; border-radius: 8px; margin-top: 8px; margin-bottom: 8px;" />`;
        document.execCommand('insertHTML', false, imgHtml);
        handleContentChange(); // Update content state after insertion
      } else {
        const newAttachment: Attachment = {
          id: Date.now().toString(),
          type: 'audio', // Assuming only audio other than images
          name: file.name,
          data: dataUrl,
        };
        setAttachments(prev => [...prev, newAttachment]);
      }
    };
    reader.readAsDataURL(file);
    if(fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
  };
  
  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };
  
  const exportAsPDF = () => {
    const noteContentElement = document.createElement('div');
    noteContentElement.innerHTML = `<h1>${title}</h1>${content}`;
    // Use a defined width to get consistent rendering
    noteContentElement.style.width = '800px'; 
    noteContentElement.style.padding = '20px';
    document.body.appendChild(noteContentElement);

    html2canvas(noteContentElement, { 
      useCORS: true,
      scale: 2 
    }).then((canvas) => {
      document.body.removeChild(noteContentElement);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const canvasAspectRatio = canvas.width / canvas.height;
      const imgWidth = pdfWidth - 20; // with margin
      const imgHeight = imgWidth / canvasAspectRatio;
      
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`${title.replace(/ /g, '_')}.pdf`);
    });
  };

  const exportAsTxt = () => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const textContent = tempDiv.textContent || '';
    const blob = new Blob([`Title: ${title}\n\n${textContent}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/ /g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const PriorityIcon = { high: PriorityHighIcon, medium: PriorityMediumIcon, low: PriorityLowIcon }[currentPriority];

  const bgColorClass = NOTE_COLORS.find(c => c.id === currentColor)?.value || 'dark:bg-slate-800 bg-white';
  
  return (
    <div className={`flex flex-col h-full rounded-2xl shadow-lg transition-colors duration-300 ${bgColorClass}`}>
      <header className="flex-shrink-0 flex items-center justify-between p-2.5 border-b border-black/10 dark:border-white/10">
        <div className="flex items-center gap-1">
          <button onClick={handleBack} title="Back to list" className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10">
              <BackIcon className="w-6 h-6" />
          </button>
          {/* Priority Menu */}
           <div className="relative">
              <button onClick={() => setShowPriorityMenu(!showPriorityMenu)} className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 flex items-center gap-1.5 text-sm">
                 <PriorityIcon className="w-5 h-5"/> <span className="capitalize">{currentPriority}</span>
              </button>
              {showPriorityMenu && <PopUpMenu onClose={() => setShowPriorityMenu(false)}>
                  {NOTE_PRIORITIES.map(p => (
                      <button key={p.id} onClick={() => { setCurrentPriority(p.id); setShowPriorityMenu(false); }} className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 capitalize">{p.label}</button>
                  ))}
              </PopUpMenu>}
           </div>

          {/* Color Menu */}
          <div className="relative">
            <button onClick={() => setShowColorMenu(!showColorMenu)} title="Note Color" className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10">
              <ColorPaletteIcon className="w-5 h-5"/>
            </button>
            {showColorMenu && <PopUpMenu onClose={() => setShowColorMenu(false)}>
                <div className="p-2 grid grid-cols-4 gap-2">
                  {NOTE_COLORS.map(color => (
                      <button key={color.id} onClick={() => { setCurrentColor(color.id); setShowColorMenu(false); }}
                          className={`w-7 h-7 rounded-full ${color.value} border dark:border-white/20 ring-offset-2 dark:ring-offset-slate-900 ${currentColor === color.id ? 'ring-2 ring-indigo-500' : ''}`}
                      />
                  ))}
                </div>
            </PopUpMenu>}
          </div>
        </div>

        <div className="flex items-center gap-1">
           {/* Export Menu */}
           <div className="relative">
            <button onClick={() => setShowExportMenu(!showExportMenu)} title="Export Note" className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10">
              <ExportIcon className="w-5 h-5" />
            </button>
            {showExportMenu && <PopUpMenu onClose={() => setShowExportMenu(false)}>
                <button onClick={() => { exportAsPDF(); setShowExportMenu(false); }} className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-slate-700">Export as PDF</button>
                <button onClick={() => { exportAsTxt(); setShowExportMenu(false); }} className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-slate-700">Export as TXT</button>
            </PopUpMenu>}
          </div>
          <button onClick={handleDelete} title="Delete Note" className="p-2 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-400/10">
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </header>

      <RTEToolbar onAttachClick={() => fileInputRef.current?.click()} />
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,audio/*" className="hidden"/>

      <main className="flex-grow overflow-y-auto px-6 py-4">
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Note Title"
          className="text-3xl lg:text-4xl font-extrabold w-full bg-transparent focus:outline-none mb-4 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600"
        />
        <div
          ref={editorRef}
          onInput={handleContentChange}
          contentEditable={true}
          suppressContentEditableWarning={true}
          className="prose dark:prose-invert max-w-none w-full h-full focus:outline-none text-slate-700 dark:text-slate-300"
          style={{minHeight: '200px'}}
        ></div>
      </main>

      <footer className="flex-shrink-0 p-3 border-t border-black/10 dark:border-white/10">
        <div className="flex flex-wrap gap-2">
            {attachments.map(att => (
                <div key={att.id} className="bg-black/5 dark:bg-white/5 rounded-full pl-3 pr-2 py-1 text-xs flex items-center gap-2">
                    <AttachmentIcon className="w-3 h-3"/>
                    <span>{att.name}</span>
                    <button onClick={() => removeAttachment(att.id)} className="text-gray-500 hover:text-red-500">
                        &times;
                    </button>
                </div>
            ))}
        </div>
        <p className="text-xs text-right text-gray-400 dark:text-gray-500 mt-2">
          Last updated: {new Date(note.updatedAt).toLocaleString()}
        </p>
      </footer>
    </div>
  );
};

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

export default NoteEditor;
