import React, { useState } from 'react';
import { DrawnCard } from '../types';
import { getCardImageUrl, CARD_BACK_URL } from '../constants';

interface TarotCardProps {
  card?: DrawnCard;
  isRevealed: boolean;
  onClick?: () => void;
  index: number;
  isSelected?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const TarotCard: React.FC<TarotCardProps> = ({ 
  card, 
  isRevealed, 
  onClick, 
  isSelected, 
  className,
  style 
}) => {
  
  const imageUrl = card ? getCardImageUrl(card) : '';
  const [imageError, setImageError] = useState(false);
  const [backError, setBackError] = useState(false);

  return (
    <div 
      onClick={onClick}
      className={`
        relative w-28 h-48 md:w-48 md:h-80 cursor-pointer perspective-1000 transition-all duration-500
        ${isSelected ? '-translate-y-6 shadow-[0_0_20px_#D4A523]' : 'hover:-translate-y-2'}
        ${className}
      `}
      style={style}
    >
      <div 
        className={`
          w-full h-full relative transform-style-3d transition-transform duration-1000 shadow-2xl
          ${isRevealed ? 'rotate-y-180' : ''}
        `}
      >
        {/* CARD BACK */}
        <div className="absolute w-full h-full backface-hidden rounded-xl overflow-hidden border border-gold-900 bg-mystic-950 flex items-center justify-center">
            
            {/* 1. Fallback CSS Layer (Always present, visible if image fails) */}
            <div className="absolute inset-0 w-full h-full bg-[#0a1025]">
                 <div className="absolute inset-0 w-full h-full bg-[radial-gradient(circle_at_center,_#172554_0%,_#020617_100%)]"></div>
                 <div className="absolute inset-0 w-full h-full opacity-30" style={{ backgroundImage: 'radial-gradient(#D4A523 1.5px, transparent 1.5px)', backgroundSize: '16px 16px' }}></div>
                 <div className="absolute inset-2 border border-[#D4A523]/40 rounded-sm"></div>
                 <div className="absolute inset-3 border border-[#D4A523]/20 rounded-sm"></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1/2 h-1/3 border border-[#D4A523]/30 rotate-45 transform scale-75"></div>
                    <div className="absolute w-1/2 h-1/3 border border-[#D4A523]/30 -rotate-45 transform scale-75"></div>
                 </div>
            </div>

            {/* 2. Image Layer (Overlays fallback, hides on error) */}
            <img 
              src={CARD_BACK_URL}
              alt="Card Back"
              className={`absolute w-full h-full object-cover rotate-90 scale-[1.6] origin-center opacity-90 transition-opacity duration-300`}
              style={{ display: backError ? 'none' : 'block' }}
              onError={() => setBackError(true)}
            />
            
            {/* Edge Shadow/Glow overlay */}
            <div className="absolute inset-0 shadow-[inset_0_0_15px_rgba(0,0,0,0.8)] z-10 pointer-events-none"></div>
        </div>

        {/* CARD FRONT */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-xl overflow-hidden bg-black shadow-gold-500/10 shadow-lg border border-gold-800">
           {card && (
             <div className="w-full h-full flex flex-col relative">
                
                {/* Image Container */}
                <div 
                  className={`relative flex-grow overflow-hidden transition-transform duration-700 ease-in-out bg-neutral-900 ${card.isReversed ? 'rotate-180' : ''}`}
                >
                  <img 
                    src={imageUrl} 
                    alt={card.name} 
                    className={`w-full h-full object-cover opacity-90 animate-fade-in transition-opacity duration-300`}
                    style={{ display: imageError ? 'none' : 'block' }}
                    loading="lazy"
                    onError={() => setImageError(true)}
                  />
                  {/* Fallback for Front Image failure */}
                  {imageError && (
                    <div className="absolute inset-0 flex items-center justify-center text-gold-500/30 font-serif text-2xl">
                      ✦
                    </div>
                  )}

                  {/* Inner shadow overlay */}
                  <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] pointer-events-none"></div>
                </div>

                {/* Text Content */}
                <div className="relative h-16 md:h-20 bg-gradient-to-t from-black via-black to-transparent flex flex-col items-center justify-end pb-2 md:pb-3 z-10">
                   <div className="text-gold-500/50 text-[8px] md:text-[10px] tracking-[0.3em] uppercase mb-0.5 md:mb-1">{card.isReversed ? '逆位' : '正位'}</div>
                   <h3 className="text-gold-100 font-serif text-xs md:text-sm lg:text-lg tracking-widest border-t border-gold-900/50 pt-1 px-2 md:px-4 text-center whitespace-nowrap overflow-hidden text-ellipsis w-full">{card.name}</h3>
                   <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-gold-900 to-transparent"></div>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default TarotCard;