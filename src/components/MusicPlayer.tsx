import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TRACKS = [
  {
    id: 1,
    title: "Neon Dreams",
    artist: "SynthAI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "var(--color-neon-cyan)",
  },
  {
    id: 2,
    title: "Cyber City",
    artist: "NeuralBeats",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "var(--color-neon-pink)",
  },
  {
    id: 3,
    title: "Digital Horizon",
    artist: "Algorithmic Rhythm",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "var(--color-neon-purple)",
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  const handleEnded = () => {
    skipForward();
  };

  return (
    <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-xl p-6 rounded-3xl neon-border-pink relative overflow-hidden group">
      {/* Background Glow */}
      <div 
        className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-20 transition-colors duration-500"
        style={{ backgroundColor: currentTrack.color }}
      />
      
      <div className="flex items-center gap-6 relative z-10">
        {/* Album Art Placeholder */}
        <div 
          className="w-24 h-24 rounded-2xl flex items-center justify-center relative overflow-hidden"
          style={{ 
            backgroundColor: `${currentTrack.color}22`,
            border: `1px solid ${currentTrack.color}44` 
          }}
        >
          <Music size={40} style={{ color: currentTrack.color }} className="animate-pulse" />
          <motion.div 
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-2 border-dashed rounded-full opacity-20"
            style={{ borderColor: currentTrack.color }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-display font-bold truncate neon-text-pink" style={{ color: currentTrack.color }}>
            {currentTrack.title}
          </h3>
          <p className="text-slate-400 text-sm font-mono tracking-wider uppercase">
            {currentTrack.artist}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-8 mb-4">
        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full"
            style={{ 
              backgroundColor: currentTrack.color,
              width: `${progress}%`,
              boxShadow: `0 0 10px ${currentTrack.color}`
            }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={skipBackward}
            className="p-2 transition-all hover:scale-110 active:scale-95 group/btn"
          >
            <SkipBack 
              size={24} 
              style={{ 
                color: currentTrack.color,
                filter: `drop-shadow(0 0 8px ${currentTrack.color})`
              }} 
            />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-90"
            style={{ 
              backgroundColor: currentTrack.color,
              boxShadow: `0 0 25px ${currentTrack.color}`
            }}
          >
            {isPlaying ? (
              <Pause size={24} className="text-slate-950 fill-slate-950" />
            ) : (
              <Play size={24} className="text-slate-950 fill-slate-950 ml-1" />
            )}
          </button>

          <button 
            onClick={skipForward}
            className="p-2 transition-all hover:scale-110 active:scale-95 group/btn"
          >
            <SkipForward 
              size={24} 
              style={{ 
                color: currentTrack.color,
                filter: `drop-shadow(0 0 8px ${currentTrack.color})`
              }} 
            />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Volume2 
            size={18} 
            style={{ 
              color: currentTrack.color,
              filter: `drop-shadow(0 0 5px ${currentTrack.color})`
            }} 
          />
          <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full" 
              style={{ 
                backgroundColor: currentTrack.color,
                width: '75%',
                boxShadow: `0 0 10px ${currentTrack.color}`
              }} 
            />
          </div>
        </div>
      </div>

      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
    </div>
  );
}
