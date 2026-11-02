import React, { useState, useEffect } from 'react';
import { BirthdayConfig, THEMES } from '../types';
import { soundEngine } from '../utils/audio';
import { confetti } from '../utils/confetti';
import { Sparkles, Wind, RotateCcw, CheckCircle2 } from 'lucide-react';

interface BirthdayCakeProps {
  config: BirthdayConfig;
}

export const BirthdayCake: React.FC<BirthdayCakeProps> = ({ config }) => {
  const theme = THEMES[config.themeColor];
  const maxCandles = Math.min(Math.max(config.friendAge, 1), 20);

  // Array of candle lit states
  const [candles, setCandles] = useState<boolean[]>(() =>
    Array(maxCandles).fill(true)
  );
  const [isWishingMode, setIsWishingMode] = useState(false);
  const [allBlownOut, setAllBlownOut] = useState(false);

  // Sync if age changes
  useEffect(() => {
    setCandles(Array(maxCandles).fill(true));
    setAllBlownOut(false);
  }, [maxCandles]);

  const blownCount = candles.filter((lit) => !lit).length;
  const remainingCount = maxCandles - blownCount;

  const handleCandleClick = (index: number) => {
    if (!candles[index]) return; // already blown out

    // Play breath puff sound
    soundEngine.playCandlePuff();

    const nextCandles = [...candles];
    nextCandles[index] = false;
    setCandles(nextCandles);

    // Check if this was the last candle
    if (nextCandles.every((lit) => !lit)) {
      triggerCelebration();
    }
  };

  const handleBlowAll = () => {
    soundEngine.playCandlePuff();
    setCandles(Array(maxCandles).fill(false));
    triggerCelebration();
  };

  const triggerCelebration = () => {
    setAllBlownOut(true);
    soundEngine.playCelebrationChime();
    confetti.showerCelebration(theme.balloonColors);
  };

  const handleResetCandles = () => {
    setCandles(Array(maxCandles).fill(true));
    setAllBlownOut(false);
  };

  // Color patterns for candles
  const candleWaxColors = [
    '#f43f5e', '#ec4899', '#8b5cf6', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#f97316'
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 overflow-hidden">
        {/* Header Strip */}
        <div className="p-6 text-center border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            <Sparkles className={`w-4 h-4 ${theme.accent}`} />
            <span>The Birthday Ceremony</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
            Make a Wish & Blow the Candles
          </h2>
          <p className="mt-1 text-sm text-slate-600 max-w-md mx-auto">
            {config.friendAge > 20
              ? `Displaying 20 golden candles celebrating ${config.friendName}'s ${config.friendAge}th milestone!`
              : `${maxCandles} birthday candle${maxCandles > 1 ? 's' : ''} for ${config.friendName}'s ${config.friendAge} years of wonder!`}
          </p>

          {/* Status & Action Buttons */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            {!allBlownOut ? (
              <>
                <button
                  onClick={() => setIsWishingMode(true)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white shadow-sm bg-gradient-to-r ${theme.buttonGradient} flex items-center gap-2 cursor-pointer transition-all active:scale-95`}
                >
                  <Sparkles className="w-4 h-4" />
                  {isWishingMode ? 'Make Your Secret Wish!' : 'Start: Make a Wish'}
                </button>

                {isWishingMode && (
                  <button
                    onClick={handleBlowAll}
                    className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                  >
                    <Wind className="w-4 h-4 text-slate-500" />
                    Blow All at Once
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={handleResetCandles}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <RotateCcw className="w-4 h-4 text-slate-500" />
                Relight Candles
              </button>
            )}
          </div>

          {/* Candle Counter */}
          <div className="mt-3 text-xs font-medium text-slate-500 flex items-center justify-center gap-2 tabular-nums">
            <span>Candles extinguished:</span>
            <span className="font-bold text-slate-900 px-2 py-0.5 bg-slate-100 rounded-md">
              {blownCount} / {maxCandles}
            </span>
            {remainingCount > 0 && (
              <span className="text-amber-600 font-semibold">
                ({remainingCount} left to blow)
              </span>
            )}
          </div>
        </div>

        {/* Celebration Announcement Banner */}
        {allBlownOut && (
          <div className="bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 text-white p-4 text-center animate-in fade-in duration-300">
            <div className="flex items-center justify-center gap-2 text-base sm:text-lg font-bold font-display">
              <CheckCircle2 className="w-5 h-5 text-white" />
              <span>All candles extinguished! Your wish is on its way to the stars! ✨🎂</span>
            </div>
            <p className="text-xs text-white/90 mt-0.5">
              May every single dream you wished for today unfold beautifully this year!
            </p>
          </div>
        )}

        {/* Cake Illustration Area */}
        <div className={`p-8 sm:p-12 flex flex-col items-center justify-center transition-colors duration-500 ${isWishingMode && !allBlownOut ? 'bg-slate-900/5' : 'bg-white'}`}>
          <div className="relative w-full max-w-md flex flex-col items-center select-none">
            
            {/* Candle Rack on top tier */}
            <div className="relative z-20 flex items-end justify-center gap-1 sm:gap-2 px-4 mb-[-2px] flex-wrap max-w-[340px]">
              {candles.map((isLit, idx) => {
                const waxColor = candleWaxColors[idx % candleWaxColors.length];
                return (
                  <div
                    key={idx}
                    onClick={() => handleCandleClick(idx)}
                    role="button"
                    tabIndex={0}
                    title={isLit ? 'Click to blow out candle' : 'Candle blown out'}
                    className="group relative flex flex-col items-center cursor-pointer px-0.5 transition-transform hover:-translate-y-1 active:scale-95"
                  >
                    {/* Flame or Smoke */}
                    <div className="h-7 flex items-end justify-center">
                      {isLit ? (
                        <div className="relative flex flex-col items-center">
                          {/* Outer golden aura glow */}
                          <div className="absolute -top-1 w-5 h-5 bg-amber-400/30 rounded-full blur-xs" />
                          {/* Animated flame SVG */}
                          <svg
                            width="14"
                            height="22"
                            viewBox="0 0 14 22"
                            className="animate-flame origin-bottom"
                          >
                            <defs>
                              <radialGradient id={`flameGrad-${idx}`} cx="50%" cy="70%" r="50%">
                                <stop offset="0%" stopColor="#ffffff" />
                                <stop offset="35%" stopColor="#fef08a" />
                                <stop offset="70%" stopColor="#f59e0b" />
                                <stop offset="100%" stopColor="#ef4444" />
                              </radialGradient>
                            </defs>
                            <path
                              d="M7 0 C11 6, 14 11, 14 15 C14 19, 11 22, 7 22 C3 22, 0 19, 0 15 C0 11, 3 6, 7 0 Z"
                              fill={`url(#flameGrad-${idx})`}
                            />
                          </svg>
                        </div>
                      ) : (
                        /* Smoke plume */
                        <div className="animate-smoke flex flex-col items-center pb-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400/80 blur-[0.5px]" />
                          <span className="w-2.5 h-2.5 rounded-full bg-slate-300/60 blur-[1px] -mt-1" />
                        </div>
                      )}
                    </div>

                    {/* Candle Wick */}
                    <div className="w-[1.5px] h-2 bg-slate-700" />

                    {/* Candle Body */}
                    <div
                      className="w-3 sm:w-3.5 h-12 rounded-t-sm shadow-xs border border-black/10 relative overflow-hidden"
                      style={{ backgroundColor: waxColor }}
                    >
                      {/* Diagonal stripe decorative wax pattern */}
                      <div className="absolute inset-0 opacity-25 bg-[repeating-linear-gradient(45deg,#fff,#fff_3px,transparent_3px,transparent_6px)]" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cake Body SVG Illustration */}
            <div className="relative w-72 sm:w-80">
              <svg viewBox="0 0 320 220" className="w-full drop-shadow-xl" preserveAspectRatio="xMidYMid meet">
                <defs>
                  {/* Gradients for Cake Tiers */}
                  <linearGradient id="tier1Grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#fed7aa" />
                    <stop offset="50%" stopColor="#ffedd5" />
                    <stop offset="100%" stopColor="#fdba74" />
                  </linearGradient>

                  <linearGradient id="tier2Grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#fbcfe8" />
                    <stop offset="50%" stopColor="#fdf2f8" />
                    <stop offset="100%" stopColor="#f472b6" />
                  </linearGradient>

                  <linearGradient id="tier3Grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#e9d5ff" />
                    <stop offset="50%" stopColor="#f5f3ff" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>

                  <linearGradient id="plateGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f8fafc" />
                    <stop offset="100%" stopColor="#cbd5e1" />
                  </linearGradient>
                </defs>

                {/* Cake Stand & Plate */}
                <ellipse cx="160" cy="198" rx="145" ry="14" fill="#94a3b8" opacity="0.3" />
                <ellipse cx="160" cy="194" rx="140" ry="12" fill="url(#plateGrad)" stroke="#94a3b8" strokeWidth="1.5" />
                <ellipse cx="160" cy="192" rx="132" ry="9" fill="#ffffff" />
                {/* Stand pedestal */}
                <path d="M140 196 L130 216 L190 216 L180 196 Z" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
                <ellipse cx="160" cy="216" rx="35" ry="4" fill="#94a3b8" />

                {/* TIER 3 (Bottom Tier) */}
                <rect x="40" y="125" width="240" height="65" rx="14" fill="url(#tier3Grad)" stroke="#d8b4fe" strokeWidth="1.5" />
                {/* Decorative Frosting Swags */}
                <path
                  d="M40 145 Q70 162 100 145 Q130 162 160 145 Q190 162 220 145 Q250 162 280 145"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                {/* Sprinkles on bottom tier */}
                <circle cx="70" cy="170" r="3" fill="#f43f5e" />
                <circle cx="110" cy="175" r="3" fill="#3b82f6" />
                <circle cx="150" cy="168" r="3" fill="#fbbf24" />
                <circle cx="190" cy="174" r="3" fill="#10b981" />
                <circle cx="230" cy="169" r="3" fill="#ec4899" />

                {/* TIER 2 (Middle Tier) */}
                <rect x="65" y="75" width="190" height="55" rx="12" fill="url(#tier2Grad)" stroke="#f9a8d4" strokeWidth="1.5" />
                {/* Drip frosting */}
                <path
                  d="M65 85 Q75 105 85 85 Q95 108 105 85 Q115 102 125 85 Q135 110 145 85 Q155 104 165 85 Q175 108 185 85 Q195 100 205 85 Q215 110 225 85 Q235 102 245 85 L255 85 L255 75 L65 75 Z"
                  fill="#ffffff"
                  opacity="0.9"
                />
                {/* Middle tier pearls */}
                <circle cx="95" cy="115" r="3" fill="#38bdf8" />
                <circle cx="135" cy="118" r="3" fill="#fbbf24" />
                <circle cx="175" cy="116" r="3" fill="#a855f7" />
                <circle cx="215" cy="118" r="3" fill="#f43f5e" />

                {/* TIER 1 (Top Tier) */}
                <rect x="90" y="32" width="140" height="46" rx="10" fill="url(#tier1Grad)" stroke="#fed7aa" strokeWidth="1.5" />
                {/* Cream frosting top crown */}
                <ellipse cx="160" cy="33" rx="70" ry="12" fill="#ffffff" stroke="#fde68a" strokeWidth="1.5" />
                {/* Whipped cream dollops */}
                <circle cx="105" cy="32" r="5" fill="#fef9c3" />
                <circle cx="123" cy="31" r="5" fill="#fef9c3" />
                <circle cx="142" cy="30" r="5" fill="#fef9c3" />
                <circle cx="160" cy="30" r="6" fill="#fef08a" />
                <circle cx="178" cy="30" r="5" fill="#fef9c3" />
                <circle cx="197" cy="31" r="5" fill="#fef9c3" />
                <circle cx="215" cy="32" r="5" fill="#fef9c3" />
              </svg>
            </div>

            {/* Guidance Text */}
            <p className="mt-4 text-xs font-semibold text-slate-500 text-center flex items-center justify-center gap-1.5">
              <span>💡</span>
              <span>Tap each candle to extinguish the flame</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
