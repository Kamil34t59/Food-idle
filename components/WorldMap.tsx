
import React from 'react';
import { UserProfile } from '../services/authService';

// Fix: Added translations property to match the prop being passed in App.tsx
interface MapProps {
  user: UserProfile;
  money: number;
  translations: any;
}

const WorldMap: React.FC<MapProps> = ({ user, money, translations: t }) => {
  const friends = [
    { id: '1', name: 'Adam', x: 30, y: 40, status: 'Level 5' },
    { id: '2', name: 'Ewa', x: 70, y: 20, status: 'Level 12' },
    { id: '3', name: 'Marek', x: 50, y: 60, status: 'Level 2' },
  ];

  return (
    <div className="h-full bg-sky-100 relative overflow-hidden p-6">
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")' }}></div>
      
      {/* Fix: Using translation for the header title */}
      <h2 className="relative z-10 text-3xl font-black text-slate-800 drop-shadow-sm">{t.world}</h2>
      <p className="relative z-10 text-slate-500 font-bold text-xs uppercase tracking-widest">Twoi znajomi w akcji</p>

      {/* Styled Map Background Elements */}
      <div className="absolute w-40 h-40 bg-emerald-300 rounded-full blur-3xl -left-10 top-20 opacity-40"></div>
      <div className="absolute w-60 h-60 bg-blue-300 rounded-full blur-3xl -right-10 bottom-20 opacity-40"></div>

      {/* Grid for "Global Progress" */}
      <div className="relative h-full mt-4">
        {friends.map(f => (
          <div key={f.id} className="absolute flex flex-col items-center animate-bounce" style={{ left: `${f.x}%`, top: `${f.y}%` }}>
            <div className="bg-white px-3 py-1 rounded-full shadow-lg border-2 border-indigo-500 text-[10px] font-black mb-2 whitespace-nowrap">
              {f.name}: {f.status}
            </div>
            <div className="text-4xl filter drop-shadow-xl">🏠</div>
          </div>
        ))}

        {/* User Location */}
        <div className="absolute flex flex-col items-center" style={{ left: '20%', top: '75%' }}>
          <div className="bg-orange-500 text-white px-3 py-1 rounded-full shadow-lg text-[10px] font-black mb-2 whitespace-nowrap">
            TWOJA RESTAURACJA
          </div>
          <div className="text-5xl animate-pulse">🏪</div>
        </div>
      </div>
    </div>
  );
};

export default WorldMap;
