import React, { useRef, useState } from 'react';
import { BackupData, Transaction, TodoTask, GroceryItem, AppSection, Note, WaterData, Theme, TrashItem, NoteFolder, Movie, TVShow, Habit, Book, Homework, Project, Meal, Recipe, FoodLog, FoodItem, Workout, Exercise, Measurement, Birthday, Event, Client, Appointment, SocialMediaPost } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';
import DesktopIcon from './icons/DesktopIcon';
import LanguageIcon from './icons/LanguageIcon';
import SecurityIcon from './icons/SecurityIcon';
import InfoIcon from './icons/InfoIcon';
import SupportIcon from './icons/SupportIcon';
import ReportIcon from './icons/ReportIcon';
import StarIcon from './icons/StarIcon';
import ShareIcon from './icons/ShareIcon';
import HeartIcon from './icons/HeartIcon';
import FeatureIcon from './icons/FeatureIcon';
import PolicyIcon from './icons/PolicyIcon';
import TrashIcon from './icons/TrashIcon';
import { TRASH_RETENTION_DAYS, APP_SECTIONS_CONFIG } from '../constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: {
    transactions: Transaction[]; tasks: TodoTask[]; groceryItems: GroceryItem[];
    notes: Note[]; noteFolders: NoteFolder[]; waterData: WaterData;
    movies: Movie[]; tvShows: TVShow[]; habits: Habit[]; books: Book[];
    homeworks: Homework[]; projects: Project[];
    meals: Meal[]; recipes: Recipe[]; foodLogs: FoodLog[]; foodItems: FoodItem[];
    workouts: Workout[]; exercises: Exercise[]; measurements: Measurement[];
    birthdays: Birthday[]; events: Event[]; clients: Client[]; appointments: Appointment[];
    socialMediaPosts: SocialMediaPost[];
    trashItems: TrashItem[];
    activeSection: AppSection | null;
  };
  onRestoreData: (data: BackupData) => void;
  appVersion: string;
  pin: string | null;
  onSetPin: (pin: string | null) => void;
  trashItems: TrashItem[];
  onRestoreItem: (item: TrashItem) => void;
  onPermanentlyDeleteItem: (id: string) => void;
  onEmptyTrash: () => void;
}

type SettingsPage = 'main' | 'theme' | 'security' | 'about' | 'privacy' | 'data' | 'trash';

