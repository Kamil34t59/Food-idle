
import React from 'react';
import { Upgrade } from '../types';

interface UpgradePanelProps {
  upgrades: Upgrade[];
  money: number;
  onPurchase: (id: string) => void;
  onClose: () => void;
  translations: any;
  theme: 'light' | 'dark';
}

const UpgradePanel: React.FC<UpgradePanelProps> = ({ upgrades, money, onPurchase, onClose, translations: t, theme }) => {
  return (
    <div className="absolute inset-0 bg-slate-900/60 z-[70] flex items-end animate-pop backdrop-blur-md">
      <div className={`w-full rounded-t-[3.5rem] h-[90%] flex flex-col shadow-2xl border-t-8 border-orange-500/30 ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-800'}`}>
        {/* Header Shop Section */}
        <div className={`p-10 flex justify-between items-center border-b ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="space-y-1">
            <h2 className="text-4xl font-black tracking-tighter uppercase italic text-orange-600">{t.bonuses}</h2>
            <div className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dostępne Inwestycje</p>
            </div>
          </div>
          <button onClick={onClose} className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-all shadow-lg active:scale-90 ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-white hover:bg-slate-100 text-slate-500'}`}>
            <span className="text-3xl">✕</span>
          </button>
        </div>

        {/* Upgrade Cards List */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 gap-4">
          {upgrades.map(upgrade => (
            <div 
              key={upgrade.id} 
              className={`group p-6 rounded-[2.5rem] border-2 flex items-center justify-between transition-all duration-300 ${upgrade.purchased ? (theme === 'dark' ? 'bg-slate-800/50 border-transparent opacity-40' : 'bg-slate-200/50 border-transparent opacity-40') : (theme === 'dark' ? 'bg-slate-800 border-slate-700 hover:border-indigo-500/50 shadow-xl' : 'bg-white border-white hover:border-orange-200 shadow-xl')}`}
            >
              <div className="flex gap-6 items-center">
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-3xl shadow-lg transform group-hover:rotate-12 transition-transform ${upgrade.type === 'speed' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}>
                   {upgrade.type === 'speed' ? '⚡' : '💰'}
                </div>
                <div className="space-y-1">
                  <div className="font-black text-xl tracking-tight">{upgrade.name}</div>
                  <div className="text-[11px] text-slate-400 font-bold uppercase leading-tight max-w-[150px]">{upgrade.description}</div>
                </div>
              </div>

              <button
                onClick={() => onPurchase(upgrade.id)}
                disabled={upgrade.purchased || money < upgrade.cost}
                className={`px-8 py-4 rounded-2xl font-black text-sm tracking-tight transition-all active:scale-95 ${upgrade.purchased ? 'bg-slate-400/20 text-slate-400' : (money >= upgrade.cost ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-xl shadow-indigo-200 hover:brightness-110 shimmer' : 'bg-slate-100 text-slate-400')}`}
              >
                {upgrade.purchased ? '✓ POSIADANE' : `$${upgrade.cost.toLocaleString()}`}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpgradePanel;
