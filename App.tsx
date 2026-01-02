
import React, { useState, useEffect, useMemo } from 'react';
import { INITIAL_STATIONS, INITIAL_UPGRADES, DELIVERY_POINT } from './constants';
import { Station, Upgrade, Chef, Task } from './types';
import Header from './components/Header';
import UpgradePanel from './components/UpgradePanel';
import ShopPanel from './components/ShopPanel';
import RestaurantFloor from './components/RestaurantFloor';
import AuthScreen from './components/AuthScreen';
import SettingsPanel from './components/SettingsPanel';
import WorldMap from './components/WorldMap';
import SocialPanels from './components/SocialPanels';
import { authService, UserProfile } from './services/authService';
import { GoogleGenAI } from "@google/genai";
import { translations } from './translations';

interface MoneyPop {
  id: number;
  amount: number;
  x: number;
  y: number;
}

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(authService.getCurrentUser());
  const [view, setView] = useState<'kitchen' | 'world' | 'leaderboard' | 'chat'>('kitchen');
  const [money, setMoney] = useState<number>(0);
  const [gems, setGems] = useState<number>(10);
  const [stations, setStations] = useState<Station[]>(INITIAL_STATIONS);
  const [upgrades, setUpgrades] = useState<Upgrade[]>(INITIAL_UPGRADES);
  const [staffCount, setStaffCount] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showUpgrades, setShowUpgrades] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string>("");
  const [offlineEarnings, setOfflineEarnings] = useState<number | null>(null);
  const [moneyPops, setMoneyPops] = useState<MoneyPop[]>([]);
  
  // PWA Install Prompt Logic
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  // AI Agent States
  const [aiQuestionsUsed, setAiQuestionsUsed] = useState(0);
  const [isAiVip, setIsAiVip] = useState(false);
  const [showAiPaywall, setShowAiPaywall] = useState(false);

  const [language, setLanguage] = useState<string>(localStorage.getItem('lang') || 'pl');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const t = useMemo(() => translations[language] || translations.pl, [language]);

  const [chefs, setChefs] = useState<Chef[]>([
    { id: 'player', pos: { x: 50, y: 85 }, targetPos: null, state: 'idle', currentTaskId: null, progress: 0 }
  ]);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    });

    window.addEventListener('appinstalled', () => {
      setShowInstallBtn(false);
      setDeferredPrompt(null);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    setDeferredPrompt(null);
    setShowInstallBtn(false);
  };

  useEffect(() => {
    if (user) {
      const saved = authService.getUserData(user.id);
      if (saved) {
        setMoney(saved.money);
        setGems(saved.gems);
        setStations(saved.stations || INITIAL_STATIONS);
        setUpgrades(saved.upgrades || INITIAL_UPGRADES);
        setStaffCount(saved.staffCount || 0);
        setAiQuestionsUsed(saved.aiQuestionsUsed || 0);
        setIsAiVip(saved.isAiVip || false);

        const now = Date.now();
        const diff = (now - (saved.lastSaved || now)) / 1000;
        if (diff > 60) {
          const earned = Math.floor(Math.min(diff * 5, 50000));
          if (earned > 10) {
            setOfflineEarnings(earned);
            setMoney(m => m + earned);
          }
        }

        const newChefs: Chef[] = [{ id: 'player', pos: { x: 50, y: 85 }, targetPos: null, state: 'idle', currentTaskId: null, progress: 0 }];
        for (let i = 0; i < (saved.staffCount || 0); i++) {
          newChefs.push({
            id: `staff_${Date.now()}_${i}`, pos: { x: 50, y: 85 }, targetPos: null, state: 'idle', currentTaskId: null, progress: 0, isStaff: true
          });
        }
        setChefs(newChefs);
      }
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const timer = setInterval(() => {
        authService.saveUserData(user.id, {
          money, gems, stations, upgrades, staffCount, totalEarnings: money, lastSaved: Date.now(),
          aiQuestionsUsed, isAiVip
        });
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [user, money, gems, stations, upgrades, staffCount, aiQuestionsUsed, isAiVip]);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      const unlocked = stations.filter(s => s.unlocked);
      if (unlocked.length > 0 && tasks.length < 12) {
        const randomStation = unlocked[Math.floor(Math.random() * unlocked.length)];
        setTasks(prev => [...prev, {
          id: `${randomStation.id}_${Date.now()}_${Math.random()}`,
          stationId: randomStation.id, price: 0, duration: 1000
        }]);
      }
    }, 3500);
    return () => clearInterval(interval);
  }, [user, stations, tasks.length]);

  useEffect(() => {
    if (!user) return;
    const tickRate = 50;
    const interval = setInterval(() => {
      setChefs(prevChefs => prevChefs.map(chef => {
        const next = { ...chef };
        if (next.state === 'idle' && tasks.length > 0) {
          const takenTaskIds = prevChefs.map(c => c.currentTaskId).filter(id => id !== null);
          const availableTask = tasks.find(t => !takenTaskIds.includes(t.id));
          if (availableTask) {
            const station = stations.find(s => s.id === availableTask.stationId);
            if (station) {
              next.state = 'walking';
              next.targetPos = { x: station.x, y: station.y };
              next.currentTaskId = availableTask.id;
            }
          }
        }
        if (next.state === 'walking' && next.targetPos) {
          const dx = next.targetPos.x - next.pos.x;
          const dy = next.targetPos.y - next.pos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const speedMultiplier = upgrades.filter(u => u.purchased && u.type === 'speed').reduce((acc, u) => acc * u.multiplier, 1);
          const speed = (next.isStaff ? 2.8 : 4.0) * speedMultiplier;
          
          if (dist < speed) {
            next.pos = { ...next.targetPos };
            if (next.targetPos.x === DELIVERY_POINT.x && next.targetPos.y === DELIVERY_POINT.y) {
              if (next.currentTaskId) {
                setTasks(prev => prev.filter(t => t.id !== next.currentTaskId));
                const stationId = next.currentTaskId.split('_')[0];
                const station = stations.find(s => s.id === stationId);
                if (station) {
                   const priceMult = upgrades.filter(u => u.purchased && u.type === 'price').reduce((acc, u) => acc * u.multiplier, 1);
                   const earned = Math.floor(station.basePrice * station.level * priceMult);
                   setMoney(m => m + earned);
                   const popId = Date.now();
                   setMoneyPops(prev => [...prev, { id: popId, amount: earned, x: DELIVERY_POINT.x, y: DELIVERY_POINT.y }]);
                   setTimeout(() => setMoneyPops(prev => prev.filter(p => p.id !== popId)), 1000);
                }
              }
              next.state = 'idle';
              next.targetPos = null;
              next.currentTaskId = null;
            } else {
              next.state = 'cooking';
              next.progress = 0;
            }
          } else {
            next.pos = { x: next.pos.x + (dx / dist) * speed, y: next.pos.y + (dy / dist) * speed };
          }
        }
        if (next.state === 'cooking') {
          const station = stations.find(s => s.id === next.currentTaskId?.split('_')[0]);
          const baseDuration = station ? station.baseTime : 2000;
          const cookMultiplier = upgrades.filter(u => u.purchased && u.type === 'speed').reduce((acc, u) => acc * u.multiplier, 1);
          const machineMult = 1 + (station?.machineUpgrades || 0) * 0.2;
          const duration = baseDuration / (cookMultiplier * machineMult);
          next.progress += (tickRate / duration) * 100;
          if (next.progress >= 100) {
            next.state = 'walking';
            next.targetPos = DELIVERY_POINT;
            next.progress = 0;
          }
        }
        return next;
      }));
    }, tickRate);
    return () => clearInterval(interval);
  }, [user, tasks, stations, upgrades]);

  const getAiStrategy = async () => {
    if (!isAiVip && aiQuestionsUsed >= 10) {
      setShowAiPaywall(true);
      return;
    }

    setAiAdvice("Food idle Expert analizuje rynek...");
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const currentStations = stations.filter(s => s.unlocked).map(s => `${s.name} (Lvl ${s.level})`).join(', ');
      const unlockedCount = stations.filter(s => s.unlocked).length;
      const nextUnlock = stations.find(s => !s.unlocked);
      
      const prompt = `Twoje imię to Food idle. Jesteś najwybitniejszym doradcą finansowym w branży gastronomicznej. 
      Gracz ma obecnie: ${money} gotówki, ${gems} diamentów i ${staffCount} pracowników.
      Odblokowane stacje: ${currentStations}. 
      Następna stacja do odblokowania to ${nextUnlock ? nextUnlock.name : 'brak'} za ${nextUnlock ? nextUnlock.baseCost : 0}.
      Udziel graczowi jednej, niezwykle inteligentnej, profesjonalnej, ale i zabawnej porady strategicznej. 
      Jeśli ma wystarczająco pieniędzy na nową stację, krzycz na niego, żeby ją kupił. Jeśli nie, doradź w co zainwestować.
      Odpowiedz krótko i charyzmatycznie po polsku.`;

      const response = await ai.models.generateContent({ 
        model: 'gemini-3-flash-preview', 
        contents: prompt,
        config: {
          systemInstruction: "Nazywasz się Food idle. Jesteś genialnym i nieco aroganckim ekspertem od gier idle. Twoim celem jest sprawienie, by gracz stał się multimiliarderem."
        }
      });
      
      setAiAdvice(response.text || "Skup się na ulepszaniu najbardziej dochodowych dań!");
      if (!isAiVip) setAiQuestionsUsed(prev => prev + 1);
    } catch (e) { 
      setAiAdvice("Czas na ekspansję! Ulepszaj stacje o najwyższym mnożniku!"); 
    }
  };

  const buyAiVip = (type: 'monthly' | 'lifetime') => {
    alert(`Przekierowanie do płatności: ${type === 'monthly' ? '9.99 PLN' : '89.99 PLN'}`);
    setIsAiVip(true);
    setShowAiPaywall(false);
  };

  if (!user) return <AuthScreen onLogin={setUser} />;

  return (
    <div className={`flex flex-col h-screen max-w-[440px] mx-auto text-white shadow-2xl relative overflow-hidden font-fredoka bg-transparent`}>
      <Header money={money} gems={gems} user={user} onOpenSettings={() => setShowSettings(true)} onOpenShop={() => setShowShop(true)} />

      <main className="flex-1 relative">
        {view === 'kitchen' && (
          <RestaurantFloor 
            stations={stations} chefs={chefs} tasks={tasks}
            onStationClick={(id) => setTasks(prev => [...prev, { id: `${id}_${Date.now()}`, stationId: id, price: 0, duration: 1000 }])}
            onUpgradeMachine={(id) => {
              const s = stations.find(st => st.id === id);
              const cost = Math.floor(500 * Math.pow(2.5, s?.machineUpgrades || 0));
              if(money >= cost) {
                setMoney(m => m - cost);
                setStations(prev => prev.map(s => s.id === id ? { ...s, machineUpgrades: (s.machineUpgrades || 0) + 1 } : s));
              }
            }}
            onUpgrade={(id) => {
               const s = stations.find(st => st.id === id);
               if (s) {
                 const cost = Math.floor(s.basePrice * Math.pow(1.15, s.level + 1));
                 if (money >= cost) {
                   setMoney(m => m - cost);
                   setStations(prev => prev.map(st => st.id === id ? { ...st, level: st.level + 1 } : st));
                 }
               }
            }}
            onUnlock={(id) => {
               const s = stations.find(st => st.id === id);
               if (s && money >= s.baseCost) {
                 setMoney(m => m - s.baseCost);
                 setStations(prev => prev.map(st => st.id === id ? { ...st, unlocked: true, level: 1 } : st));
               }
            }}
            money={money} staffCost={Math.floor(1000 * Math.pow(2.2, staffCount))} onHireStaff={() => {
              const cost = Math.floor(1000 * Math.pow(2.2, staffCount));
              if (money >= cost) {
                setMoney(m => m - cost);
                setStaffCount(s => s + 1);
                setChefs(prev => [...prev, {
                  id: `staff_${Date.now()}`, pos: { x: 50, y: 85 }, targetPos: null, state: 'idle', currentTaskId: null, progress: 0, isStaff: true
                }]);
              }
            }} translations={t}
            language={language}
          />
        )}

        {view === 'world' && <WorldMap user={user} money={money} translations={t} />}
        {view === 'leaderboard' && <SocialPanels type="leaderboard" user={user} translations={t} />}
        {view === 'chat' && <SocialPanels type="chat" user={user} translations={t} />}

        {moneyPops.map(pop => (
          <div key={pop.id} className="money-pop pointer-events-none text-emerald-400 font-black text-2xl z-50" style={{ left: `${pop.x}%`, top: `${pop.y}%`, transform: 'translateX(-50%)' }}>
            +${pop.amount.toLocaleString()}
          </div>
        ))}

        {aiAdvice && (
          <div className="absolute top-4 left-4 right-4 bg-slate-900/95 backdrop-blur-2xl text-white p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100] animate-pop border-t-4 border-indigo-500">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🤖</span>
                <p className="font-black text-[10px] uppercase tracking-[0.2em] text-indigo-400">Agent Food idle</p>
              </div>
              <button onClick={() => setAiAdvice("")} className="text-white/30 hover:text-white transition-colors">✕</button>
            </div>
            <p className="font-bold text-sm leading-relaxed italic text-slate-100">"{aiAdvice}"</p>
          </div>
        )}

        {showAiPaywall && (
          <div className="absolute inset-0 bg-black/95 z-[200] flex items-center justify-center p-6 backdrop-blur-3xl animate-pop">
            <div className="w-full bg-slate-900 border-2 border-indigo-500 rounded-[3.5rem] p-10 text-center space-y-8 shadow-[0_0_80px_rgba(99,102,241,0.4)]">
              <div className="text-8xl animate-bounce">🤖💎</div>
              <div className="space-y-2">
                <h2 className="text-4xl font-black gradient-text-gold uppercase tracking-tighter italic leading-none">AI Agent Unlimited</h2>
                <p className="text-slate-500 font-bold text-xs tracking-widest uppercase">Wykorzystałeś darmowy pakiet porad</p>
              </div>
              <p className="text-slate-300 font-medium text-sm leading-relaxed">Odblokuj pełną moc Food idle AI i otrzymuj nielimitowane, spersonalizowane strategie rozwoju Twojego imperium!</p>
              
              <div className="space-y-3">
                <button onClick={() => buyAiVip('monthly')} className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-3xl shadow-xl transition-all btn-press flex justify-between px-8 items-center border-b-4 border-indigo-800">
                  <span className="text-lg">Premium 30 Dni</span>
                  <span className="bg-white/20 px-4 py-1.5 rounded-xl text-sm tracking-tight">9.99 PLN</span>
                </button>
                <button onClick={() => buyAiVip('lifetime')} className="w-full py-6 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-600 text-slate-950 font-black rounded-3xl shadow-2xl transition-all btn-press flex justify-between px-8 items-center border-b-4 border-orange-900">
                  <span className="text-xl italic">Dożywotni VIP</span>
                  <span className="bg-black/20 px-4 py-1.5 rounded-xl text-sm tracking-tight">89.99 PLN</span>
                </button>
              </div>
              <button onClick={() => setShowAiPaywall(false)} className="text-slate-500 font-bold text-[10px] uppercase tracking-widest hover:text-white transition-colors">Może później</button>
            </div>
          </div>
        )}

        {showInstallBtn && (
          <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-[250] animate-pop">
            <button 
              onClick={handleInstallClick}
              className="bg-indigo-600 text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl border-2 border-white/20 flex items-center gap-3 animate-pulse"
            >
              <span>📲 ZAINSTALUJ GRĘ NA PULPICIE</span>
            </button>
          </div>
        )}
      </main>

      <div className="absolute bottom-28 right-6 flex flex-col gap-4 z-50">
        <button onClick={getAiStrategy} className="relative w-16 h-16 bg-slate-900/80 backdrop-blur-xl rounded-[1.5rem] flex items-center justify-center shadow-2xl border-2 border-indigo-500/50 btn-press group overflow-hidden">
          <div className="absolute inset-0 bg-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <span className="text-3xl group-hover:rotate-12 transition-transform relative z-10">🧠</span>
          {!isAiVip && (
            <div className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-slate-950 shadow-lg animate-pulse">
              {10 - aiQuestionsUsed}
            </div>
          )}
        </button>
        <button onClick={() => setShowShop(true)} className="w-18 h-18 bg-gradient-to-tr from-yellow-500 to-amber-500 rounded-[2rem] flex items-center justify-center shadow-[0_15px_35px_rgba(234,179,8,0.4)] border-2 border-white/40 btn-press shimmer-premium">
          <span className="text-4xl">💰</span>
        </button>
      </div>

      <nav className="h-24 bg-slate-900/95 backdrop-blur-3xl border-t border-white/5 flex justify-around items-center px-6 z-50">
        <button onClick={() => {setView('kitchen'); setShowUpgrades(false)}} className={`flex flex-col items-center gap-1.5 transition-all ${view === 'kitchen' && !showUpgrades ? 'text-orange-500 scale-110 drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'text-slate-600 hover:text-slate-400'}`}>
          <span className="text-2xl">🍳</span>
          <span className="text-[9px] font-black uppercase tracking-widest">{t.kitchen}</span>
        </button>
        <button onClick={() => setView('world')} className={`flex flex-col items-center gap-1.5 transition-all ${view === 'world' ? 'text-blue-500 scale-110' : 'text-slate-600'}`}>
          <span className="text-2xl">🌍</span>
          <span className="text-[9px] font-black uppercase tracking-widest">{t.world}</span>
        </button>
        <div className="w-12 h-12"></div>
        <button onClick={() => setView('leaderboard')} className={`flex flex-col items-center gap-1.5 transition-all ${view === 'leaderboard' ? 'text-yellow-500 scale-110' : 'text-slate-600'}`}>
          <span className="text-2xl">🏆</span>
          <span className="text-[9px] font-black uppercase tracking-widest">{t.leaderboard}</span>
        </button>
        <button onClick={() => {setShowUpgrades(true); setView('kitchen')}} className={`flex flex-col items-center gap-1.5 transition-all ${showUpgrades ? 'text-emerald-500 scale-110' : 'text-slate-600'}`}>
          <span className="text-2xl">⚡</span>
          <span className="text-[9px] font-black uppercase tracking-widest">{t.bonuses}</span>
        </button>
      </nav>

      {showUpgrades && (
        <UpgradePanel 
          upgrades={upgrades} money={money} translations={t} theme={theme}
          onPurchase={(id) => {
            const up = upgrades.find(u => u.id === id);
            if (up && !up.purchased && money >= up.cost) {
              setMoney(m => m - up.cost);
              setUpgrades(prev => prev.map(u => u.id === id ? { ...u, purchased: true } : u));
            }
          }} onClose={() => setShowUpgrades(false)} 
        />
      )}

      {showShop && (
        <ShopPanel onPurchase={(amount) => { setMoney(m => m + amount); setShowShop(false); }} onClose={() => setShowShop(false)} translations={t} theme={theme} />
      )}

      {showSettings && (
        <SettingsPanel 
          user={user} language={language} setLanguage={setLanguage} theme={theme} setTheme={setTheme} translations={t}
          onLogout={() => { authService.logout(); setUser(null); setShowSettings(false); }} onClose={() => setShowSettings(false)} 
        />
      )}
    </div>
  );
};

export default App;
