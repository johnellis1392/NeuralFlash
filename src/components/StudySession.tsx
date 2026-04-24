import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, RotateCcw, CheckCircle2, XCircle, Info, Home, RefreshCw, Clock, Check, Star } from 'lucide-react';
import { Card, UserProgress, updateProgress } from '../lib/dataService';
import { FlashCardContent } from './FlashCardContent';
import { auth } from '../lib/firebase';

interface StudySessionProps {
  cards: Card[];
  progress: UserProgress[];
  onFinish: () => void;
}

export const StudySession: React.FC<StudySessionProps> = ({ cards, progress, onFinish }) => {
  const [sessionCards, setSessionCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const now = new Date();
    
    // Sort cards into "due" and "new"
    const dueCards: Card[] = [];
    const newCards: Card[] = [];

    cards.forEach(card => {
      const p = progress.find(pr => pr.cardId === card.id);
      if (!p) {
        newCards.push(card);
      } else if (p.nextReview <= now) {
        dueCards.push(card);
      }
    });

    // Limit new cards per session
    const processedNew = newCards.sort(() => Math.random() - 0.5).slice(0, 5);
    const processedDue = dueCards.sort(() => Math.random() - 0.5);
    
    const combined = [...processedDue, ...processedNew].slice(0, 20);
    setSessionCards(combined);
  }, [cards, progress]);

  const currentCard = sessionCards[currentIndex];
  const currentProgress = currentCard ? progress.find(p => p.cardId === currentCard.id) : undefined;

  const handleQuality = async (quality: number) => {
    if (!auth.currentUser || !currentCard) return;

    await updateProgress(auth.currentUser.uid, currentCard.id, quality, currentProgress);
    
    if (currentIndex < sessionCards.length - 1) {
      setIsFlipped(false);
      setCurrentIndex(prev => prev + 1);
    } else {
      onFinish();
    }
  };

  if (sessionCards.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
        <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
        </div>
        <h2 className="text-3xl font-light text-white mb-2">Subject Mastery Confirmed</h2>
        <p className="text-slate-500 max-w-xs mx-auto mb-8">No more data points required for this computation cycle.</p>
        <button 
          onClick={onFinish}
          className="px-8 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-full hover:bg-slate-200 transition"
        >
          Return to Hub
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
      {/* Subject Header */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center">
        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Active Subject</div>
        <div className="text-sm text-blue-400 font-medium">{currentCard.category}</div>
      </div>

      {/* The Flashcard */}
      <div className="w-full max-w-2xl group">
        <div className="relative perspective-1000 aspect-[1.6/1]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCard.id + isFlipped}
              initial={{ opacity: 0, rotateY: isFlipped ? -5 : 5, y: 10 }}
              animate={{ opacity: 1, rotateY: 0, y: 0 }}
              exit={{ opacity: 0, rotateY: isFlipped ? 5 : -5, y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full h-full bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl relative flex flex-col overflow-hidden"
            >
              {/* Decorative top gradient */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
              
              {/* Card Meta Bar */}
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20">
                <span className="text-[10px] font-mono text-blue-400 tracking-tighter uppercase">
                  NODE_{currentCard.id.slice(-4).toUpperCase()} | {isFlipped ? "RESPONSE" : "PROMPT"}
                </span>
                <div className="flex gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${currentIndex >= sessionCards.length * 0.3 ? 'bg-blue-500' : 'bg-slate-700'}`}></div>
                  <div className={`w-1.5 h-1.5 rounded-full ${currentIndex >= sessionCards.length * 0.6 ? 'bg-blue-500' : 'bg-slate-700'}`}></div>
                  <div className={`w-1.5 h-1.5 rounded-full ${currentIndex >= sessionCards.length * 0.9 ? 'bg-blue-500' : 'bg-slate-700'}`}></div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col items-center justify-center px-8 md:px-16 overflow-y-auto pt-8 pb-4">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-6 block font-bold">
                  {isFlipped ? "Output Verification" : "Concept Logic"}
                </span>
                
                <div className="w-full">
                  <FlashCardContent 
                    content={isFlipped ? currentCard.back : currentCard.front} 
                    className="text-center text-white font-light text-2xl md:text-3xl leading-snug"
                  />
                </div>
              </div>

              {/* Reveal/Status Bar */}
              <div className="p-6 bg-black/40 flex justify-center border-t border-white/5">
                {!isFlipped ? (
                  <button 
                    onClick={() => setIsFlipped(true)}
                    className="px-10 py-3 bg-white text-black font-bold uppercase tracking-widest rounded-full text-[10px] hover:bg-blue-400 hover:text-white transition-all shadow-lg active:scale-95"
                  >
                    Reveal Solution
                  </button>
                ) : (
                  <div className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-mono">
                    Awaiting Rating Input...
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Regimen Controls */}
      <div className="h-24 mt-12 flex items-center justify-center">
        <AnimatePresence>
          {isFlipped && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-8 items-center"
            >
              <div className="text-center group">
                <button
                  onClick={() => handleQuality(1)}
                  className="w-14 h-14 rounded-full border border-red-500/30 bg-red-500/5 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg hover:shadow-red-500/20"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <span className="block mt-2 text-[9px] text-slate-500 uppercase font-bold tracking-wider group-hover:text-red-400 transition-colors">Again (2m)</span>
              </div>

              <div className="text-center group">
                <button
                  onClick={() => handleQuality(3)}
                  className="w-14 h-14 rounded-full border border-yellow-500/30 bg-yellow-500/5 flex items-center justify-center text-yellow-500 hover:bg-yellow-500 hover:text-white transition-all shadow-lg hover:shadow-yellow-500/20"
                >
                  <Clock className="w-5 h-5" />
                </button>
                <span className="block mt-2 text-[9px] text-slate-500 uppercase font-bold tracking-wider group-hover:text-yellow-400 transition-colors">Hard (2d)</span>
              </div>

              <div className="text-center group">
                <button
                  onClick={() => handleQuality(5)}
                  className="w-14 h-14 rounded-full border border-green-500/30 bg-green-500/5 flex items-center justify-center text-green-500 hover:bg-green-500 hover:text-white transition-all shadow-lg hover:shadow-green-500/20"
                >
                  <Check className="w-5 h-5" />
                </button>
                <span className="block mt-2 text-[9px] text-slate-500 uppercase font-bold tracking-wider group-hover:text-green-400 transition-colors">Good (4d)</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-6 flex flex-col items-center gap-4">
        <div className="flex gap-4 items-center">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-600 uppercase font-mono tracking-tighter">Session Progress</span>
            <div className="text-sm font-mono text-slate-400">{currentIndex + 1} / {sessionCards.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
