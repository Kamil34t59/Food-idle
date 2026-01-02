
import React, { useState, useEffect, useRef } from 'react';
import { Station, Upgrade } from '../types';

interface StationProps {
  station: Station;
  onAction: (id: string, earned: number) => void;
  onUpgrade: (id: string) => void;
  onUnlock: (id: string) => void;
  canAffordUpgrade: boolean;
  canAffordUnlock: boolean;
  globalMultipliers: Upgrade[];
}

const StationComponent: React.FC<StationProps> = ({ 
  station, onAction, onUpgrade, onUnlock, canAffordUpgrade, canAffordUnlock, globalMultipliers 
}) => {
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [floats, setFloats] = useState<{ id: number; amount: number }[]>([]);
  const floatIdCounter = useRef(0);

  // Calculate stats based on level and multipliers
  const priceMultiplier = globalMultipliers
    .filter(u => u.type === 'price' && u.description.toLowerCase().includes(station.name.toLowerCase()))
    .reduce((acc, u) => acc * u.multiplier, 1);
  
  const speedMultiplier = globalMultipliers
    .filter(u => u.type === 'speed' && u.description.toLowerCase().includes(station.name.toLowerCase()))
    .reduce((acc, u) => acc * u.multiplier, 1);

  const currentPrice = Math.floor(station.basePrice * station.level * priceMultiplier);
  const currentDuration = Math.max(200, station.baseTime / speedMultiplier);
  const upgradeCost = Math.floor(station.basePrice * Math.pow(1.15, station.level + 1));

  useEffect(() => {
    let interval: any;
    if (isProcessing) {
      const startTime = Date.now();
      interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const p = Math.min((elapsed / currentDuration) * 100, 100);
        setProgress(p);
        
        if (p === 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setProgress(0);
          onAction(station.id, currentPrice);
          
          // Create floating text
          const id = ++floatIdCounter.current;
          setFloats(prev => [...prev, { id, amount: currentPrice }]);
          setTimeout(() => {
            setFloats(prev => prev.filter(f => f.id !== id));
          }, 1000);
          
          // Auto-start if it's high level (simulating staff)
          if (station.level > 10) {
            setTimeout(() => setIsProcessing(true), 100);
          }
        }
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isProcessing, currentDuration, currentPrice, station.id, onAction, station.level]);

  if (!station.unlocked) {
    return (
      <div className="bg-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center border-2 border-dashed border-slate-400 group">
        <span className="text-4xl grayscale mb-2">{station.icon}</span>
        <button 
          onClick={() => onUnlock(station.id)}
          disabled={!canAffordUnlock}
          className={`px-6 py-2 rounded-xl font-bold transition-all ${canAffordUnlock ? 'bg-indigo-600 text-white shadow-lg active:scale-95' : 'bg-slate-400 text-slate-100 cursor-not-allowed'}`}
        >
          Unlock for ${station.baseCost}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-md border-2 border-slate-100 flex items-center gap-4 relative">
      {/* Floating animations container */}
      <div className="absolute top-0 right-10 z-20 pointer-events-none">
        {floats.map(f => (
          <div key={f.id} className="money-float absolute text-emerald-600 font-bold text-xl">
            +${f.amount}
          </div>
        ))}
      </div>

      <div 
        className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-md cursor-pointer active:scale-95 transition-transform ${station.color}`}
        onClick={() => !isProcessing && setIsProcessing(true)}
      >
        {station.icon}
        {isProcessing && (
           <div className="absolute inset-0 bg-black/10 rounded-2xl flex items-center justify-center">
             <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
           </div>
        )}
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-bold text-slate-800 text-lg">{station.name} <span className="text-xs text-slate-400">LV.{station.level}</span></span>
          <span className="font-bold text-emerald-600">${currentPrice}</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
          <div 
            className={`h-full transition-all duration-75 ${station.color}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Upgrade Button */}
        <button 
          onClick={() => onUpgrade(station.id)}
          disabled={!canAffordUpgrade}
          className={`w-full py-1.5 rounded-lg font-bold text-sm transition-all flex justify-between px-3 ${canAffordUpgrade ? 'bg-yellow-400 text-yellow-900 shadow-sm active:scale-[0.98]' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
        >
          <span>Upgrade</span>
          <span>${upgradeCost}</span>
        </button>
      </div>
    </div>
  );
};

export default StationComponent;
