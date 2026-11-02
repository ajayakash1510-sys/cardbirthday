import React, { useState, useEffect } from 'react';
import { BirthdayConfig, THEMES } from './types';
import { loadSavedConfig, saveConfig } from './utils/storage';
import { confetti } from './utils/confetti';
import { SetupForm } from './components/SetupForm';
import { EnvelopeModal } from './components/EnvelopeModal';
import { TopBar } from './components/TopBar';
import { HeroSection } from './components/HeroSection';
import { FloatingBalloons } from './components/FloatingBalloons';
import { BirthdayCake } from './components/BirthdayCake';
import { CountdownSection } from './components/CountdownSection';
import { PersonalMessageCard } from './components/PersonalMessageCard';
import { PhotoSection } from './components/PhotoSection';
import { WishesWall } from './components/WishesWall';
import { FunFactsSection } from './components/FunFactsSection';
import { Heart, Sparkles } from 'lucide-react';

export default function App() {
  const [config, setConfig] = useState<BirthdayConfig | null>(() => loadSavedConfig());
  const [isEditing, setIsEditing] = useState<boolean>(() => !loadSavedConfig());
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState<boolean>(false);

  // If initial config exists, show envelope when opening
  useEffect(() => {
    if (config && !isEditing) {
      setIsEnvelopeOpen(true);
    }
  }, []);

  const handleSaveConfig = (newConfig: BirthdayConfig) => {
    saveConfig(newConfig);
    setConfig(newConfig);
    setIsEditing(false);
    setIsEnvelopeOpen(true); // present the envelope surprise!
  };

  const handleEnvelopeComplete = () => {
    setIsEnvelopeOpen(false);
    // Shower celebratory confetti when envelope finishes opening
    if (config) {
      const theme = THEMES[config.themeColor];
      confetti.burst({
        x: 0.5,
        y: 0.3,
        count: 80,
        colors: theme.balloonColors,
        spread: 100,
      });
    }
  };

  const handleOpenEnvelopeAgain = () => {
    setIsEnvelopeOpen(true);
  };

  // If in setup mode or no config has been created yet
  if (isEditing || !config) {
    return (
      <SetupForm
        initialConfig={config}
        onSave={handleSaveConfig}
      />
    );
  }

  const theme = THEMES[config.themeColor];

  return (
    <div className={`min-h-screen ${theme.softBg} text-slate-900 transition-colors duration-500 font-body relative selection:bg-pink-200 selection:text-pink-900`}>
      {/* 1. Opening Envelope Modal */}
      <EnvelopeModal
        config={config}
        isOpen={isEnvelopeOpen}
        onOpenComplete={handleEnvelopeComplete}
      />

      {/* Floating Interactive Balloons */}
      <FloatingBalloons config={config} />

      {/* 10. Sticky Navigation & Audio Toggle & Share Bar */}
      <TopBar
        config={config}
        onEditClick={() => setIsEditing(true)}
      />

      {/* Main Birthday Surprise Page Content */}
      <main className="relative z-10 pb-20">
        {/* 2. Hero Section: "Happy Birthday, [Name]! 🎉", large animated text & glowing age */}
        <HeroSection
          config={config}
          onOpenEnvelope={handleOpenEnvelopeAgain}
        />

        {/* 5. Countdown Section: Live countdown if future, or "It's your day! 🎂" */}
        <CountdownSection config={config} />

        {/* 4. Birthday Cake: SVG illustrated cake with candles, "Make a Wish", blowout interaction */}
        <BirthdayCake config={config} />

        {/* 6. Personal Message Card: Handwritten font with typewriter animation */}
        <PersonalMessageCard config={config} />

        {/* 7. Photo Section: Polaroid-style frame with gentle tilt */}
        <PhotoSection
          config={config}
          onEditClick={() => setIsEditing(true)}
        />

        {/* 9. Fun Facts: Days, hours, heartbeats based on age */}
        <FunFactsSection config={config} />

        {/* 8. Wishes Wall: Sticky notes for classmates and friends to pin messages */}
        <WishesWall config={config} />
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-10 px-4 text-center border-t border-slate-200/80 bg-white/70 backdrop-blur-xs">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <span>Made with genuine care for</span>
            <span className="font-bold text-slate-900 font-display">{config.friendName}</span>
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          </div>
          <p className="text-[11px] text-slate-400">
            Personalised birthday surprise crafted with CelebrateMe · No login or external tracking
          </p>
          <div className="mt-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs text-slate-500 hover:text-slate-800 underline decoration-slate-300 underline-offset-4 cursor-pointer"
            >
              Edit card details
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
