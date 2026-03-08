import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { CardData, Category } from '../types';

interface CardUIProps {
  card: CardData;
  cat: Category;
  img?: string | null;
  loading?: boolean;
  onGenerate?: () => void;
  isZoomed?: boolean;
  isMedium?: boolean;
}

export const CardUI: React.FC<CardUIProps> = ({ card, cat, img, loading, onGenerate, isZoomed = false, isMedium = false }) => {
  return (
    <div 
      className={`relative w-full aspect-[2.5/3.5] ${isZoomed ? 'p-6' : isMedium ? 'p-5' : 'p-2'} rounded-[1.5rem] border-[2px] shadow-lg flex flex-col ${cat.color} overflow-hidden transition-all duration-300 hover:shadow-2xl group`} 
      style={{ borderColor: cat.printColor }}
    >
      <div className="absolute inset-0 opacity-20 pointer-events-none print:block hidden rounded-[1.5rem]" style={{backgroundColor: cat.printColor}}></div>
      <div className={`flex justify-between items-start ${isZoomed ? 'mb-4' : 'mb-1'} relative z-10`}>
        <span className={`${isZoomed ? 'text-[11px]' : 'text-[7px]'} font-black tracking-[0.1em] uppercase opacity-80 px-2 py-0.5 bg-white/40 rounded-full border border-white/20 shadow-sm whitespace-nowrap`}>
          {cat.label}
        </span>
        <div className="flex items-center gap-1">
          {onGenerate && !img && !loading && (
            <button 
              onClick={(e) => { e.stopPropagation(); onGenerate(); }} 
              className="no-print p-1 bg-white/60 hover:bg-white text-indigo-600 rounded-full shadow-lg transition-all active:scale-90 border border-white/30"
              title="Genera illustrazione con IA"
            >
              <Sparkles size={12} />
            </button>
          )}
          <div className="opacity-90 p-1 bg-white/40 rounded-lg border border-white/20">
            {cat.icon}
          </div>
        </div>
      </div>
      
      <div className={`relative flex-grow bg-white/50 rounded-xl border border-white/60 overflow-hidden flex items-center justify-center ${isZoomed ? 'mb-4' : 'mb-1.5'} shadow-inner z-10`}>
        {loading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="animate-spin text-slate-400" />
            <span className="text-[7px] font-black uppercase text-slate-400 animate-pulse">AI...</span>
          </div>
        ) : img ? (
          <img src={img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-125 rounded-xl" alt={card.title} referrerPolicy="no-referrer" />
        ) : (
          <div className="flex flex-col items-center justify-center p-2 text-center opacity-10">
            <div className={`${isZoomed ? 'scale-[3]' : 'scale-[1.5]'} transform transition-transform duration-500`}>
              {cat.icon}
            </div>
          </div>
        )}
      </div>
      
      <div className={`bg-white/95 ${isZoomed ? 'p-5' : 'p-2'} rounded-xl border border-white shadow-md flex flex-col justify-center relative z-10 text-center font-bold`}>
        <h3 className={`${isZoomed ? 'text-lg' : isMedium ? 'text-sm' : 'text-[10px]'} font-black leading-tight text-slate-900 border-b border-slate-200 ${isZoomed ? 'pb-2 mb-2' : 'pb-0.5 mb-0.5'} uppercase tracking-tighter`}>
          {card.title}
        </h3>
        <p className={`${isZoomed ? 'text-xs' : 'text-[8.5px]'} font-medium text-slate-800 leading-tight`}>
          "{card.desc}"
        </p>
      </div>
      <div className={`absolute bottom-2 right-4 ${isZoomed ? 'text-[9px]' : 'text-[6px]'} font-black opacity-20 font-mono tracking-widest z-10 uppercase`}>
        #{card.cat.substring(0,3)}
      </div>
    </div>
  );
};