const pageTitles: { [key in SettingsPage]: string } = {
  main: 'Settings',
  theme: 'Theme',
  security: 'Security',
  about: 'About This App',
  privacy: 'Privacy Policy',
  data: 'Backup & Restore',
  trash: 'Trash',
};

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen, onClose, currentData, onRestoreData, appVersion, pin, onSetPin,
  trashItems, onRestoreItem, onPermanentlyDeleteItem, onEmptyTrash
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [page, setPage] = useState<SettingsPage>('main');
  const { theme, setTheme } = useTheme();
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  if (!isOpen) return null;

  const handleClose = () => {
    setPage('main');
    setNewPin('');
    setConfirmPin('');
    onClose();
  };
  
  const handleSetPin = () => {
    if(newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      alert('PIN must be 4 digits.');
      return;
    }
    if (newPin !== confirmPin) {
      alert("PINs do not match.");
      return;
    }
    onSetPin(newPin);
    alert('PIN has been set successfully.');
    setNewPin('');
    setConfirmPin('');
    setPage('security');
  };

  const handleRemovePin = () => {
    if (window.confirm('Are you sure you want to remove the PIN? The app will no longer be locked.')) {
      onSetPin(null);
      alert('PIN has been removed.');
    }
  };

  const handleShare = async () => {
    const title = 'Offline Personal Organizer';
    const text = 'Manage your life with the Offline Personal Organizer! Track your budget, tasks, and more, all while keeping your data private and offline. Developed by Riyajul Ali.';
    const url = window.location.href;

    const isShareableUrl = url.startsWith('http');

    const shareData: {title: string, text: string, url?: string} = {
      title,
      text,
    };
    if (isShareableUrl) {
      shareData.url = url;
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        const contentToCopy = isShareableUrl ? url : `${title}\n\n${text}`;
        await navigator.clipboard.writeText(contentToCopy);
        alert(isShareableUrl ? 'App URL copied to clipboard!' : 'App details copied to clipboard!');
      } else {
        alert('Sharing is not supported on this browser. You can copy the URL manually.');
      }
    } catch (err) {
      if ((err as DOMException).name !== 'AbortError') {
        console.error('Share failed:', err);
        alert('An error occurred while trying to share. The URL may not be shareable in this context.');
      }
    }
  };

  const renderPage = () => {
    switch(page) {
      case 'theme':
        return <ThemeSettingsPage theme={theme} setTheme={setTheme} />;
      case 'security':
        return <SecuritySettingsPage pin={pin} onSetPin={handleSetPin} onRemovePin={handleRemovePin} newPin={newPin} setNewPin={setNewPin} confirmPin={confirmPin} setConfirmPin={setConfirmPin} />;
      case 'about':
        return <AboutPage appVersion={appVersion} />;
      case 'privacy':
        return <PrivacyPolicyPage />;
       case 'data':
        return <DataManagementPage currentData={currentData} onRestoreData={onRestoreData} appVersion={appVersion} onClose={handleClose} fileInputRef={fileInputRef} setPage={setPage} trashItemCount={trashItems.length} />;
      case 'trash':
        return <TrashSettingsPage items={trashItems} onRestore={onRestoreItem} onDelete={onPermanentlyDeleteItem} onEmptyTrash={onEmptyTrash} />;
      default:
        return <MainSettingsPage setPage={setPage} onShare={handleShare} />;
    }
  };
  
  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-[100] transition-opacity duration-300"
      onClick={handleClose}
      role="dialog" aria-modal="true" aria-labelledby="settings-modal-title"
    >
      <div
        className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 opacity-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          {page !== 'main' && (
            <button onClick={() => setPage(page === 'trash' ? 'data' : 'main')} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full mr-2">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
            </button>
          )}
          <h2 id="settings-modal-title" className="text-2xl font-semibold text-gray-800 dark:text-white flex-grow">
            {pageTitles[page]}
          </h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" aria-label="Close settings">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-grow pr-2 -mr-2">
          {renderPage()}
        </div>
      </div>
    </div>
  );
};


const MainSettingsPage: React.FC<{ setPage: (page: SettingsPage) => void; onShare: () => void; }> = ({ setPage, onShare }) => (
  <div className="space-y-4">
    <SettingsCategory title="Customization">
      <SettingsItem icon={DesktopIcon} label="App Theme" onClick={() => setPage('theme')} />
    </SettingsCategory>
    <SettingsCategory title="Security & Privacy">
      <SettingsItem icon={SecurityIcon} label="App Lock (PIN)" onClick={() => setPage('security')} />
      <SettingsItem icon={PolicyIcon} label="Privacy Policy" onClick={() => setPage('privacy')} />
    </SettingsCategory>
     <SettingsCategory title="Data Management">
        <SettingsItem icon={DownloadIcon} label="Backup & Restore" onClick={() => setPage('data')} />
    </SettingsCategory>
    <SettingsCategory title="Support & Feedback">
      <SettingsItem icon={InfoIcon} label="About This App" onClick={() => setPage('about')} />
      <SettingsItem icon={SupportIcon} label="Support Center" href="mailto:riyajulreachargeali@gmail.com" />
      <SettingsItem icon={ReportIcon} label="Report an Issue" href="mailto:riyajulreachargeali@gmail.com?subject=Issue%20Report%20for%20Organizer%20App" />
      <SettingsItem icon={StarIcon} label="Rate Us" onClick={() => alert('Feature coming soon!')} />
      <SettingsItem icon={ShareIcon} label="Share App" onClick={onShare} />
      <SettingsItem icon={HeartIcon} label="Donate" onClick={() => alert('Feature coming soon!')} />
      <SettingsItem icon={FeatureIcon} label="Suggest a Feature" onClick={() => alert('Feature coming soon!')} />
    </SettingsCategory>
  </div>
);

