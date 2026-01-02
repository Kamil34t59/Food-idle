
import React from 'react';
import { UserProfile } from '../services/authService';

interface SettingsProps {
  user: UserProfile;
  onLogout: () => void;
  onClose: () => void;
  language: string;
  setLanguage: (l: string) => void;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
  translations: any;
}

const SettingsPanel: React.FC<SettingsProps> = ({ user, onLogout, onClose, language, setLanguage, theme, setTheme, translations: t }) => {
  const languages = [
    { code: 'en', label: 'English 🇺🇸', flag: '🇺🇸' },
    { code: 'pl', label: 'Polski 🇵🇱', flag: '🇵🇱' },
    { code: 'de', label: 'Deutsch 🇩🇪', flag: '🇩🇪' },
    { code: 'zh', label: '中文 🇨🇳', flag: '🇨🇳' },
    { code: 'ja', label: '日本語 🇯🇵', flag: '🇯🇵' },
    { code: 'cs', label: 'Čeština 🇨🇿', flag: '🇨🇿' },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-6 backdrop-blur-sm animate-pop">
      <div className={`w-full max-w-sm rounded-[2.5rem] shadow-2xl p-8 overflow-y-auto max-h-[90vh] transition-colors ${theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black">{t.settings}</h2>
          <button onClick={onClose} className="p-2 hover:bg-black/10 rounded-full transition-colors">✕</button>
        </div>

        <div className="space-y-6">
          <div className={`flex items-center gap-4 p-4 rounded-2xl border-2 ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-100'}`}>
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-2xl text-white font-black shadow-lg">
              {user.username.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <div className="font-black truncate">{user.username}</div>
              <div className="text-xs opacity-50 font-bold truncate">{user.email}</div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase opacity-40 mb-2 block">{t.theme_light} / {t.theme_dark}</label>
              <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl">
                <button 
                  onClick={() => setTheme('light')}
                  className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${theme === 'light' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500'}`}
                >
                  {t.theme_light}
                </button>
                <button 
                  onClick={() => setTheme('dark')}
                  className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${theme === 'dark' ? 'bg-slate-700 text-orange-400 shadow-sm' : 'text-slate-500'}`}
                >
                  {t.theme_dark}
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase opacity-40 mb-2 block">{t.language}</label>
              <div className="grid grid-cols-2 gap-2">
                {languages.map(l => (
                  <button 
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    className={`py-2 px-3 rounded-xl text-[10px] font-black border-2 transition-all flex items-center justify-between ${language === l.code ? 'border-orange-500 bg-orange-50' : (theme === 'dark' ? 'border-slate-700 bg-slate-900 text-slate-400' : 'border-slate-100 bg-slate-50 text-slate-600')}`}
                  >
                    <span>{l.label}</span>
                    <span>{l.flag}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={onLogout}
            className="w-full py-4 bg-red-50 text-red-600 font-black rounded-2xl border-2 border-red-100 hover:bg-red-100 transition-all flex items-center justify-center gap-3"
          >
            <span>{t.logout}</span>
            <span>🚪</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
