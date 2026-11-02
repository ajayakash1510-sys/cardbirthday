import React, { useState, useEffect } from 'react';
import { BirthdayConfig, THEMES } from '../types';
import { soundEngine } from '../utils/audio';
import { generateShareUrl } from '../utils/storage';
import { Volume2, VolumeX, Share2, Edit3, Check, Music } from 'lucide-react';

interface TopBarProps {
  config: BirthdayConfig;
  onEditClick: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ config, onEditClick }) => {
  const theme = THEMES[config.themeColor];
  const [isPlayingMusic, setIsPlayingMusic] = useState(soundEngine.isPlaying);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const unsubscribe = soundEngine.subscribe((playing) => {
      setIsPlayingMusic(playing);
    });
    return () => unsubscribe();
  }, []);

  const handleToggleMusic = () => {
    soundEngine.toggleTune();
  };

  const handleShare = async () => {
    const shareUrl = generateShareUrl(config);

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Happy Birthday, ${config.friendName}! 🎉`,
          text: `Here is a special birthday surprise created just for you! 🎂✨`,
          url: shareUrl,
        });
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
        return;
      } catch {
        // Fallback to clipboard if share was cancelled or failed
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback prompt
      window.prompt('Copy this surprise link:', shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-2">
          <span className="text-xl">🎂</span>
          <span className="text-base font-bold text-slate-900 tracking-tight font-display whitespace-nowrap">
            CelebrateMe
          </span>
          <span className="hidden sm:inline-block text-xs text-slate-400 font-sans">
            · For {config.friendName}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Web Audio Music Toggle */}
          <button
            onClick={handleToggleMusic}
            className={`min-h-[40px] px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
              isPlayingMusic
                ? 'bg-rose-50 text-rose-700 border-rose-200 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
            title={isPlayingMusic ? 'Pause Happy Birthday Tune' : 'Play Soft Happy Birthday Music'}
            aria-label="Toggle music"
          >
            {isPlayingMusic ? (
              <>
                <Volume2 className="w-4 h-4 text-rose-500 animate-pulse" />
                <span className="hidden xs:inline">Playing Tune</span>
                {/* Micro Visualizer */}
                <div className="flex items-center gap-0.5 h-3">
                  <span className="w-0.5 h-2.5 bg-rose-500 rounded-full animate-bounce" />
                  <span className="w-0.5 h-3.5 bg-rose-500 rounded-full animate-bounce [animation-delay:0.15s]" />
                  <span className="w-0.5 h-1.5 bg-rose-500 rounded-full animate-bounce [animation-delay:0.3s]" />
                </div>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span className="hidden xs:inline">Play Tune</span>
              </>
            )}
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className={`min-h-[40px] px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
              copied
                ? 'bg-emerald-600 text-white'
                : `bg-gradient-to-r ${theme.buttonGradient} text-white`
            }`}
            title="Copy shareable link"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </>
            )}
          </button>

          {/* Edit Details Button */}
          <button
            onClick={onEditClick}
            className="min-h-[40px] px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Edit birthday details"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Edit Details</span>
          </button>
        </div>
      </div>
    </header>
  );
};
