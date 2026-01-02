
import React from 'react';

interface ShopPanelProps {
  onPurchase: (amount: number) => void;
  onClose: () => void;
  translations: any;
  theme: 'light' | 'dark';
}

const ShopPanel: React.FC<ShopPanelProps> = ({ onPurchase, onClose, translations: t, theme }) => {
  const bundles = [
    { id: 'b1', name: 'Zestaw Szefa', amount: 500, price: '49.99', icon: '🧺', color: 'from-blue-600/20' },
    { id: 'b2', name: 'Mała Kuchnia', amount: 1500, price: '129.99', icon: '🍳', color: 'from-emerald-600/20' },
    { id: 'b3', name: 'Kapitał PRO', amount: 5000, price: '399.99', icon: '🏦', best: true, color: 'from-yellow-600/30' },
    { id: 'b4', name: 'Skarbiec Tycoon', amount: 20000, price: '1499.99', icon: '💎', color: 'from-purple-600/20' },
    { id: 'b5', name: 'Fundusz Imperium', amount: 125000, price: '4999.99', icon: '🏰', color: 'from-red-600/20' },
  ];

  return (
    <div className="absolute inset-0 bg-slate-950/90 z-[100] flex items-end animate-pop backdrop-blur-3xl">
      <div className="w-full rounded-t-[4rem] h-[94%] bg-[#020617] flex flex-col shadow-2xl border-t-4 border-yellow-500/50 relative overflow-hidden">
        {/* Background Aura */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-yellow-500/10 blur-[100px] pointer-events-none"></div>

        <div className="p-10 flex justify-between items-center z-10">
          <div>
            <h2 className="text-5xl font-black italic gradient-text-gold tracking-tighter uppercase leading-none">{t.shop}</h2>
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] mt-2">DOŁADUJ SWÓJ BIZNES</p>
          </div>
          <button onClick={onClose} className="w-14 h-14 bg-white/5 hover:bg-white/10 flex items-center justify-center rounded-3xl transition-all border border-white/10 btn-press">
            <span className="text-3xl text-white">✕</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 pb-10 space-y-5 no-scrollbar">
          {bundles.map(item => (
            <div 
              key={item.id} 
              className={`relative overflow-hidden group p-8 rounded-[3rem] border-2 transition-all duration-500 flex items-center justify-between ${item.best ? 'border-yellow-500 bg-gradient-to-br from-yellow-500/10 to-transparent shadow-[0_0_40px_rgba(234,179,8,0.2)]' : 'border-white/5 bg-white/5'}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${item.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>

              {item.best && (
                <div className="absolute top-0 right-10 bg-yellow-500 text-yellow-950 px-6 py-1.5 text-[10px] font-black uppercase rounded-b-2xl shadow-lg">
                   {t.best_value}
                </div>
              )}

              <div className="flex items-center gap-8 relative z-10">
                <div className="text-6xl drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] transform group-hover:scale-110 group-hover:rotate-6 transition-transform">{item.icon}</div>
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">{item.name}</h3>
                  <div className="flex items-center gap-2 text-emerald-400 font-black">
                    <span className="text-3xl">$</span>
                    <span className="text-4xl">{item.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => {
                  alert(`Przekierowanie do bezpiecznej bramki płatniczej: ${item.price} PLN`);
                  onPurchase(item.amount);
                }}
                className={`relative h-16 px-10 rounded-2xl font-black text-sm transition-all btn-press shadow-2xl z-10 ${item.best ? 'bg-yellow-500 text-yellow-950 hover:bg-yellow-400 shimmer-premium' : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'}`}
              >
                {item.price} PLN
              </button>
            </div>
          ))}
          
          <div className="py-6 text-center">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-loose">
              ChefPay™ Secure Encryption Verified<br/>Wszystkie ceny zawierają podatek VAT (23%)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPanel;
