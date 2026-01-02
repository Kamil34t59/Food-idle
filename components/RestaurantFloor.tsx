
import React, { useState } from 'react';
import { Station, Chef, Task } from '../types';
import { DELIVERY_POINT } from '../constants';

interface FloorProps {
  stations: Station[];
  chefs: Chef[];
  tasks: Task[];
  onStationClick: (id: string) => void;
  onUpgrade: (id: string) => void;
  onUnlock: (id: string) => void;
  onUpgradeMachine: (id: string) => void;
  money: number;
  staffCost: number;
  onHireStaff: () => void;
  translations: any;
  // Added language prop to fix the error on line 62
  language: string;
}

const RestaurantFloor: React.FC<FloorProps> = ({ 
  stations, chefs, tasks, onStationClick, onUpgrade, onUnlock, onUpgradeMachine, money, staffCost, onHireStaff, translations: t, language
}) => {
  const [clickEffects, setClickEffects] = useState<{id: number, x: number, y: number}[]>([]);

  const handleManualClick = (e: React.MouseEvent, sid: string) => {
    onStationClick(sid);
    const newEffect = { id: Date.now(), x: e.clientX, y: e.clientY };
    setClickEffects(prev => [...prev, newEffect]);
    setTimeout(() => {
      setClickEffects(prev => prev.filter(eff => eff.id !== newEffect.id));
    }, 800);
  };

  return (
    <div className="relative w-full h-full bg-transparent overflow-hidden">
      {/* Bardziej subtelna siatka dla lepszego widoku koloru tła */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ 
        backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', 
        backgroundSize: '40px 40px' 
      }}></div>

      {clickEffects.map(eff => (
        <div key={eff.id} className="money-pop text-yellow-400 pointer-events-none flex flex-col items-center" style={{ left: eff.x - 20, top: eff.y - 40 }}>
          <span className="text-2xl">💸</span>
          <span className="text-xs font-black">+$</span>
        </div>
      ))}

      {/* Górny panel zamówień - bardziej premium */}
      <div className="absolute top-6 left-6 z-40 animate-slide-down">
        <div className="glass-premium px-6 py-4 rounded-[2.5rem] flex items-center gap-4 border-l-4 border-yellow-500 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-yellow-500 rounded-2xl flex items-center justify-center text-xl shadow-lg">🛎️</div>
            {tasks.length > 0 && (
              <div className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-[11px] font-black border-2 border-slate-900 animate-bounce shadow-xl">
                {tasks.length}
              </div>
            )}
          </div>
          <div>
            <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] mb-0.5">{t.orders_waiting}</p>
            {/* language is now provided via props to fix "Cannot find name 'language'" */}
            <p className="text-lg font-black text-white leading-none">{tasks.length} {language === 'en' ? 'ORDERS' : 'ZAMÓWIEŃ'}</p>
          </div>
        </div>
      </div>

      {/* Przycisk zatrudniania - bardziej wyrazisty */}
      <div className="absolute bottom-6 left-6 z-40">
        <button 
          onClick={onHireStaff}
          disabled={money < staffCost}
          className={`group flex items-center gap-4 pl-4 pr-7 py-4 rounded-[2.5rem] shadow-[0_15px_30px_rgba(0,0,0,0.5)] transition-all btn-press ${money >= staffCost ? 'bg-indigo-600 border-b-4 border-indigo-950 text-white hover:bg-indigo-500' : 'bg-slate-800/80 text-slate-600 grayscale opacity-60'}`}
        >
          <div className="w-11 h-11 bg-white/10 rounded-full flex items-center justify-center text-2xl group-hover:rotate-12 transition-transform">🤝</div>
          <div className="text-left">
            <div className="text-[9px] font-black uppercase tracking-widest opacity-70">{t.hire}</div>
            <div className="text-base font-black tracking-tight">$ {staffCost.toLocaleString()}</div>
          </div>
        </button>
      </div>

      {/* Punkt Odbioru - Nowy Design */}
      <div 
        className="absolute w-44 h-28 z-20 group"
        style={{ left: `${DELIVERY_POINT.x}%`, top: `${DELIVERY_POINT.y}%`, transform: 'translate(-50%, -50%)' }}
      >
        <div className="absolute inset-0 bg-indigo-500/10 blur-[60px] rounded-full group-hover:bg-indigo-500/20 transition-all"></div>
        <div className="relative w-full h-full bg-slate-900/60 backdrop-blur-md rounded-[2.5rem] border-t-4 border-indigo-400 border-x border-white/5 shadow-2xl flex flex-col items-center justify-center group-hover:scale-105 transition-transform">
          <div className="text-[8px] font-black uppercase tracking-[0.3em] text-indigo-300 mb-2 opacity-80">PICKUP AREA</div>
          <div className="text-4xl animate-bounce drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)]">🍱</div>
        </div>
      </div>

      {stations.map(s => {
        const upgradeCost = Math.floor(s.basePrice * Math.pow(1.15, s.level + 1));
        const isTargeted = chefs.some(c => c.targetPos?.x === s.x && c.targetPos?.y === s.y);

        return (
          <div key={s.id} className="absolute z-10" style={{ left: `${s.x}%`, top: `${s.y}%`, transform: 'translate(-50%, -50%)' }}>
            <div className="relative flex flex-col items-center">
               
               {s.unlocked && !isTargeted && (
                 <button 
                  onClick={(e) => handleManualClick(e, s.id)} 
                  className="absolute -top-16 z-30 flex flex-col items-center animate-bounce hover:scale-125 transition-transform"
                 >
                   <div className="bg-gradient-to-br from-yellow-300 to-yellow-500 p-2 rounded-xl shadow-[0_10px_20px_rgba(234,179,8,0.4)] border-2 border-white/50">
                     <span className="text-xl">💰</span>
                   </div>
                   <div className="w-1 h-3 bg-yellow-600/50"></div>
                 </button>
               )}

               <div className={`w-24 h-24 rounded-[3rem] shadow-2xl flex items-center justify-center text-5xl transition-all duration-700 relative ${s.unlocked ? `${s.color} border-4 border-white/20 shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:rotate-3` : 'bg-slate-800/40 backdrop-blur-sm grayscale opacity-30 border-2 border-dashed border-slate-600'}`}>
                 {s.icon}
                 {!s.unlocked && <div className="absolute inset-0 flex items-center justify-center text-white/30 text-2xl">🔒</div>}
                 
                 {chefs.some(c => c.state === 'cooking' && c.currentTaskId?.startsWith(s.id)) && (
                   <div className="absolute -top-14 flex gap-2">
                     <span className="steam-particle text-xl">💨</span>
                     <span className="steam-particle text-xl" style={{animationDelay: '0.4s'}}>✨</span>
                     <span className="steam-particle text-xl" style={{animationDelay: '0.8s'}}>🔥</span>
                   </div>
                 )}

                 {s.unlocked && (
                   <div className="absolute -bottom-2 -right-2 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-2xl text-[10px] font-black border border-white/10 shadow-xl">
                     LVL {s.level}
                   </div>
                 )}
               </div>

               {s.unlocked ? (
                 <button 
                  onClick={() => onUpgrade(s.id)} 
                  disabled={money < upgradeCost} 
                  className={`mt-4 h-12 w-36 rounded-2xl text-[10px] font-black shadow-xl transition-all btn-press border-b-4 flex flex-col items-center justify-center ${money >= upgradeCost ? 'bg-yellow-500 border-yellow-700 text-yellow-950 hover:bg-yellow-400' : 'bg-slate-800/60 text-slate-500 border-slate-900/40'}`}
                 >
                   <span className="tracking-tighter">{t.level.toUpperCase()} UPGRADE</span>
                   <span className="text-[10px] font-black tracking-tight opacity-90">$ {upgradeCost.toLocaleString()}</span>
                 </button>
               ) : (
                 <button 
                  onClick={() => onUnlock(s.id)} 
                  disabled={money < s.baseCost} 
                  className={`mt-4 w-36 h-14 rounded-2xl text-[10px] font-black shadow-2xl transition-all btn-press border-b-4 flex flex-col items-center justify-center ${money >= s.baseCost ? 'bg-emerald-600 border-emerald-900 text-white' : 'bg-slate-800/60 border-slate-900 text-slate-600'}`}
                 >
                   <span>ODBLOKUJ</span>
                   <span className="text-[10px] opacity-70 font-black">$ {s.baseCost.toLocaleString()}</span>
                 </button>
               )}
            </div>
          </div>
        );
      })}

      {chefs.map(chef => {
        let animationClass = 'animate-look';
        let speedLines = false;
        
        if (chef.state === 'walking') {
          animationClass = 'animate-wobble';
          speedLines = true;
        }
        if (chef.state === 'cooking') animationClass = 'animate-chop';

        return (
          <div 
            key={chef.id}
            className="absolute w-16 h-16 transition-all duration-75 z-[30] flex flex-col items-center"
            style={{ left: `${chef.pos.x}%`, top: `${chef.pos.y}%`, transform: `translate(-50%, -100%)` }}
          >
            {speedLines && (
              <div className="absolute -left-4 top-1/2 w-8 h-[2px] bg-white/10 speed-line"></div>
            )}
            
            {chef.state === 'cooking' && (
              <div className="w-14 h-3 bg-slate-950/90 rounded-full mb-2 overflow-hidden border border-white/20 p-[2px] shadow-lg">
                <div className="h-full bg-gradient-to-r from-emerald-400 via-yellow-400 to-emerald-400 rounded-full" style={{ width: `${chef.progress}%`, transition: 'width 0.1s linear' }}></div>
              </div>
            )}
            
            <div className={`relative transition-transform duration-300 ${animationClass}`}>
               <div className={`text-6xl filter drop-shadow-[0_15px_15px_rgba(0,0,0,0.5)] ${chef.isStaff ? 'scale-85 brightness-90' : 'scale-100'}`}>
                  {chef.isStaff ? '👨‍🍳' : '🧑‍🍳'}
               </div>
               
               {chef.state === 'idle' && Math.random() > 0.995 && (
                 <div className="absolute -top-12 bg-white/90 text-black px-2 py-1 rounded-xl text-[10px] font-black animate-pop border border-slate-200">Zzzz...</div>
               )}

               {chef.currentTaskId && chef.state === 'walking' && chef.targetPos?.x === DELIVERY_POINT.x && (
                  <div className="absolute -right-6 -top-10 text-4xl animate-wobble filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.4)]">
                    📦
                  </div>
               )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RestaurantFloor;
