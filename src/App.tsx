/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, signIn } from './lib/firebase';
import { fetchCards, fetchUserProgress, seedCards, Card, UserProgress } from './lib/dataService';
import { INITIAL_CARDS } from './lib/constants';
import { Dashboard } from './components/Dashboard';
import { StudySession } from './components/StudySession';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, BrainCircuit, Library } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<Card[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [view, setView] = useState<'dashboard' | 'study'>('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await seedCards(INITIAL_CARDS);
        loadData(user.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadData = async (uid: string) => {
    setLoading(true);
    try {
      const [allCards, userProgress] = await Promise.all([
        fetchCards(),
        fetchUserProgress(uid)
      ]);
      setCards(allCards);
      setProgress(userProgress);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const startStudy = (category?: string) => {
    setSelectedCategory(category);
    setView('study');
  };

  const finishStudy = () => {
    if (user) loadData(user.uid);
    setView('dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <BrainCircuit className="w-12 h-12 text-blue-500" />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md w-full"
        >
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/20">
              <BrainCircuit className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">NeuralFlash</h1>
          <p className="text-zinc-400 mb-12 text-lg">Master the math, theory, and code of Artificial Intelligence with spaced repetition.</p>
          
          <button
            onClick={signIn}
            className="w-full bg-white text-black font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all border border-transparent shadow-xl"
          >
            <Sparkles className="w-5 h-5" />
            GET STARTED WITH GOOGLE
          </button>

          <footer className="mt-16 pt-8 border-t border-zinc-900 grid grid-cols-3 gap-8">
            <div className="text-center">
              <Library className="w-5 h-5 text-zinc-600 mx-auto mb-2" />
              <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">500+ Cards</p>
            </div>
            <div className="text-center border-x border-zinc-900">
              <BrainCircuit className="w-5 h-5 text-zinc-600 mx-auto mb-2" />
              <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">SM-2 ALGO</p>
            </div>
            <div className="text-center">
              <Sparkles className="w-5 h-5 text-zinc-600 mx-auto mb-2" />
              <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">LaTeX & Code</p>
            </div>
          </footer>
        </motion.div>
      </div>
    );
  }

  const filteredCards = selectedCategory 
    ? cards.filter(c => c.category === selectedCategory)
    : cards;

  return (
    <div className="flex h-screen bg-[#030712] text-slate-200 overflow-hidden font-sans">
      {/* Sidebar: Progress & Subjects */}
      <aside className="w-72 bg-[#090e1a] border-r border-slate-800 flex flex-col p-6 hidden md:flex">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
            <h1 className="text-xs font-bold tracking-widest uppercase text-slate-400">Neural Intelligence</h1>
          </div>
          <div className="text-2xl font-light text-white">ML Mastery</div>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Session Context</span>
            <ul className="mt-3 space-y-2">
              <li 
                onClick={() => setView('dashboard')}
                className={`flex items-center justify-between text-sm p-2 rounded cursor-pointer transition-colors ${view === 'dashboard' ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400' : 'hover:bg-slate-800 text-slate-400'}`}
              >
                <span>Dashboard Overview</span>
                {view === 'dashboard' && <span className="text-[10px] bg-blue-500/20 px-1.5 py-0.5 rounded">Active</span>}
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Regimen Stats</span>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-800/40 rounded-lg">
                <div className="text-xl font-mono text-white">{Math.round((progress.filter(p => p.easeFactor > 2.3).length / (progress.length || 1)) * 100)}%</div>
                <div className="text-[9px] uppercase text-slate-500">Mastery</div>
              </div>
              <div className="p-3 bg-slate-800/40 rounded-lg">
                <div className="text-xl font-mono text-white">{progress.length}</div>
                <div className="text-[9px] uppercase text-slate-500">Studied</div>
              </div>
            </div>
          </div>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-1000" 
              style={{ width: `${(progress.length / (cards.length || 1)) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 uppercase">
            <span>Progress: {progress.length}/{cards.length}</span>
            <span>{Math.round((progress.length / (cards.length || 1)) * 100)}%</span>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 relative flex flex-col bg-[radial-gradient(circle_at_center,_#0f172a_0%,_#030712_100%)] overflow-y-auto">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-blue-500/10 blur-[100px] pointer-events-none"></div>
        
        <AnimatePresence mode="wait">
          {view === 'dashboard' ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1"
            >
              <Dashboard 
                cards={cards} 
                progress={progress} 
                onStartStudy={startStudy} 
              />
            </motion.div>
          ) : (
            <motion.div
              key="study"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex-1 flex flex-col"
            >
              <StudySession 
                cards={filteredCards} 
                progress={progress} 
                onFinish={finishStudy} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Right Metalog Bar */}
      <aside className="w-16 bg-[#030712] border-l border-slate-800 flex flex-col items-center py-8 space-y-8 hidden xl:flex">
        <div className="group relative cursor-help">
          <div className="w-1 h-32 bg-slate-800 rounded-full flex flex-col justify-end">
            <div 
              className="w-full bg-blue-500 rounded-full transition-all duration-1000"
              style={{ height: `${(progress.filter(p => new Date(p.nextReview) > new Date()).length / (progress.length || 1)) * 100}%` }}
            ></div>
          </div>
          <div className="absolute right-full mr-4 bg-slate-900 border border-slate-800 p-2 rounded text-[9px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
            Retention Health
          </div>
        </div>
        
        <div 
          onClick={signIn}
          className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-700 transition-colors"
        >
          <Sparkles className="w-4 h-4" />
        </div>
      </aside>
    </div>
  );
}
