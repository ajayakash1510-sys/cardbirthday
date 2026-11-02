import React from 'react';
import { BirthdayConfig, THEMES } from '../types';
import { Camera, Sparkles, Heart } from 'lucide-react';

interface PhotoSectionProps {
  config: BirthdayConfig;
  onEditClick: () => void;
}

export const PhotoSection: React.FC<PhotoSectionProps> = ({ config, onEditClick }) => {
  const theme = THEMES[config.themeColor];

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col items-center">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
          <Camera className={`w-4 h-4 ${theme.accent}`} />
          <span>Moments & Memories</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
          The Birthday Spotlight
        </h2>
      </div>

      {config.photoUrl ? (
        /* Polaroid Frame with Real Uploaded Photo */
        <div className="relative group cursor-pointer select-none">
          {/* Top Washi Tape */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-amber-100/90 border border-amber-200/60 shadow-xs rotate-[-1deg] z-20 backdrop-blur-xs" />

          {/* Polaroid Body */}
          <div className="bg-white p-3 sm:p-4 pb-8 sm:pb-10 rounded-xs shadow-xl border border-slate-200/90 rotate-[-2deg] group-hover:rotate-0 group-hover:scale-[1.02] transition-all duration-300 max-w-xs sm:max-w-sm">
            {/* Photo Image Frame */}
            <div className="w-64 sm:w-72 h-64 sm:h-72 bg-slate-100 overflow-hidden rounded-xs border border-slate-100 relative shadow-inner">
              <img
                src={config.photoUrl}
                alt={`${config.friendName}'s birthday photo`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-40 pointer-events-none" />
            </div>

            {/* Handwritten Polaroid Caption */}
            <div className="mt-4 text-center">
              <p className="font-handwriting text-2xl font-bold text-slate-800 tracking-wide">
                {config.friendName} • Memories ✨
              </p>
              <p className="text-[10px] font-sans text-slate-400 mt-0.5 uppercase tracking-wider">
                Celebrating Level {config.friendAge}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Polaroid Fallback / Card when no photo uploaded */
        <div className="relative group select-none">
          {/* Top Washi Tape */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-pink-100/90 border border-pink-200/60 shadow-xs rotate-[1.5deg] z-20" />

          <div className="bg-white p-3 sm:p-4 pb-8 sm:pb-10 rounded-xs shadow-xl border border-slate-200/90 rotate-[1.5deg] group-hover:rotate-0 group-hover:scale-[1.02] transition-all duration-300 max-w-xs sm:max-w-sm">
            {/* Illustrated placeholder photo */}
            <div className="w-64 sm:w-72 h-64 sm:h-72 bg-gradient-to-br from-pink-50 via-amber-50 to-purple-50 flex flex-col items-center justify-center p-6 text-center rounded-xs border border-slate-100">
              <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-3xl mb-3">
                🎂
              </div>
              <p className="text-base font-bold text-slate-800 font-display">
                Picture Perfect Day
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-[200px]">
                Happy Birthday to {config.friendName}! Making today legendary.
              </p>
              <button
                onClick={onEditClick}
                className="mt-4 text-xs font-semibold text-rose-600 hover:text-rose-700 underline decoration-rose-300 underline-offset-4 cursor-pointer"
              >
                + Add a photo of {config.friendName}
              </button>
            </div>

            <div className="mt-4 text-center">
              <p className="font-handwriting text-2xl font-bold text-slate-800">
                {config.friendName} • Golden Moments ✨
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
