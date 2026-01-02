
import React from 'react';
import { UserProfile } from '../services/authService';

interface HeaderProps {
  money: number;
  gems: number;
  user: UserProfile;
  onOpenSettings: () => void;
  // Added onOpenShop to match usage in App.tsx
  onOpenShop: () => void;
}

const Header: React.FC<HeaderProps> = ({ money, gems, user, onOpenSettings, onOpenShop }) => {
  const formatMoney = (val: number) => {
    if (val >= 1000000000) return (val / 1000000000).toFixed(2) + 'B';
    if (val >= 1000000) return (val / 1000000).toFixed(2) + 'M';
    if (val >= 1000) return (val / 1000).toFixed(1) + 'k';
    return val.toString();
  };

  return (
    <div className="flex flex-col z-[50]">
      <div className="bg-slate-900/90 text-white px-6 py-2 flex justify-between items-center text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-orange-500 to-yellow-400 flex items-center justify-center text-white text-[10px] border border-white/20 shadow-lg">
            {user.username.charAt(0)}
          </div>
          <span className="opacity-80">Ranga: Master Chef</span>
        </div>
        <button 
          onClick={onOpenSettings} 
          className="bg-white/10 hover:bg-orange-500 hover:text-white px-3 py-1 rounded-full transition-all border border-white/10 flex items-center gap-2"
        >
          <span>{user.username}</span>
          <span>⚙️</span>
        </button>
      </div>

      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-4 shadow-xl flex justify-between items-center border-b border-white/20">
        <div className="flex items-center gap-3">
           <div className="bg-emerald-100 dark:bg-emerald-900/30 px-4 py-2 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 shadow-inner flex items-center gap-3">
             <span className="text-xl">💵</span>
             <span className="font-black text-emerald-700 dark:text-emerald-400 text-xl tracking-tight">{formatMoney(money)}</span>
             {/* Open shop on plus button click */}
             <button onClick={onOpenShop} className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs shadow-lg hover:scale-110 active:scale-95 transition-all">+</button>
           </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 dark:bg-indigo-900/30 px-4 py-2 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 shadow-inner flex items-center gap-3">
            <span className="text-xl">💎</span>
            <span className="font-black text-indigo-700 dark:text-indigo-400 text-xl tracking-tight">{gems}</span>
             {/* Open shop on plus button click */}
             <button onClick={onOpenShop} className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs shadow-lg hover:scale-110 active:scale-95 transition-all">+</button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
