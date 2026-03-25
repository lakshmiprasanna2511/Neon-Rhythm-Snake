/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Gamepad2, Music as MusicIcon, Trophy } from 'lucide-react';

export default function App() {
  const [highScore, setHighScore] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);

  const handleScoreChange = (score: number) => {
    setCurrentScore(score);
    if (score > highScore) {
      setHighScore(score);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-pink/10 rounded-full blur-[120px] animate-pulse delay-1000" />
        
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-10" 
          style={{ 
            backgroundImage: 'linear-gradient(var(--color-neon-purple) 1px, transparent 1px), linear-gradient(90deg, var(--color-neon-purple) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 70%)'
          }} 
        />
      </div>

      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 mb-12 text-center"
      >
        <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter neon-text-cyan mb-2">
          NEON<span className="neon-text-pink">SNAKE</span>
        </h1>
        <div className="flex items-center justify-center gap-4 text-xs font-mono tracking-[0.3em] text-slate-400 uppercase">
          <span className="flex items-center gap-1"><Gamepad2 size={14} /> Arcade</span>
          <span className="w-1 h-1 bg-slate-700 rounded-full" />
          <span className="flex items-center gap-1"><MusicIcon size={14} /> Synthwave</span>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-center">
        
        {/* Game Section */}
        <motion.section 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <SnakeGame onScoreChange={handleScoreChange} />
        </motion.section>

        {/* Sidebar / Controls Section */}
        <motion.section 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-8"
        >
          {/* Stats Card */}
          <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl neon-border-cyan">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="text-neon-cyan" size={24} />
              <h2 className="text-xl font-display font-bold uppercase tracking-wider">Leaderboard</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-slate-800 pb-2">
                <span className="text-slate-400 text-xs font-mono">Current Run</span>
                <span className="text-2xl font-bold neon-text-cyan">{currentScore}</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-slate-400 text-xs font-mono">Personal Best</span>
                <span className="text-2xl font-bold neon-text-pink">{highScore}</span>
              </div>
            </div>
          </div>

          {/* Music Player */}
          <MusicPlayer />

          {/* Instructions */}
          <div className="text-slate-500 text-[10px] font-mono uppercase tracking-widest leading-relaxed px-4">
            <p>System Status: <span className="text-neon-green">Operational</span></p>
            <p>Audio Engine: <span className="text-neon-cyan">SynthAI v2.4</span></p>
            <p>Visual Core: <span className="text-neon-pink">NeonRender v4.0</span></p>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="mt-16 relative z-10 text-slate-600 text-[10px] font-mono tracking-widest uppercase">
        &copy; 2026 NEON ARCADE // ALL RIGHTS RESERVED
      </footer>
    </div>
  );
}
