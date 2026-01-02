
import React, { useState } from 'react';
import { UserProfile } from '../services/authService';

// Fix: Added translations property to match usage in App.tsx
interface SocialProps {
  type: 'leaderboard' | 'chat';
  user: UserProfile;
  translations: any;
}

const SocialPanels: React.FC<SocialProps> = ({ type, user, translations: t }) => {
  const [messages, setMessages] = useState([
    { id: '1', user: 'Chef Gordon', text: 'Moja pizza jest legendarna!', time: '12:01' },
    { id: '2', user: 'FoodieGirl', text: 'Gdzie kupić segway?', time: '12:05' },
    { id: '3', user: 'Piotr123', text: 'Właśnie odblokowałem burgery!', time: '12:10' },
  ]);
  const [input, setInput] = useState('');

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;
    setMessages([...messages, { id: Date.now().toString(), user: user.username, text: input, time: 'Now' }]);
    setInput('');
  };

  if (type === 'leaderboard') {
    return (
      <div className="p-6 bg-white h-full animate-pop overflow-y-auto">
        {/* Fix: Use translation for the leaderboard title */}
        <h2 className="text-3xl font-black text-slate-800 mb-6 flex items-center gap-3">
          <span className="text-4xl">🏆</span> {t.leaderboard}
        </h2>
        <div className="space-y-3">
          {[
            { pos: 1, name: 'Gordon Ramsay', score: '2.5M$', avatar: '🔥' },
            { pos: 2, name: 'Jamie Oliver', score: '1.8M$', avatar: '🥬' },
            { pos: 3, name: user.username, score: 'You', avatar: '🧑‍🍳' },
            { pos: 4, name: 'Burger King', score: '800k$', avatar: '👑' },
            { pos: 5, name: 'Chef Mario', score: '450k$', avatar: '🍄' },
          ].map(p => (
            <div key={p.pos} className={`p-4 rounded-2xl flex items-center justify-between border-b-4 ${p.pos === 3 ? 'bg-orange-100 border-orange-300' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-4">
                <span className="font-black text-slate-400 w-4">{p.pos}.</span>
                <span className="text-2xl">{p.avatar}</span>
                <span className="font-bold text-slate-700">{p.name}</span>
              </div>
              <span className="font-black text-emerald-600">{p.score}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 p-4">
      {/* Fix: Use translation for the chat title */}
      <h2 className="text-2xl font-black text-slate-800 mb-4 flex items-center gap-2">
        <span className="text-3xl">💬</span> {t.chat}
      </h2>
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
        {messages.map(m => (
          <div key={m.id} className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${m.user === user.username ? 'ml-auto bg-indigo-600 text-white rounded-br-none' : 'bg-white text-slate-800 rounded-bl-none border border-slate-200'}`}>
            <div className="text-[10px] font-black uppercase opacity-60 mb-1">{m.user}</div>
            <div className="text-sm font-medium">{m.text}</div>
            <div className="text-[8px] text-right mt-1 opacity-50">{m.time}</div>
          </div>
        ))}
      </div>
      <form onSubmit={send} className="flex gap-2">
        <input 
          value={input} 
          onChange={e => setInput(e.target.value)}
          placeholder="Napisz coś..." 
          className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 outline-none font-bold"
        />
        <button type="submit" className="bg-indigo-600 text-white p-3 rounded-xl active:scale-95 transition-all">
          <span className="text-xl">🚀</span>
        </button>
      </form>
    </div>
  );
};

export default SocialPanels;
