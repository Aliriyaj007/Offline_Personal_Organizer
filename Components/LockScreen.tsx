import React, { useState, useEffect } from 'react';
import LogoIcon from './LogoIcon';

interface LockScreenProps {
  onUnlock: () => void;
  correctPin: string;
}

const LockScreen: React.FC<LockScreenProps> = ({ onUnlock, correctPin }) => {
  const [enteredPin, setEnteredPin] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (enteredPin.length === 4) {
      if (enteredPin === correctPin) {
        onUnlock();
      } else {
        setError(true);
        setTimeout(() => {
          setEnteredPin('');
          setError(false);
        }, 800);
      }
    }
  }, [enteredPin, correctPin, onUnlock]);

  const handleNumberClick = (num: string) => {
    if (enteredPin.length < 4) {
      setEnteredPin(prev => prev + num);
    }
  };

  const handleDeleteClick = () => {
    setEnteredPin(prev => prev.slice(0, -1));
  };
  
  const handleFingerprintClick = () => {
      alert("Fingerprint authentication is not yet implemented.");
  }

  const PinDot: React.FC<{ active: boolean }> = ({ active }) => (
    <div className={`w-4 h-4 rounded-full border-2 border-white transition-colors duration-200 ${active ? 'bg-white' : ''}`} />
  );

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center text-white p-4">
      <div className="text-center">
        <LogoIcon className="h-16 w-16 mx-auto mb-4" />
        <h1 className="text-2xl font-bold">Enter PIN</h1>
        <p className="text-indigo-200">This app is locked for security.</p>
      </div>
      
      <div className={`flex space-x-4 my-8 transition-transform duration-300 ${error ? 'animate-shake' : ''}`}>
        <PinDot active={enteredPin.length >= 1} />
        <PinDot active={enteredPin.length >= 2} />
        <PinDot active={enteredPin.length >= 3} />
        <PinDot active={enteredPin.length >= 4} />
      </div>

      <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
        {[...Array(9)].map((_, i) => {
            const num = (i + 1).toString();
            return <NumberButton key={num} value={num} onClick={handleNumberClick} />;
        })}
        <button onClick={handleFingerprintClick} className="font-bold text-2xl p-4 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M7.864 4.243A7.5 7.5 0 0 1 19.5 7.5c0 1.82-1.01 3.44-2.52 4.33l.295 1.182a.5.5 0 0 1-.61.59l-1.18-.3a.5.5 0 0 0-.5.06a7.5 7.5 0 0 1-5.69 2.25c-4.142 0-7.5-3.358-7.5-7.5 0-2.43.9-4.63 2.364-6.257Z M15.75 6a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75a.75.75 0 0 1-.75-.75V6.75a.75.75 0 0 1 .75-.75Zm-4.5 0A.75.75 0 0 1 12 6.75v.01a.75.75 0 0 1-.75.75a.75.75 0 0 1-.75-.75V6.75A.75.75 0 0 1 11.25 6Z" /></svg>
        </button>
        <NumberButton value="0" onClick={handleNumberClick} />
        <button onClick={handleDeleteClick} className="font-bold text-2xl p-4 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75 14.25 12m0 0 2.25 2.25M14.25 12l2.25-2.25M14.25 12 12 14.25m-2.58 4.92-6.374-6.375a1.125 1.125 0 0 1 0-1.59L9.42 4.83c.21-.211.497-.33.795-.33H19.5a2.25 2.25 0 0 1 2.25 2.25v10.5a2.25 2.25 0 0 1-2.25 2.25h-9.284c-.298 0-.585-.119-.795-.33Z" /></svg>
        </button>
      </div>
    </div>
  );
};

const NumberButton: React.FC<{ value: string, onClick: (val: string) => void }> = ({ value, onClick }) => (
  <button onClick={() => onClick(value)} className="font-bold text-3xl p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200">
    {value}
  </button>
);


// Simple shake animation
const style = document.createElement('style');
style.innerHTML = `
@keyframes shake {
  10%, 90% { transform: translateX(-1px); }
  20%, 80% { transform: translateX(2px); }
  30%, 50%, 70% { transform: translateX(-4px); }
  40%, 60% { transform: translateX(4px); }
}
.animate-shake {
  animation: shake 0.5s ease-in-out;
}
`;
document.head.appendChild(style);

export default LockScreen;