const ThemeSettingsPage: React.FC<{ theme: Theme; setTheme: (theme: Theme) => void; }> = ({ theme, setTheme }) => (
  <div className="space-y-3">
    <p className="text-sm text-gray-600 dark:text-gray-400">Choose how the application looks.</p>
    <ThemeOption icon={SunIcon} label="Light" value="light" currentTheme={theme} setTheme={setTheme} />
    <ThemeOption icon={MoonIcon} label="Dark" value="dark" currentTheme={theme} setTheme={setTheme} />
    <ThemeOption icon={DesktopIcon} label="System Default" value="system" currentTheme={theme} setTheme={setTheme} />
  </div>
);

const SecuritySettingsPage: React.FC<{ pin: string | null, onSetPin: () => void, onRemovePin: () => void, newPin: string, setNewPin: (pin: string) => void, confirmPin: string, setConfirmPin: (pin: string) => void; }> = ({ pin, onSetPin, onRemovePin, newPin, setNewPin, confirmPin, setConfirmPin }) => (
  <div className="space-y-4">
    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/50 border-l-4 border-yellow-400 text-yellow-700 dark:text-yellow-300">
        <h4 className="font-bold">Important</h4>
        <p className="text-sm">If you forget your PIN, you will lose access to all your data. There is no way to recover it.</p>
    </div>
    {pin ? (
      <div>
        <p className="text-green-600 dark:text-green-400 mb-4">App lock is currently enabled.</p>
        <button onClick={onRemovePin} className="w-full px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-100 dark:hover:bg-red-700/30">
          Remove PIN
        </button>
      </div>
    ) : (
      <div className="space-y-4">
        <p>Set a 4-digit PIN to secure your app.</p>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">New PIN</label>
          <input type="password" value={newPin} onChange={e => setNewPin(e.target.value.replace(/\D/g, ''))} maxLength={4} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm PIN</label>
          <input type="password" value={confirmPin} onChange={e => setConfirmPin(e.target.value.replace(/\D/g, ''))} maxLength={4} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" />
        </div>
        <button onClick={onSetPin} className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          Set PIN
        </button>
      </div>
    )}
     <div className="mt-6">
        <SettingsItem icon={() => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M7.864 4.243A7.5 7.5 0 0 1 19.5 7.5c0 1.82-1.01 3.44-2.52 4.33l.295 1.182a.5.5 0 0 1-.61.59l-1.18-.3a.5.5 0 0 0-.5.06a7.5 7.5 0 0 1-5.69 2.25c-4.142 0-7.5-3.358-7.5-7.5 0-2.43.9-4.63 2.364-6.257Z M15.75 6a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75a.75.75 0 0 1-.75-.75V6.75a.75.75 0 0 1 .75-.75Zm-4.5 0A.75.75 0 0 1 12 6.75v.01a.75.75 0 0 1-.75.75a.75.75 0 0 1-.75-.75V6.75A.75.75 0 0 1 11.25 6Z" /></svg>} label="Fingerprint Unlock (Coming Soon)" onClick={() => alert('Feature coming soon!')} isPlaceholder />
    </div>
  </div>
);

const AboutPage: React.FC<{ appVersion: string }> = ({ appVersion }) => (
    <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
        <p>This is an offline-first personal organizer to help you manage your life, securely and privately.</p>
        <p>Version: {appVersion}</p>
        <p>&copy; {new Date().getFullYear()} Riyajul Ali. All rights reserved.</p>
    </div>
);

const PrivacyPolicyPage: React.FC = () => (
    <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
        <p>Your privacy is critically important. This app is designed to be offline-first, meaning your data stays on your device.</p>
        <h4 className="font-bold text-gray-800 dark:text-gray-200">Data Collection</h4>
        <p>This application does not collect, store, or transmit any of your personal data to any external servers. All information you enter (transactions, tasks, notes, etc.) is stored exclusively in your browser's local storage on your device.</p>
        <h4 className="font-bold text-gray-800 dark:text-gray-200">Data Usage</h4>
        <p>Your data is only used to provide the functionality of the app on your device. It is never analyzed, sold, or shared.</p>
        <h4 className="font-bold text-gray-800 dark:text-gray-200">Data Sharing & Backups</h4>
        <p>The app provides optional features to back up your data. When you use the 'Backup to File' feature, a file is created on your device which you control. We do not have access to this file. Cloud backup features are opt-in and would be subject to the privacy policies of the respective cloud provider.</p>
         <h4 className="font-bold text-gray-800 dark:text-gray-200">Contact</h4>
        <p>If you have any questions about this privacy policy, you can contact us at <a href="mailto:riyajulreachargeali@gmail.com" className="text-indigo-500 hover:underline">riyajulreachargeali@gmail.com</a>.</p>
    </div>
);


const SettingsCategory: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section>
    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">{title}</h3>
    <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg">
      {children}
    </div>
  </section>
);

