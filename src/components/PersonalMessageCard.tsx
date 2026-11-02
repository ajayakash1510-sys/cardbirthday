import React, { useState, useEffect } from 'react';
import { BirthdayConfig, THEMES } from '../types';
import { MessageSquareHeart, RotateCcw, FastForward, Heart } from 'lucide-react';

interface PersonalMessageCardProps {
  config: BirthdayConfig;
}

export const PersonalMessageCard: React.FC<PersonalMessageCardProps> = ({ config }) => {
  const theme = THEMES[config.themeColor];
  const fullText = config.personalMessage;

  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // Typewriter effect
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let index = 0;

    const timer = setInterval(() => {
      index++;
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index));
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 28); // typing speed

    return () => clearInterval(timer);
  }, [fullText]);

  const handleReplay = () => {
    setDisplayedText('');
    setIsTyping(true);
    let index = 0;
    const timer = setInterval(() => {
      index++;
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index));
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 28);
  };

  const handleSkip = () => {
    setDisplayedText(fullText);
    setIsTyping(false);
  };

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      {/* Decorative Washi Tape effect at top */}
      <div className="relative">
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-7 bg-amber-200/80 backdrop-blur-xs rotate-[-1.5deg] z-10 shadow-xs border-y border-amber-300/40 opacity-90" />

        <div className="bg-[#fffdfa] rounded-3xl p-6 sm:p-10 shadow-md border border-amber-100 relative overflow-hidden">
          {/* Subtle paper header */}
          <div className="flex items-center justify-between pb-4 border-b border-amber-100/80 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                <MessageSquareHeart className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800/60 block">
                  A Note From The Heart
                </span>
                <h3 className="text-sm font-semibold text-slate-800">
                  To {config.friendName}
                </h3>
              </div>
            </div>

            {/* Animation Controls */}
            <div className="flex items-center gap-1.5">
              {isTyping ? (
                <button
                  onClick={handleSkip}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-800 px-2 py-1 rounded-md hover:bg-amber-50 cursor-pointer transition-colors"
                  title="Show complete message immediately"
                >
                  <FastForward className="w-3 h-3" />
                  <span>Show All</span>
                </button>
              ) : (
                <button
                  onClick={handleReplay}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-800 px-2 py-1 rounded-md hover:bg-amber-50 cursor-pointer transition-colors"
                  title="Replay typewriter animation"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Replay</span>
                </button>
              )}
            </div>
          </div>

          {/* Typewriter text in handwritten font */}
          <div className="min-h-[140px] text-left text-slate-800">
            <p className="font-handwriting text-2xl sm:text-3xl leading-relaxed tracking-wide whitespace-pre-line">
              {displayedText}
              {isTyping && (
                <span className="inline-block w-2.5 h-6 bg-slate-700 ml-1 translate-y-1 animate-pulse" />
              )}
            </p>
          </div>

          {/* Signature & Heart */}
          <div className="mt-8 pt-4 border-t border-amber-100/60 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-amber-800/70 font-medium">
              <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
              <span>Written with genuine care</span>
            </div>

            {config.senderName && (
              <div className="text-right">
                <span className="text-[11px] text-slate-400 font-sans block">Always,</span>
                <span className="font-handwriting text-2xl font-bold text-slate-800">
                  {config.senderName}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
