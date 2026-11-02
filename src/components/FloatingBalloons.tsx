import React, { useState, useEffect } from 'react';
import { BirthdayConfig, THEMES } from '../types';
import { soundEngine } from '../utils/audio';
import { confetti } from '../utils/confetti';
import { Sparkles, X, Plus } from 'lucide-react';

interface FloatingBalloonsProps {
  config: BirthdayConfig;
}

interface BalloonItem {
  id: string;
  xPercent: number; // 5 to 90
  yPercent: number; // 10 to 80
  size: number; // 48 to 68
  color: string;
  speed: number;
  wobble: number;
}

const BALLOON_WISHES = [
  'May your code compile on the first try and your coffee never get cold! ☕✨',
  'Wishing you endless pizza, midnight laughs, and zero stress this year! 🍕🎉',
  'May this year bring spontaneous road trips, concerts, and unforgettable sunsets! 🚗🌅',
  'You officially get 1 superpower today: unlimited good luck! 🍀⚡',
  'May all your exams and projects feel effortless and fun! 📚🎯',
  'Here is to 365 new chances to be ridiculously happy! 🌟💛',
  'May you always find money in old jacket pockets and parking spots right in front! 🪙🚗',
  'Wishing you top grades, deep sleep, and the best playlist for every moment! 🎧💤',
  'May this chapter be your most confident, creative, and joyful one yet! 🌈🚀',
];

export const FloatingBalloons: React.FC<FloatingBalloonsProps> = ({ config }) => {
  const theme = THEMES[config.themeColor];
  const [balloons, setBalloons] = useState<BalloonItem[]>([]);
  const [activeWish, setActiveWish] = useState<string | null>(null);

  // Initialize a set of floating balloons
  const spawnBalloons = (count = 6) => {
    const newBalloons: BalloonItem[] = [];
    const colors = theme.balloonColors;

    for (let i = 0; i < count; i++) {
      newBalloons.push({
        id: `balloon-${Date.now()}-${Math.random()}`,
        xPercent: 8 + Math.random() * 84,
        yPercent: 20 + Math.random() * 60,
        size: 54 + Math.random() * 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: 2 + Math.random() * 3,
        wobble: Math.random() * 6 - 3,
      });
    }
    setBalloons((prev) => [...prev, ...newBalloons]);
  };

  useEffect(() => {
    spawnBalloons(7);
  }, [config.themeColor]);

  const popBalloon = (b: BalloonItem, event: React.MouseEvent) => {
    event.stopPropagation();

    // Play synthesized pop sound effect
    soundEngine.playBalloonPop();

    // Trigger localized canvas confetti burst
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const xRatio = (rect.left + rect.width / 2) / window.innerWidth;
    const yRatio = (rect.top + rect.height / 2) / window.innerHeight;

    confetti.burst({
      x: xRatio,
      y: yRatio,
      count: 35,
      colors: [b.color, '#fcd34d', '#ffffff', '#fb7185'],
      spread: 60,
    });

    // Remove popped balloon
    setBalloons((prev) => prev.filter((item) => item.id !== b.id));

    // Show random fun wish
    const randomWish = BALLOON_WISHES[Math.floor(Math.random() * BALLOON_WISHES.length)];
    setActiveWish(randomWish);
  };

  return (
    <>
      {/* Floating balloons container */}
      <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
        {balloons.map((b) => (
          <div
            key={b.id}
            onClick={(e) => popBalloon(b, e)}
            role="button"
            tabIndex={0}
            className="pointer-events-auto absolute cursor-pointer select-none transition-transform hover:scale-110 active:scale-95 animate-float"
            style={{
              left: `${b.xPercent}%`,
              top: `${b.yPercent}%`,
              animationDuration: `${b.speed + 3}s`,
            }}
          >
            <div className="relative flex flex-col items-center">
              {/* Balloon Body SVG */}
              <svg
                width={b.size}
                height={b.size * 1.25}
                viewBox="0 0 60 75"
                className="filter drop-shadow-md"
              >
                {/* Main oval */}
                <ellipse cx="30" cy="28" rx="26" ry="28" fill={b.color} />
                {/* 3D Gloss Highlight */}
                <path
                  d="M16 14 Q 24 8, 34 10"
                  stroke="#ffffff"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  opacity="0.45"
                  fill="none"
                />
                {/* Knot */}
                <polygon points="26,56 34,56 30,62" fill={b.color} />
                {/* String */}
                <path
                  d="M30 62 Q 26 68, 32 72 T 28 80"
                  stroke="#cbd5e1"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>

              {/* Floating tap hint on hover */}
              <span className="absolute -top-3 text-[10px] font-bold text-white bg-slate-900/80 px-1.5 py-0.5 rounded-full opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
                Pop me!
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Release More Balloons Button */}
      <div className="fixed bottom-6 right-6 z-30 flex items-center gap-2">
        <button
          onClick={() => spawnBalloons(5)}
          className="px-3.5 py-2 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-md text-slate-800 shadow-md border border-slate-200 hover:border-slate-300 flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
          title="Float more balloons to pop"
        >
          <span className="text-base">🎈</span>
          <span>More Balloons</span>
          <Plus className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {/* Pop-up Wish Toast Modal */}
      {activeWish && (
        <div className="fixed inset-x-4 bottom-20 sm:bottom-8 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-50 max-w-md w-full">
          <div className="bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-slate-800 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 text-xl">
              🎈
            </div>
            <div className="flex-1 pr-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 uppercase tracking-wider mb-0.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Balloon Wish Unlocked!</span>
              </div>
              <p className="text-sm font-medium text-slate-100 leading-snug">
                {activeWish}
              </p>
            </div>
            <button
              onClick={() => setActiveWish(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