const SettingsItem: React.FC<{ icon: React.FC<{className?: string}>; label: string; onClick?: () => void; href?: string; isPlaceholder?: boolean; badgeCount?: number; }> = ({ icon: Icon, label, onClick, href, isPlaceholder, badgeCount }) => {
  const content = (
    <div className="flex items-center w-full p-3 text-left">
      <Icon className={`w-6 h-6 mr-4 ${isPlaceholder ? 'text-gray-400 dark:text-gray-500' : 'text-indigo-500 dark:text-indigo-400'}`} />
      <span className={`flex-grow font-medium ${isPlaceholder ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-200'}`}>{label}</span>
      {badgeCount !== undefined && badgeCount > 0 && (
         <span className="bg-indigo-500 text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">{badgeCount}</span>
      )}
      {!href && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 dark:text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>}
    </div>
  );

  const className = `w-full transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${isPlaceholder ? '' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`;

  if (href) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{content}</a>;
  }
  return <button onClick={onClick} disabled={isPlaceholder} className={className}>{content}</button>;
};

const ThemeOption: React.FC<{ icon: React.FC<{className?: string}>; label: string; value: Theme; currentTheme: Theme; setTheme: (theme: Theme) => void; }> = ({ icon: Icon, label, value, currentTheme, setTheme }) => (
    <button onClick={() => setTheme(value)} className={`w-full flex items-center p-3 rounded-lg text-left transition-colors duration-200 ${currentTheme === value ? 'bg-indigo-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
        <Icon className="w-5 h-5 mr-3" />
        <span>{label}</span>
        {currentTheme === value && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ml-auto"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.06 0l4-5.5Z" clipRule="evenodd" /></svg>}
    </button>
);

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
  </svg>
);

const DataManagementPage: React.FC<{
    currentData: SettingsModalProps['currentData'];
    onRestoreData: (data: BackupData) => void;
    appVersion: string;
    onClose: () => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
    setPage: (page: SettingsPage) => void;
    trashItemCount: number;
}> = ({ currentData, onRestoreData, appVersion, onClose, fileInputRef, setPage, trashItemCount }) => {
    const handleLocalBackup = () => {
        const backupData: BackupData = {
          ...currentData,
          backupDate: new Date().toISOString(),
          appName: 'Offline Personal Organizer',
          version: appVersion,
        };
        const jsonString = JSON.stringify(backupData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const dateString = new Date().toISOString().replace(/:/g, '-');
        a.href = url;
        a.download = `organizer-backup-${dateString}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert('Local backup successful! File downloaded.');
      };

    const handleLocalRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string) as BackupData;
            if (data.appName !== 'Offline Personal Organizer') {
              alert('Invalid backup file.'); return;
            }
            if (data.version !== appVersion && !window.confirm(`Backup version (${data.version || 'unknown'}) differs from app version (${appVersion}). Continue anyway?`)) {
              return;
            }
            if (window.confirm('Are you sure? This will overwrite all current data.')) {
              onRestoreData(data);
              alert('Data restored successfully!');
              onClose();
            }
          } catch (error) {
            alert('Error restoring data. File may be corrupt.');
          } finally {
            if (fileInputRef.current) fileInputRef.current.value = "";
          }
        };
        reader.readAsText(file);
      };

    return (
        <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Manage your application data. Backups include all items, settings, and trashed items.</p>
             <SettingsCategory title="Actions">
                <SettingsItem icon={DownloadIcon} label="Backup Data to File" onClick={handleLocalBackup} />
                <label htmlFor="restoreFile" className="contents">
                    <SettingsItem icon={UploadIcon} label="Restore Data from File" onClick={() => fileInputRef.current?.click()} />
                </label>
                <input type="file" id="restoreFile" accept=".json" ref={fileInputRef} onChange={handleLocalRestore} className="hidden"/>
                <SettingsItem icon={TrashIcon} label="View Trash" onClick={() => setPage('trash')} badgeCount={trashItemCount} />
            </SettingsCategory>
        </div>
    );
};


