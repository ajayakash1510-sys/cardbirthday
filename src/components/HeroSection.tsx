import React from 'react';
import { BirthdayConfig, THEMES } from '../types';
import { Sparkles, Star } from 'lucide-react';

interface HeroSectionProps {
  config: BirthdayConfig;
  onOpenEnvelope: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ config, onOpenEnvelope }) => {
  const theme = THEMES[config.themeColor];

  return (
    <section className="relative pt-6 pb-12 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
      {/* Decorative ambient background glows */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[500px] h-[340px] sm:h-[500px] rounded-full blur-3xl opacity-25 pointer-events-none -z-10"
        style={{ backgroundColor: theme.balloonColors[0] }}
      />

      <div className="max-w-3xl mx-auto flex flex-col items-center">
        {/* Envelope Replay Indicator */}
        <button
          onClick={onOpenEnvelope}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 shadow-xs mb-5 transition-all cursor-pointer"
        >
          <span className="text-sm">💌</span>
          <span>View Envelope Again</span>
        </button>

        {/* Big Animated Heading */}
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">
            <Sparkles className={`w-4 h-4 ${theme.accent}`} />
            <span>It's a Special Celebration</span>
            <Sparkles className={`w-4 h-4 ${theme.accent}`} />
          </div>

          <h1
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-display text-slate-900 leading-tight"
            style={{ textWrap: 'balance' }}
          >
            Happy Birthday,{' '}
            <span
              className={`bg-clip-text text-transparent bg-gradient-to-r ${theme.gradientText} inline-block filter drop-shadow-sm`}
            >
              {config.friendName}!
            </span>{' '}
            🎉
          </h1>
        </div>

        {/* Big Glowing Age Display */}
        <div className="mt-6 relative flex flex-col items-center">
          {/* Subtle crown or star above age */}
          <div className="flex items-center gap-2 mb-1">
            <Star className={`w-4 h-4 fill-amber-400 text-amber-400 animate-pulse`} />
            <span className="text-xs uppercase tracking-widest font-bold text-slate-500">
              Level {config.friendAge} Unlocked
            </span>
            <Star className={`w-4 h-4 fill-amber-400 text-amber-400 animate-pulse`} />
          </div>

          {/* Huge Glowing Number */}
          <div className="relative inline-flex items-center justify-center">
            {/* Ambient circular glow */}
            <div
              className="absolute inset-0 rounded-full blur-2xl opacity-40 scale-125"
              style={{ backgroundColor: theme.balloonColors[1] }}
            />

            <div className="relative px-8 py-2 rounded-3xl bg-white/70 backdrop-blur-md border border-white/80 shadow-lg flex items-baseline gap-2">
              <span
                className={`text-6xl sm:text-8xl md:text-9xl font-black font-display tracking-tighter bg-clip-text text-transparent bg-gradient-to-b ${theme.gradientText} tabular-nums filter drop-shadow-md`}
              >
                {config.friendAge}
              </span>
              <span className="text-xl sm:text-2xl font-bold text-slate-400 font-display">
                Years of Awesome
              </span>
            </div>
          </div>
        </div>

        {/* Short Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
          Today is dedicated entirely to you. Scroll down to make a wish, blow out your candles, read your personal letter, and collect sweet wishes!
        </p>
      </div>
    </section>
  );
};
