import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookOpen, BarChart3, Clock, Layers, LogOut, ChevronRight, Play, Brain, Target, Zap } from 'lucide-react';
import { Card, UserProgress } from '../lib/dataService';
import { CATEGORIES } from '../lib/srs';
import { auth, signOut } from '../lib/firebase';

interface DashboardProps {
  cards: Card[];
  progress: UserProgress[];
  onStartStudy: (category?: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ cards, progress, onStartStudy }) => {
  const [stats, setStats] = useState({
    totalStudied: 0,
    dueToday: 0,
    retention: 0,
    totalCards: cards.length
  });

  useEffect(() => {
    const now = new Date();
    const studied = progress.length;
    const due = cards.filter(card => {
      const p = progress.find(pr => pr.cardId === card.id);
      return !p || p.nextReview <= now;
    }).length;

    const mastered = progress.filter(p => p.easeFactor > 2.3).length;
    const retention = studied > 0 ? Math.round((mastered / studied) * 100) : 0;

    setStats({
      totalStudied: studied,
      dueToday: due,
      retention,
      totalCards: cards.length
    });
  }, [cards, progress]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Welcome Header */}
      <div className="mb-12 border-b border-white/5 pb-8 relative">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
          <span className="text-[10px] font-mono text-blue-500 uppercase tracking-[0.3em]">Neural Interface Active</span>
        </div>
        <h1 className="text-5xl font-light text-white tracking-tight leading-none mb-4">
          Protocol <span className="italic font-serif">A.I. Mastery</span>
        </h1>
        <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest max-w-sm">
          Computational learning regimen for cognitive domain expansion.
        </p>
      </div>

      {/* Primary Action */}
      <div className="mb-16">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onStartStudy()}
          className="w-full relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-[#090e1a] border border-white/10 p-10 rounded-3xl flex flex-col md:flex-row items-center justify-between overflow-hidden">
            <div className="text-left mb-6 md:mb-0">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-blue-500 fill-blue-500/20" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Priority Queue</span>
              </div>
              <h2 className="text-3xl font-light text-white mb-1">Engage General Study</h2>
              <p className="text-slate-500 text-sm max-w-xs">Smart retrieval focusing on {stats.dueToday} critical review items and new concepts.</p>
            </div>
            <div className="flex flex-col items-center gap-3">
               <div className="bg-white text-black px-10 py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3 active:scale-95 transition-transform">
                 <Play className="w-4 h-4 fill-current" /> Initialize Session
               </div>
            </div>
          </div>
        </motion.button>
      </div>

      {/* Category Grid */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h3 className="text-white text-xl font-light">Subject Modules</h3>
          <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest mt-1">Available data structures for reinforcement</p>
        </div>
        <div className="h-px flex-1 mx-8 bg-white/5"></div>
        <div className="text-[10px] text-slate-500 font-mono uppercase">Total Subsets: {CATEGORIES.length}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {CATEGORIES.map((category, i) => {
          const categoryCards = cards.filter(c => c.category === category);
          const studiedInCategory = progress.filter(p => categoryCards.some(cc => cc.id === p.cardId)).length;
          const progressPercent = Math.round((studiedInCategory / categoryCards.length) * 100) || 0;

          return (
            <motion.button
              key={category}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + (i * 0.05) }}
              onClick={() => onStartStudy(category)}
              className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl text-left hover:border-blue-500/50 hover:bg-slate-800/40 transition-all group flex flex-col justify-between h-40"
            >
              <div className="flex justify-between items-start">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                  <Brain className="w-4 h-4" />
                </div>
                <div className="text-[9px] font-mono text-slate-600 bg-black/40 px-2 py-1 rounded uppercase">
                  {categoryCards.length} Cards
                </div>
              </div>
              
              <div>
                <h4 className="text-white text-lg font-light group-hover:text-blue-400 transition-colors mb-4">{category}</h4>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${progressPercent}%` }}
                    className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" 
                  />
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">Mastery Level</span>
                  <span className="text-[10px] text-blue-400 font-mono">{progressPercent}%</span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
