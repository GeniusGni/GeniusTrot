import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { AppState, DrawnCard } from './types';
import { FULL_DECK, SPREAD_POSITIONS, CARD_BACK_URL, getCardImageUrl } from './constants';
import { generateTarotReading } from './services/geminiService';
import TarotCard from './components/TarotCard';
import StarsBackground from './components/StarsBackground';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    step: 'intro',
    question: '',
    selectedIndices: [],
    drawnCards: [],
    interpretation: '',
    isStreaming: false,
    cardBackUrl: null, // Unused now, but kept in type
  });

  // DEBUG STATE
  const [imgLoadStatus, setImgLoadStatus] = useState<string>('Waiting...');
  const [imgLoadError, setImgLoadError] = useState<string>('');

  const [revealedCount, setRevealedCount] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic for streaming text
  useEffect(() => {
    if (state.isStreaming && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state.interpretation, state.isStreaming]);

  // Center the card fan when selecting starts
  useEffect(() => {
    if (state.step === 'selecting' && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      // Center the scroll view
      container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
    }
  }, [state.step]);

  const handleStart = () => {
    setState(prev => ({ ...prev, step: 'input' }));
  };

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.question.trim()) return;
    // Move to selection phase
    setState(prev => ({ ...prev, step: 'selecting' }));
  };

  const handleCardSelect = (index: number) => {
    if (state.selectedIndices.includes(index)) return;
    
    const newSelection = [...state.selectedIndices, index];
    setState(prev => ({ ...prev, selectedIndices: newSelection }));

    // If 3 cards selected, proceed to revealing
    if (newSelection.length === 3) {
       setTimeout(() => {
         finalizeDraw(newSelection);
       }, 1000); // Wait for animation
    }
  };

  const finalizeDraw = (indices: number[]) => {
     const deck = FULL_DECK;
     const drawn: DrawnCard[] = indices.map((deckIndex, i) => {
        const card = deck[deckIndex];
        const isReversed = Math.random() < 0.3; // Random orientation on draw
        return {
          ...card,
          isReversed,
          positionName: SPREAD_POSITIONS[i].name
        };
     });

     setState(prev => ({ ...prev, drawnCards: drawn, step: 'revealing' }));
  };

  const revealCard = async (index: number) => {
    if (index !== revealedCount) return; // Enforce order
    
    setRevealedCount(prev => prev + 1);

    // If all cards revealed, start reading
    if (index === 2) {
      setState(prev => ({ ...prev, step: 'reading', isStreaming: true }));
      try {
        const stream = await generateTarotReading(state.question, state.drawnCards);
        const reader = stream.getReader();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          setState(prev => ({
            ...prev,
            interpretation: prev.interpretation + value
          }));
        }
      } catch (error) {
        console.error("Reading failed", error);
        setState(prev => ({ ...prev, interpretation: prev.interpretation + "\n\n(Error: The spirits are silent. Please check your API connection.)" }));
      } finally {
        setState(prev => ({ ...prev, isStreaming: false }));
      }
    }
  };

  const reset = () => {
    setState(prev => ({
      step: 'input',
      question: '',
      selectedIndices: [],
      drawnCards: [],
      interpretation: '',
      isStreaming: false,
      cardBackUrl: null
    }));
    setRevealedCount(0);
    setImgLoadStatus('Waiting...');
    setImgLoadError('');
  };

  // --- Renderers ---

  const renderIntro = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 w-full max-w-md mx-auto animate-fade-in relative">
      
      {/* Mystical Symbol */}
      <div className="relative mb-16 animate-float">
         <div className="absolute inset-0 bg-gold-500 blur-[80px] opacity-10 rounded-full"></div>
         <svg className="w-32 h-32 md:w-48 md:h-48 text-gold-400 drop-shadow-[0_0_15px_rgba(212,165,35,0.5)]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
            {/* Abstract Moth / Eye Geometry */}
            <path d="M50 20 Q 80 5 90 30 Q 95 60 50 90 Q 5 60 10 30 Q 20 5 50 20 Z" fill="rgba(0,0,0,0.5)" />
            <path d="M50 35 Q 65 35 70 50 Q 65 65 50 65 Q 35 65 30 50 Q 35 35 50 35 Z" stroke="currentColor" fill="none" />
            <circle cx="50" cy="50" r="5" fill="currentColor" className="animate-pulse" />
            <path d="M10 30 Q 30 50 10 70 M 90 30 Q 70 50 90 70" stroke="currentColor" strokeOpacity="0.5" />
            <path d="M50 10 L 50 20 M 50 90 L 50 100" stroke="currentColor" />
         </svg>
      </div>

      <h1 className="text-5xl md:text-7xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-gold-100 to-gold-700 tracking-[0.3em] mb-20">
         TAROT
      </h1>

      <button 
        onClick={handleStart}
        className="group relative px-10 py-3 bg-transparent overflow-hidden transition-all duration-500 hover:tracking-[0.5em]"
      >
        <span className="absolute inset-0 border-y border-gold-800 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-center"></span>
        <span className="relative font-serif text-gold-400 tracking-[0.3em] text-sm group-hover:text-gold-100 transition-colors duration-500">ENTER</span>
      </button>
    </div>
  );

  const renderInput = () => (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-6 animate-fade-in">
      <div className="mb-8 text-gold-500 opacity-50 text-6xl font-serif">❝</div>
      <form onSubmit={handleQuestionSubmit} className="w-full flex flex-col items-center gap-8">
        <input
          type="text"
          value={state.question}
          onChange={(e) => setState(prev => ({ ...prev, question: e.target.value }))}
          placeholder="What does your soul seek..."
          className="w-full bg-transparent border-b border-gold-900/50 text-gold-100 text-3xl pb-4 focus:outline-none focus:border-gold-500/50 transition-colors text-center font-serif placeholder-gold-900/40"
          autoFocus
        />
        <button 
          type="submit"
          disabled={!state.question.trim()}
          className="mt-4 text-gold-600 hover:text-gold-200 uppercase tracking-[0.2em] text-xs transition-colors disabled:opacity-0"
        >
          Begin The Ritual
        </button>
      </form>
    </div>
  );

  const renderSelection = () => {
    // Generate a fan layout
    return (
      <div className="flex flex-col items-center justify-center h-full w-full animate-fade-in relative overflow-hidden">
        
        {/* --- DEBUG CONSOLE --- */}
        <div className={`absolute top-24 left-1/2 transform -translate-x-1/2 z-50 p-4 rounded border text-xs font-mono max-w-lg w-full ${imgLoadStatus === 'Loaded Success' ? 'bg-green-900/80 border-green-500' : 'bg-red-900/90 border-red-500 text-white'}`}>
            <div className="font-bold underline mb-1">IMAGE ASSET DEBUGGER</div>
            <div><strong>Trying Path:</strong> {CARD_BACK_URL}</div>
            <div><strong>Status:</strong> {imgLoadStatus}</div>
            {imgLoadError && <div><strong>Error Details:</strong> {imgLoadError}</div>}
            <div className="mt-2 opacity-70 italic">If red, the path is wrong. Check if 'public/asset/card_back.jpg' exists.</div>
        </div>
        {/* --------------------- */}

        <h3 className="text-gold-400 font-serif tracking-widest text-sm mb-8 uppercase opacity-80 z-20 mt-32">
          Select {3 - state.selectedIndices.length} Cards
        </h3>
        
        {/* Scrollable Container for the spread */}
        <div 
          ref={scrollContainerRef}
          className="w-full max-w-[100vw] overflow-x-auto overflow-y-hidden pb-12 px-12 perspective-1000 no-scrollbar"
        >
           <div 
             className="flex items-end min-w-max h-96 pl-[50%] pr-[50%] pt-20"
             style={{ width: `${FULL_DECK.length * 40}px` }} 
            >
              {FULL_DECK.map((_, i) => {
                const isSelected = state.selectedIndices.includes(i);
                
                // Fan calculations
                const angle = (i - 39) * 0.8; // Rotation angle
                const yOffset = Math.abs(i - 39) * 1.5; // Arch effect
                
                return (
                  <div 
                    key={i}
                    className="relative -ml-12 md:-ml-16 transition-all duration-500 origin-bottom"
                    style={{
                      zIndex: i,
                      transform: `rotate(${angle}deg) translateY(${yOffset}px)`,
                      transformOrigin: '50% 150%'
                    }}
                  >
                     <div
                        onClick={() => handleCardSelect(i)}
                        className={`
                          w-24 h-40 md:w-36 md:h-60 rounded-lg bg-mystic-950 border border-gold-900 shadow-2xl overflow-hidden cursor-pointer
                          transition-all duration-700 ease-out relative
                          ${isSelected ? '-translate-y-96 opacity-0 rotate-12' : 'hover:-translate-y-12 hover:shadow-[0_0_20px_#D4A523]'}
                        `}
                     >
                        {/* Image Based Card Back with Fallback */}
                         <div className="absolute inset-0 flex items-center justify-center bg-mystic-950">
                            
                            {/* Fallback Layer */}
                            <div className="absolute inset-0 w-full h-full bg-[#0a1025]">
                                <div className="absolute inset-0 w-full h-full bg-[radial-gradient(circle_at_center,_#172554_0%,_#020617_100%)]"></div>
                                <div className="absolute inset-0 w-full h-full opacity-30" style={{ backgroundImage: 'radial-gradient(#D4A523 1.5px, transparent 1.5px)', backgroundSize: '16px 16px' }}></div>
                                <div className="absolute inset-2 border border-[#D4A523]/40 rounded-sm"></div>
                                <div className="absolute inset-3 border border-[#D4A523]/20 rounded-sm"></div>
                            </div>

                            {/* Image Layer - Hides itself on error via class, revealing fallback */}
                            <img 
                              src={CARD_BACK_URL}
                              alt="Card Back"
                              className="absolute w-full h-full object-cover rotate-90 scale-[1.6] origin-center opacity-90"
                              onLoad={() => {
                                  setImgLoadStatus('Loaded Success');
                                  setImgLoadError('');
                              }}
                              onError={(e) => {
                                 e.currentTarget.style.display = 'none'; // HIDE IMAGE ON ERROR
                                 setImgLoadStatus('FAILED');
                                 setImgLoadError('Image onerror event triggered. File not found (404).');
                                 console.error('Card back failed to load:', CARD_BACK_URL);
                              }}
                            />
                            
                            {/* Edge Shadow/Glow overlay */}
                            <div className="absolute inset-0 shadow-[inset_0_0_15px_rgba(0,0,0,0.8)] z-10 pointer-events-none"></div>
                         </div>
                     </div>
                  </div>
                )
              })}
           </div>
        </div>

        {/* Selected placeholders */}
        <div className="flex gap-6 mt-8 h-32 items-center justify-center z-20">
           {[0, 1, 2].map(i => (
             <div key={i} className={`w-16 h-24 border border-gold-900/30 rounded flex items-center justify-center transition-all duration-500 ${state.selectedIndices[i] !== undefined ? 'bg-gold-900/20 border-gold-500/50 shadow-[0_0_15px_rgba(212,165,35,0.2)]' : ''}`}>
                {state.selectedIndices[i] !== undefined && <span className="text-gold-500 text-[10px] tracking-widest">✦</span>}
             </div>
           ))}
        </div>
      </div>
    )
  };

  const renderSpread = () => (
    <div className="flex flex-col w-full max-w-6xl mx-auto p-4 md:p-8 animate-fade-in items-center">
      {/* Cards Area - Horizontal Row */}
      <div className="flex flex-row gap-2 md:gap-8 mb-16 items-center justify-center w-full max-w-full overflow-visible">
        {state.drawnCards.map((card, index) => (
          <div key={index} className="flex flex-col items-center gap-4 group flex-shrink-0">
             <div className="text-gold-600 font-serif uppercase tracking-[0.2em] text-[8px] md:text-[10px]">
               {index < revealedCount ? card.positionName : `Card ${index + 1}`}
             </div>
             
             <TarotCard 
               index={index}
               card={card}
               isRevealed={index < revealedCount}
               onClick={() => revealCard(index)}
               className={index === revealedCount ? 'animate-pulse-glow ring-1 ring-gold-500/30' : ''}
             />
             
             {index === revealedCount && (
               <div className="text-gold-500/50 text-xs tracking-widest cursor-pointer mt-2" onClick={() => revealCard(index)}>
                 [ REVEAL ]
               </div>
             )}
          </div>
        ))}
      </div>

      {/* Reading Area */}
      {(state.step === 'reading' || revealedCount === 3) && (
        <div className="w-full max-w-3xl mx-auto relative">
           {/* Decorative Divider */}
           <div className="flex items-center justify-center mb-8">
              <div className="h-px bg-gradient-to-r from-transparent via-gold-700 to-transparent w-full max-w-xs"></div>
              <div className="mx-4 text-gold-500 text-xl">✦</div>
              <div className="h-px bg-gradient-to-r from-transparent via-gold-700 to-transparent w-full max-w-xs"></div>
           </div>

           <div className="prose prose-invert prose-p:font-body prose-headings:font-serif prose-headings:text-gold-300 prose-p:text-gray-300 prose-strong:text-gold-400 max-w-none text-lg leading-relaxed text-justify px-4">
             {state.interpretation.split('\n').map((line, i) => {
               // Simple markdown parsing for bold
               const parts = line.split('**');
               return (
                 <p key={i} className="mb-4">
                   {parts.map((part, index) => 
                     index % 2 === 1 ? <strong key={index} className="font-semibold">{part}</strong> : part
                   )}
                 </p>
               )
             })}
             {state.isStreaming && <span className="inline-block w-1.5 h-4 ml-1 bg-gold-500 animate-pulse"></span>}
           </div>
          
          <div ref={bottomRef}></div>

          {!state.isStreaming && state.interpretation && (
             <div className="mt-12 mb-20 flex justify-center">
               <button onClick={reset} className="px-8 py-3 border border-gold-900/50 text-gold-600 hover:text-gold-200 hover:border-gold-500 transition-all duration-500 font-serif text-sm tracking-[0.2em] rounded-sm">
                 CLOSE SESSION
               </button>
             </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-mystic-950 text-neutral-200 selection:bg-gold-900 selection:text-white">
      <StarsBackground />
      
      {/* Dynamic Background Gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-900/5 via-mystic-950 to-mystic-950 pointer-events-none z-0"></div>

      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header - small except intro */}
        {state.step !== 'intro' && (
           <header className="w-full p-6 flex justify-between items-center fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-mystic-950 to-transparent pointer-events-none">
             <div className="text-gold-600 font-serif tracking-[0.1em] text-xs pointer-events-auto cursor-pointer opacity-70 hover:opacity-100 transition-opacity" onClick={reset}>MYSTIC ECHOES</div>
             {state.question && <div className="hidden md:block text-gold-800 text-xs font-serif tracking-widest uppercase">{state.question}</div>}
           </header>
        )}

        {/* Dynamic Body */}
        <main className="flex-grow flex flex-col items-center justify-center relative pt-20">
          {state.step === 'intro' && renderIntro()}
          {state.step === 'input' && renderInput()}
          {state.step === 'selecting' && renderSelection()}
          {(state.step === 'revealing' || state.step === 'reading') && renderSpread()}
        </main>
      </div>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);