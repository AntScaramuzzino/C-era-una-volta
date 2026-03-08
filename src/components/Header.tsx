import React from 'react';
import { BookOpen, Layout, Play, Settings, Info } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onStartGame: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onStartGame }) => {
  const tabs = [
    { id: 'DECK', label: 'Mazzo', icon: <Layout size={16}/> },
    { id: 'PLAY', label: 'La Tua Mano', icon: <Play size={16}/> },
    { id: 'SETTINGS', label: 'Opzioni', icon: <Settings size={16}/> },
    { id: 'RULES', label: 'Guida', icon: <Info size={16}/> }
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 no-print shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg">
            <BookOpen size={24}/>
          </div>
          <h1 className="font-black text-slate-900 tracking-tight text-xl hidden sm:block uppercase">
            C'era una volta... Online
          </h1>
        </div>
        <nav className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 font-medium">
          {tabs.map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)} 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.icon} <span className="hidden md:inline">{tab.label}</span>
            </button>
          ))}
        </nav>
        <button 
          onClick={onStartGame} 
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase hover:bg-indigo-700 active:scale-95 transition-all shadow-lg flex items-center gap-2"
          title="Estrai una nuova mano di carte"
        >
          <Play size={16}/> Estrai Mano
        </button>
      </div>
    </header>
  );
};
