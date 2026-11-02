import React, { useState } from 'react';
import { BirthdayConfig, THEMES, Wish } from '../types';
import { loadWishes, saveWishes } from '../utils/storage';
import { confetti } from '../utils/confetti';
import { Sparkles, Heart, Pin, Plus, Trash2 } from 'lucide-react';

interface WishesWallProps {
  config: BirthdayConfig;
}

const STICKY_COLORS = [
  { name: 'Yellow', hex: '#fef08a' }, // Amber/Yellow
  { name: 'Pink', hex: '#fbcfe8' },   // Rose/Pink
  { name: 'Sky', hex: '#bae6fd' },    // Sky Blue
  { name: 'Mint', hex: '#bbf7d0' },   // Mint Green
  { name: 'Lilac', hex: '#e9d5ff' },  // Purple/Lavender
];

export const WishesWall: React.FC<WishesWallProps> = ({ config }) => {
  const theme = THEMES[config.themeColor];
  const [wishes, setWishes] = useState<Wish[]>(() => loadWishes());
  const [authorName, setAuthorName] = useState('');
  const [message, setMessage] = useState('');
  const [selectedColor, setSelectedColor] = useState(STICKY_COLORS[0].hex);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim()) {
      setErrorMsg('Please enter your name');
      return;
    }
    if (!message.trim()) {
      setErrorMsg('Please enter a short wish');
      return;
    }

    const newWish: Wish = {
      id: `wish-${Date.now()}`,
      author: authorName.trim(),
      message: message.trim(),
      color: selectedColor,
      timestamp: Date.now(),
      likes: 1,
    };

    const updated = [newWish, ...wishes];
    setWishes(updated);
    saveWishes(updated);

    // Micro confetti burst on posting a wish
    confetti.burst({
      x: 0.5,
      y: 0.8,
      count: 25,
      colors: [selectedColor, '#f43f5e', '#3b82f6'],
    });

    setAuthorName('');
    setMessage('');
    setErrorMsg('');
  };

  const handleLike = (id: string) => {
    const updated = wishes.map((w) => {
      if (w.id === id) {
        return { ...w, likes: w.likes + 1 };
      }
      return w;
    });
    setWishes(updated);
    saveWishes(updated);
  };

  const handleDelete = (id: string) => {
    const updated = wishes.filter((w) => w.id !== id);
    setWishes(updated);
    saveWishes(updated);
  };

  // Alternating playful tilt angles for sticky notes
  const tilts = ['rotate-[-1.5deg]', 'rotate-[1.5deg]', 'rotate-[-1deg]', 'rotate-[2deg]', 'rotate-[-2deg]'];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-6 sm:p-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            <Sparkles className={`w-4 h-4 ${theme.accent}`} />
            <span>Community Love</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
            Wishes & Notes Wall
          </h2>
          <p className="mt-1 text-sm text-slate-600 max-w-md mx-auto">
            Friends and classmates can pin their birthday greetings for {config.friendName} here!
          </p>
        </div>

        {/* Add Wish Form */}
        <form
          onSubmit={handleAddWish}
          className="mb-10 max-w-xl mx-auto p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-xs"
        >
          {errorMsg && (
            <p className="text-xs text-rose-600 mb-2 font-medium">{errorMsg}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Maya or Study Group"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Sticky Note Color
              </label>
              <div className="flex items-center gap-2 h-9">
                {STICKY_COLORS.map((col) => (
                  <button
                    key={col.hex}
                    type="button"
                    onClick={() => setSelectedColor(col.hex)}
                    className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                      selectedColor === col.hex
                        ? 'ring-2 ring-slate-900 scale-110 shadow-xs'
                        : 'border-slate-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: col.hex }}
                    title={col.name}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Your Birthday Wish
            </label>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Write a warm wish for ${config.friendName}...`}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-gradient-to-r ${theme.buttonGradient} shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all`}
          >
            <Pin className="w-3.5 h-3.5" />
            <span>Pin Sticky Note</span>
          </button>
        </form>

        {/* Sticky Notes Grid Wall */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 pt-2">
          {wishes.map((wish, index) => {
            const tilt = tilts[index % tilts.length];
            return (
              <div
                key={wish.id}
                className={`relative p-5 rounded-md shadow-md border border-black/5 flex flex-col justify-between transition-transform duration-200 hover:scale-105 hover:z-10 ${tilt}`}
                style={{ backgroundColor: wish.color }}
              >
                {/* Pushpin at top */}
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-rose-500 shadow-xs border border-rose-600/30 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white opacity-80" />
                </div>

                {/* Message Body */}
                <div className="mt-1">
                  <p className="font-handwriting text-xl text-slate-800 leading-snug">
                    "{wish.message}"
                  </p>
                </div>

                {/* Footer: Author & Likes */}
                <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
                    — {wish.author}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleLike(wish.id)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/60 hover:bg-white text-[11px] font-semibold text-slate-700 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Send love"
                    >
                      <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                      <span className="tabular-nums">{wish.likes}</span>
                    </button>

                    <button
                      onClick={() => handleDelete(wish.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-white/60 transition-colors cursor-pointer"
                      title="Remove note"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
