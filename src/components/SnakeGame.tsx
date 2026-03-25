import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const SPEED = 80;

export default function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  
  const gameLoopRef = useRef<number | null>(null);
  const lastDirectionRef = useRef(INITIAL_DIRECTION);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    lastDirectionRef.current = INITIAL_DIRECTION;
    setFood(generateFood());
    setGameOver(false);
    setScore(0);
    onScoreChange(0);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        setIsPaused(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check if food eaten
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          onScoreChange(newScore);
          return newScore;
        });
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      lastDirectionRef.current = direction;
      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, generateFood, onScoreChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (lastDirectionRef.current.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (lastDirectionRef.current.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (lastDirectionRef.current.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (lastDirectionRef.current.x !== -1) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isPaused && !gameOver) {
      gameLoopRef.current = window.setInterval(moveSnake, SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, isPaused, gameOver]);

  return (
    <div className="relative flex flex-col items-center justify-center gap-4">
      <div 
        className="relative bg-slate-900/80 p-1 rounded-lg neon-border-cyan overflow-hidden"
        style={{ 
          width: GRID_SIZE * 20 + 8, 
          height: GRID_SIZE * 20 + 8,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {/* Render Snake */}
        {snake.map((segment, i) => {
          const opacity = Math.max(0.2, 1 - (i / snake.length) * 0.8);
          const glowSize = Math.max(0, 10 - i);
          
          return (
            <div
              key={`${i}-${segment.x}-${segment.y}`}
              className="rounded-sm transition-all duration-75"
              style={{
                gridColumnStart: segment.x + 1,
                gridRowStart: segment.y + 1,
                backgroundColor: i === 0 ? 'var(--color-neon-cyan)' : `rgba(0, 255, 255, ${opacity})`,
                boxShadow: glowSize > 0 ? `0 0 ${glowSize}px var(--color-neon-cyan)` : 'none',
                zIndex: 10 - i,
                transform: i === 0 ? 'scale(1.1)' : 'scale(1)',
              }}
            />
          );
        })}

        {/* Render Food */}
        <div
          className="rounded-full animate-pulse"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
            backgroundColor: 'var(--color-neon-pink)',
            boxShadow: '0 0 15px var(--color-neon-pink)',
            zIndex: 5,
          }}
        />

        {/* Overlays */}
        <AnimatePresence>
          {(gameOver || isPaused) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
            >
              {gameOver ? (
                <div className="text-center">
                  <h2 className="text-4xl font-display font-bold neon-text-pink mb-4">GAME OVER</h2>
                  <p className="text-xl mb-6">Final Score: {score}</p>
                  <button
                    onClick={resetGame}
                    className="px-6 py-2 bg-neon-pink text-white rounded-full font-bold hover:scale-105 transition-transform neon-border-pink"
                  >
                    TRY AGAIN
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <h2 className="text-4xl font-display font-bold neon-text-cyan mb-4">PAUSED</h2>
                  <p className="text-sm text-slate-400 mb-6">Press SPACE to Resume</p>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="px-6 py-2 bg-neon-cyan text-slate-950 rounded-full font-bold hover:scale-105 transition-transform neon-border-cyan"
                  >
                    RESUME
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="flex gap-12 text-sm font-mono uppercase tracking-widest mt-4">
        <div className="flex flex-col items-center">
          <span className="text-slate-500 mb-1">Score</span>
          <span className="text-5xl font-bold neon-text-green glitch-text">{score}</span>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-slate-500 mb-1">Controls</span>
          <div className="flex flex-col gap-1 text-[10px] text-slate-300 items-center">
            <span>ARROWS: MOVE</span>
            <span>SPACE: PAUSE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
