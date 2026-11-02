import React, { useState } from 'react';
import { BirthdayConfig, THEMES } from '../types';
import { soundEngine } from '../utils/audio';
import { confetti } from '../utils/confetti';
import { Sparkles, Heart } from 'lucide-react';

interface EnvelopeModalProps {
  config: BirthdayConfig;
  isOpen: boolean;
  onOpenComplete: () => void;
}

export const EnvelopeModal: React.FC<EnvelopeModalProps> = ({ config, isOpen, onOpenComplete }) => {
  const [isOpening, setIsOpening] = useState(false);
  const theme = THEMES[config.themeColor];

  if (!isOpen) return null;

  const handleOpenEnvelope = () => {
    if (isOpening) return;
    setIsOpening(true);

    // Play pleasant sound effect
    soundEngine.playEnvelopeOpen();

    // Trigger colorful confetti burst
    confetti.burst({
      x: 0.5,
      y: 0.45,
      count: 90,
      colors: theme.balloonColors,
      spread: 90,
    });

    // Wait for the letter slide and flap flip animation to complete before removing overlay
    setTimeout(() => {
      onOpenComplete();
      setIsOpening(false);
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md transition-opacity duration-500">
      <div className="relative w-full max-w-md flex flex-col items-center">
        {/* Helper Instructions */}
        <div className="mb-6 text-center text-white">
          <p className="text-xs uppercase tracking-widest text-slate-300 font-semibold mb-1 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            Special Delivery
          </p>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
            For {config.friendName}
          </h2>
        </div>

        {/* 3D Envelope Container */}
        <div
          onClick={handleOpenEnvelope}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleOpenEnvelope();
          }}
          className={`relative w-80 sm:w-96 h-56 rounded-2xl cursor-pointer perspective-1000 select-none shadow-2xl transition-transform duration-300 ${
            isOpening ? 'scale-105' : 'hover:scale-[1.02] active:scale-[0.99]'
          }`}
        >
          {/* Envelope Pocket Base */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl border-2 border-amber-200/90 shadow-xl overflow-hidden flex flex-col justify-end p-5">
            {/* Inner Letter Card that slides UP when opened */}
            <div
              className={`absolute left-4 right-4 h-44 bg-white rounded-xl shadow-md border border-slate-200 p-4 flex flex-col items-center justify-center text-center transition-all duration-700 ease-out z-10 ${
                isOpening ? '-translate-y-28 opacity-100 scale-105' : 'translate-y-8 opacity-40'
              }`}
            >
              <span className="text-2xl mb-1">🎂</span>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-sans">
                Milestone Celebration
              </p>
              <h3 className="text-lg font-bold text-slate-800 font-display">
                Happy {config.friendAge}th Birthday!
              </h3>
              <p className="text-xs text-rose-500 font-handwriting text-lg mt-0.5">
                {config.friendName}
              </p>
            </div>

            {/* Diagonal envelope fold lines */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-20"
              viewBox="0 0 384 224"
              preserveAspectRatio="none"
            >
              {/* Bottom fold */}
              <polygon
                points="0,224 192,112 384,224"
                fill="#fef3c7"
                stroke="#fde68a"
                strokeWidth="1.5"
                opacity="0.95"
              />
              {/* Left fold */}
              <polygon
                points="0,0 0,224 192,112"
                fill="#fef9c3"
                stroke="#fde68a"
                strokeWidth="1.5"
                opacity="0.9"
              />
              {/* Right fold */}
              <polygon
                points="384,0 384,224 192,112"
                fill="#fef9c3"
                stroke="#fde68a"
                strokeWidth="1.5"
                opacity="0.9"
              />
            </svg>

            {/* Front Label and Postage Stamp */}
            <div className="relative z-30 flex items-end justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-amber-800/70 font-semibold font-sans">
                  Deliver to:
                </p>
                <p className="text-xl sm:text-2xl font-bold text-amber-950 font-handwriting">
                  {config.friendName} ✨
                </p>
              </div>

              {/* Postage Stamp */}
              <div className="w-12 h-14 bg-white border-2 border-dashed border-amber-300 rounded-md p-1 shadow-sm flex flex-col items-center justify-between">
                <span className="text-[9px] font-bold text-amber-600 font-mono">AIR MAIL</span>
                <span className="text-base">🎈</span>
                <span className="text-[8px] text-amber-500 font-semibold">CELEBRATE</span>
              </div>
            </div>
          </div>

          {/* Envelope Flap (Opens with 3D rotation) */}
          <div
            className={`absolute top-0 left-0 right-0 h-28 origin-top transform-style-3d transition-transform duration-700 ease-in-out z-30 ${
              isOpening ? '-rotate-x-180 pointer-events-none' : 'rotate-x-0'
            }`}
            style={{ transformOrigin: 'top center' }}
          >
            <svg
              className="w-full h-full drop-shadow-md"
              viewBox="0 0 384 112"
              preserveAspectRatio="none"
            >
              <polygon
                points="0,0 384,0 192,112"
                fill="#fef08a"
                stroke="#fde047"
                strokeWidth="1.5"
              />
            </svg>

            {/* Golden Wax Seal */}
            {!isOpening && (
              <div className="absolute top-[82px] left-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-gradient-to-br from-rose-500 via-rose-600 to-rose-700 shadow-md border-2 border-amber-200 flex items-center justify-center text-white cursor-pointer active:scale-95 transition-transform">
                <Heart className="w-5 h-5 fill-white/90 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Action Prompt */}
        <div className="mt-8 text-center">
          <button
            onClick={handleOpenEnvelope}
            className={`px-6 py-2.5 rounded-full font-semibold text-sm shadow-lg flex items-center gap-2 bg-gradient-to-r ${theme.buttonGradient} text-white cursor-pointer active:scale-95 transition-all`}
          >
            <Sparkles className="w-4 h-4" />
            {isOpening ? 'Opening Surprise...' : 'Tap to Open 💌'}
          </button>
        </div>
      </div>
    </div>
  );
};
