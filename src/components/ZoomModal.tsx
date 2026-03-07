import React from 'react';
import { X } from 'lucide-react';
import { CardUI } from './CardUI';
import { CardData, Category } from '../types';

interface ZoomModalProps {
  zoomedCard: {
    card: CardData;
    cat: Category;
    img?: string | null;
    loading?: boolean;
  } | null;
  onClose: () => void;
}

export const ZoomModal: React.FC<ZoomModalProps> = ({ zoomedCard, onClose }) => {
  if (!zoomedCard) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md cursor-zoom-out no-print" 
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-sm animate-in zoom-in duration-300" 
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute -top-12 -right-4 text-white hover:text-indigo-400 p-2 transition-colors"
        >
          <X size={32} />
        </button>
        <CardUI 
          card={zoomedCard.card} 
          cat={zoomedCard.cat} 
          img={zoomedCard.img} 
          loading={zoomedCard.loading} 
          isZoomed 
        />
      </div>
    </div>
  );
};
