
import React, { useState, useEffect } from 'react';
import { authService, UserProfile } from '../services/authService';

interface AuthScreenProps {
  onLogin: (user: UserProfile) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'phone' | 'verify' | 'help'>('login');
  const [cookingStage, setCookingStage] = useState<'falling' | 'splat' | 'frying' | 'sizzled'>('falling');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [vCode, setVCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [smsLog, setSmsLog] = useState<string[]>([]);

  useEffect(() => {
    let timer: number;
    if (cookingStage === 'falling') {
      timer = window.setTimeout(() => setCookingStage('splat'), 1000);
    } else if (cookingStage === 'splat') {
      timer = window.setTimeout(() => setCookingStage('frying'), 700);
    } else if (cookingStage === 'frying') {
      timer = window.setTimeout(() => setCookingStage('sizzled'), 3500);
    }
    return () => window.clearTimeout(timer);
  }, [cookingStage]);

  const handleSuccess = (user: UserProfile) => {
    setIsSuccess(true);
    setTimeout(() => {
      onLogin(user);
    }, 2800);
  };

  const simulateSmsSending = (code: string) => {
    const logs = [
      "Inicjalizacja bramki Food idle SMS...",
      "Łączenie z nadajnikiem GSM: +48 " + phone + "...",
      "Weryfikacja strefy czasowej...",
      "Szyfrowanie 256-bit AES...",
      "Generowanie tokena dostępu...",
      "WYSŁANO POWIADOMIENIE SMS!"
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      setSmsLog(prev => [...prev, logs[i]]);
      i++;
      if (i >= logs.length) {
        clearInterval(interval);
        setTimeout(() => {
          setLoading(false);
          setMode('verify');
          if (window.Notification && Notification.permission === "granted") {
            new Notification("Food idle", { body: `Twój tajny kod dostępu: ${code}` });
          } else {
            alert(`[FOOD IDLE SECURITY]\nTwój kod weryfikacyjny wysłany na numer ${phone}: ${code}`);
          }
        }, 800);
      }
    }, 450);
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 9) {
      alert("Wpisz poprawny numer telefonu!");
      return;
    }
    setLoading(true);
    setSmsLog([]);
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setSentCode(code);
    simulateSmsSending(code);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (vCode === sentCode) {
      handleSuccess(authService.register(`Szef_${phone.slice(-3)}`, `user_${phone}@foodidle.io`, `pass_${phone}`));
    } else {
      alert("Nieprawidłowy kod!");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'register') {
      if (password.length < 4) {
        alert("Hasło musi mieć min. 4 znaki!");
        return;
      }
      handleSuccess(authService.register(username, email, password));
    } else if (mode === 'login') {
      const user = authService.login(email, password);
      if (user) handleSuccess(user);
      else alert("Błędne dane!");
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#020617] animate-in fade-in duration-700">
        <div className="relative flex flex-col items-center">
          <div className="absolute inset-0 bg-indigo-500 blur-[120px] opacity-30 animate-pulse scale-150"></div>
          <div className="relative text-center space-y-8 animate-pop p-10">
            <div className="text-[120px] drop-shadow-[0_0_50px_rgba(255,255,255,0.4)] animate-bounce">👑</div>
            <div className="space-y-2">
              <h2 className="text-6xl font-black text-white italic tracking-tighter uppercase">WITAJ SZEFIE!</h2>
              <p className="text-xl font-black text-indigo-400 uppercase tracking-widest">Twoje imperium jest gotowe</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 overflow-hidden">
      <div className="w-full max-w-md glass-premium rounded-[3rem] p-10 space-y-8 z-10 animate-pop relative border-white/10 shadow-2xl overflow-y-auto max-h-[95vh] no-scrollbar">
        <div className="text-center space-y-2">
          {/* Pan Container z akceleracją GPU */}
          <div className={`w-28 h-28 bg-white/5 rounded-[2.5rem] mx-auto flex items-center justify-center text-6xl shadow-xl border border-white/10 relative overflow-hidden transition-all duration-300 gpu-boost ${cookingStage !== 'falling' ? 'animate-pan-impact' : ''}`}>
             {mode === 'help' ? '❓' : (
               <div key={`stage-${cookingStage}`} className="relative w-full h-full flex items-center justify-center gpu-boost">
                 {cookingStage === 'falling' && (
                   <span className="animate-egg-fall gpu-boost">🥚</span>
                 )}
                 {(cookingStage === 'splat' || cookingStage === 'frying') && (
                   <div className="relative flex flex-col items-center justify-center gpu-boost">
                      <span className={`${cookingStage === 'splat' ? 'animate-egg-splat' : 'animate-frying-raw'} gpu-boost`}>
                        🥚
                      </span>
                      <div className="absolute -bottom-6 w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full frying-progress" style={{ width: '100%', transition: 'width 4s linear' }}></div>
                      </div>
                   </div>
                 )}
                 {cookingStage === 'sizzled' && (
                   <div className="relative flex items-center justify-center gpu-boost">
                      <span className="animate-boil gpu-boost">🍳</span>
                      <span className="steam-bubble" style={{ left: '10%', animationDelay: '0s' }}>💨</span>
                      <span className="steam-bubble" style={{ left: '50%', animationDelay: '0.4s' }}>✨</span>
                      <span className="steam-bubble" style={{ left: '80%', animationDelay: '0.8s' }}>♨️</span>
                   </div>
                 )}
               </div>
             )}
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase">
            FOOD <span className="gradient-text-gold italic">IDLE</span>
          </h1>
        </div>

        {loading ? (
          <div className="space-y-6 py-4">
            <div className="flex flex-col items-center">
               <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6"></div>
               <div className="w-full bg-black/60 rounded-2xl p-4 font-mono text-[9px] text-emerald-400 min-h-[140px] border border-emerald-500/20 shadow-inner">
                 {smsLog.map((log, idx) => (
                   <div key={idx} className="animate-in slide-in-from-left duration-200">SYSTEM: {log}</div>
                 ))}
                 <div className="mt-2 h-1 bg-emerald-500/20 w-full rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500 animate-[shimmer-bg_2s_infinite]"></div>
                 </div>
               </div>
            </div>
          </div>
        ) : mode === 'help' ? (
          <div className="space-y-6 text-slate-100 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-4 shadow-inner">
              <div className="space-y-2">
                <h3 className="text-indigo-400 font-black text-xs uppercase tracking-widest">Jak założyć konto?</h3>
                <ol className="text-xs space-y-2 font-medium opacity-80 list-decimal pl-4">
                  <li>Kliknij kolorowy przycisk <span className="text-white font-black">"STWÓRZ NOWE KONTO"</span> poniżej.</li>
                  <li>Wpisz swoją nazwę szefa, adres email oraz bezpieczne hasło.</li>
                  <li>Kliknij <span className="text-white font-black">"ROZPOCZNIJ GRĘ"</span>, aby stworzyć swój profil.</li>
                </ol>
              </div>
              <div className="h-[1px] bg-white/5 w-full"></div>
              <div className="space-y-2">
                <h3 className="text-yellow-500 font-black text-xs uppercase tracking-widest">Jak się zalogować?</h3>
                <ol className="text-xs space-y-2 font-medium opacity-80 list-decimal pl-4">
                  <li>Wpisz swój zarejestrowany adres email oraz hasło w formularzu głównym.</li>
                  <li>Kliknij <span className="text-white font-black">"ROZPOCZNIJ GRĘ"</span>.</li>
                  <li>Alternatywnie użyj <span className="text-indigo-400 font-bold">Logowania SMS</span>, jeśli przypisałeś numer do konta.</li>
                </ol>
              </div>
            </div>
            <button 
              onClick={() => setMode('login')} 
              className="w-full h-12 bg-white/10 rounded-2xl hover:bg-white/20 transition-all text-xs font-black uppercase tracking-widest"
            >
              Wróć do logowania
            </button>
          </div>
        ) : mode === 'verify' ? (
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Wpisz kod z SMS</p>
              <input 
                type="text" maxLength={4} placeholder="0 0 0 0" required autoFocus
                className="w-full h-14 text-center text-4xl tracking-[0.5em] rounded-2xl bg-white/5 border-2 border-indigo-500 outline-none font-black text-white" 
                value={vCode} onChange={e => setVCode(e.target.value)} 
              />
            </div>
            <button type="submit" className="w-full h-14 animate-rgb-chroma text-black font-black text-lg rounded-2xl shadow-xl active:scale-95 transition-all uppercase tracking-tighter">
              ROZPOCZNIJ GRĘ
            </button>
          </form>
        ) : mode === 'phone' ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] text-slate-500 font-black uppercase ml-4">Numer telefonu (+48)</label>
              <input 
                type="tel" placeholder="000 000 000" required 
                className="w-full h-14 px-8 rounded-2xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none font-bold text-white shadow-inner text-xl" 
                value={phone} onChange={e => setPhone(e.target.value)} 
              />
            </div>
            <button type="submit" className="w-full h-14 animate-rgb-chroma text-black font-black text-lg rounded-2xl shadow-xl active:scale-95 transition-all uppercase tracking-tighter">
              WYŚLIJ KOD SMS
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <input 
                type="text" placeholder="Imię Twojego Szefa" required 
                className="w-full h-14 px-8 rounded-2xl bg-white/5 border border-white/10 focus:border-yellow-500 outline-none font-bold text-white shadow-inner" 
                value={username} onChange={e => setUsername(e.target.value)} 
              />
            )}
            <input 
              type="email" placeholder="Email" required 
              className="w-full h-14 px-8 rounded-2xl bg-white/5 border border-white/10 focus:border-yellow-500 outline-none font-bold text-white shadow-inner" 
              value={email} onChange={e => setEmail(e.target.value)} 
            />
            <input 
              type="password" placeholder="Hasło" required 
              className="w-full h-14 px-8 rounded-2xl bg-white/5 border border-white/10 focus:border-yellow-500 outline-none font-bold text-white shadow-inner" 
              value={password} onChange={e => setPassword(e.target.value)} 
            />

            <button type="submit" className="w-full h-14 animate-rgb-chroma text-black font-black text-lg rounded-2xl shadow-2xl active:scale-95 transition-all uppercase tracking-tighter mt-4 flex items-center justify-center gap-2">
              <span>ROZPOCZNIJ GRĘ</span>
              <span>🚀</span>
            </button>
          </form>
        )}

        {mode !== 'help' && (
          <div className="p-4 bg-black/40 backdrop-blur-md rounded-3xl border border-white/5 space-y-4">
              {mode === 'login' && (
                <div className="flex justify-between px-2">
                  <button onClick={() => setMode('help')} className="text-[9px] font-black text-slate-500 hover:text-white uppercase transition-colors">POMOCY!</button>
                  <button onClick={() => setMode('phone')} className="text-[9px] font-black text-indigo-400 hover:text-white uppercase transition-colors flex items-center gap-2">📱 LOGOWANIE SMS</button>
                </div>
              )}
              {mode !== 'verify' && (
                <button 
                  onClick={() => {
                    setMode(mode === 'login' ? 'register' : 'login');
                    setCookingStage('falling'); // Reset animacji przy zmianie trybu
                  }} 
                  className="w-full h-10 animate-rgb-chroma text-black rounded-xl active:scale-95 transition-all flex items-center justify-center"
                >
                  <span className="text-[9px] uppercase tracking-widest font-black">
                    {mode === 'login' ? 'STWÓRZ NOWE KONTO' : 'WRÓĆ DO LOGOWANIA'}
                  </span>
                </button>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthScreen;
