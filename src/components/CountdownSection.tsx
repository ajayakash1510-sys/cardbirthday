import React, { useState, useEffect } from 'react';
import { BirthdayConfig, THEMES } from '../types';
import { Clock, Calendar, Sparkles } from 'lucide-react';

interface CountdownSectionProps {
  config: BirthdayConfig;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isToday: boolean;
  isPast: boolean;
}

export const CountdownSection: React.FC<CountdownSectionProps> = ({ config }) => {
  const theme = THEMES[config.themeColor];
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isToday: false,
    isPast: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const [year, month, day] = config.birthdayDate.split('-').map(Number);

      // Create target date for this year
      let targetDate = new Date(now.getFullYear(), month - 1, day, 0, 0, 0);

      // Check if today is the birthday
      const isToday =
        now.getDate() === day && now.getMonth() === month - 1;

      // If the date for this year has already passed (and it's not today), set target to next year
      const nowTime = now.getTime();
      let isPastThisYear = false;

      if (!isToday && targetDate.getTime() < nowTime) {
        // If the original date set by the user was specifically a date in the past, or birthday has passed this year
        isPastThisYear = true;
        targetDate = new Date(now.getFullYear() + 1, month - 1, day, 0, 0, 0);
      }

      const diff = Math.max(0, targetDate.getTime() - nowTime);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isToday,
        isPast: isPastThisYear,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [config.birthdayDate]);

  return (
    <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {timeLeft.isToday ? (
        /* It's your day banner! */
        <div className="relative rounded-3xl p-8 sm:p-10 text-center overflow-hidden bg-gradient-to-r from-amber-400 via-rose-400 to-purple-500 text-white shadow-lg border border-white/40">
          <div className="relative z-10 flex flex-col items-center">
            <span className="text-4xl mb-2 animate-bounce">🎂</span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold uppercase tracking-wider text-white mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Today Is The Big Day</span>
            </div>
            <h3 className="text-3xl sm:text-5xl font-black font-display tracking-tight">
              It's your day! 🎂
            </h3>
            <p className="mt-2 text-sm sm:text-base text-white/95 max-w-md mx-auto">
              Happy Birthday, {config.friendName}! May today bring unlimited smiles, huge slices of cake, and unforgettable memories!
            </p>
          </div>
        </div>
      ) : (
        /* Live Countdown timer */
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/90 text-center">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            <Clock className={`w-4 h-4 ${theme.accent}`} />
            <span>
              {timeLeft.isPast ? `Counting down to next birthday` : `Counting down to the big moment`}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900">
            {timeLeft.isPast
              ? `Next Celebration for ${config.friendName}`
              : `Countdown to ${config.friendName}'s Birthday`}
          </h3>

          <div className="mt-1 flex items-center justify-center gap-2 text-xs text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Target: {config.birthdayDate}</span>
          </div>

          {/* Time units grid */}
          <div className="mt-6 grid grid-cols-4 gap-2 sm:gap-4 max-w-lg mx-auto">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds },
            ].map((unit, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-100 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center shadow-xs"
              >
                <span className="text-2xl sm:text-4xl font-extrabold font-display text-slate-900 tabular-nums">
                  {String(unit.value).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