const TrashSettingsPage: React.FC<{
  items: TrashItem[];
  onRestore: (item: TrashItem) => void;
  onDelete: (id: string) => void;
  onEmptyTrash: () => void;
}> = ({ items, onRestore, onDelete, onEmptyTrash }) => {
  const getDaysLeft = (deletedAt: number) => {
    const msInDay = 24 * 60 * 60 * 1000;
    const daysPassed = (Date.now() - deletedAt) / msInDay;
    return Math.max(0, Math.ceil(TRASH_RETENTION_DAYS - daysPassed));
  };
  
  const getItemTitle = (itemData: TrashItem['data']): React.ReactNode => {
    if ('title' in itemData && itemData.title) return itemData.title;
    if ('name' in itemData && itemData.name) return itemData.name;
    if ('description' in itemData && itemData.description) return itemData.description;
    if ('text' in itemData && itemData.text) return itemData.text;
    return 'Untitled Item';
  };
  
  const sectionIcons = APP_SECTIONS_CONFIG.reduce((acc, sec) => {
    acc[sec.id] = sec.icon;
    return acc;
  }, {} as Record<string, React.FC<{className?: string}>>);
  
  return (
    <div className="space-y-4">
        <div className="p-3 text-sm bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg">
            Items in the trash will be permanently deleted after {TRASH_RETENTION_DAYS} days.
        </div>
        {items.length > 0 ? (
            <>
                <button onClick={onEmptyTrash} className="w-full flex items-center justify-center gap-x-2 px-4 py-2.5 border border-red-500 text-red-500 rounded-md hover:bg-red-100 dark:hover:bg-red-900/20 text-sm font-medium">
                    <TrashIcon className="w-5 h-5"/> Empty Trash Now
                </button>
                <ul className="space-y-3">
                    {items.map(item => {
                        const daysLeft = getDaysLeft(item.deletedAt);
                        const Icon = sectionIcons[item.originalSection as AppSection];
                        return (
                            <li key={item.id} className="bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg">
                                <div className="flex items-start gap-3">
                                    {Icon && <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5"/>}
                                    <div className="flex-grow">
                                        <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{getItemTitle(item.data)}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">From: {item.originalSection}</p>
                                        <p className={`text-xs ${daysLeft < 5 ? 'text-red-500 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                                            Deletes in {daysLeft} day{daysLeft !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-x-3 mt-2">
                                    <button onClick={() => onRestore(item)} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">Restore</button>
                                    <button onClick={() => onDelete(item.id)} className="text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">Delete Forever</button>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </>
        ) : (
            <div className="text-center py-10">
                <TrashIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600"/>
                <p className="mt-4 text-gray-500 dark:text-gray-400">Your trash is empty.</p>
            </div>
        )}
    </div>
  );
};

export default SettingsModal;