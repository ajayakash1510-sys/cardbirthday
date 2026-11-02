import React from 'react';
import { BirthdayConfig, THEMES } from '../types';
import { Heart, Clock, Sun, Orbit, Compass, Moon, Sparkles } from 'lucide-react';

interface FunFactsSectionProps {
  config: BirthdayConfig;
}

export const FunFactsSection: React.FC<FunFactsSectionProps> = ({ config }) => {
  const theme = THEMES[config.themeColor];
  const age = Math.max(config.friendAge, 1);

  // Exact calculations based on age
  const daysLived = Math.round(age * 365.2425);
  const hoursLived = daysLived * 24;
  const approxHeartbeats = Math.round(daysLived * 24 * 60 * 78); // ~78 bpm
  const approxBreaths = Math.round(daysLived * 24 * 60 * 16); // ~16 breaths/min
  const spaceKmTraveledMillions = (age * 940).toLocaleString(); // ~940 million km per solar orbit
  const sleepHours = Math.round(hoursLived * 0.33);

  const facts = [
    {
      title: 'Days of Life',
      value: daysLived.toLocaleString(),
      unit: 'Days on Earth',
      desc: 'Over thousands of sunrise and sunset memories made.',
      icon: Clock,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Hours Lived',
      value: hoursLived.toLocaleString(),
      unit: 'Hours',
      desc: 'Countless laughs, conversations, and learning moments.',
      icon: Compass,
      color: 'text-sky-500',
      bgColor: 'bg-sky-50',
    },
    {
      title: 'Heartbeats',
      value: approxHeartbeats.toLocaleString(),
      unit: 'Approx. Beats',
      desc: 'Your steadfast heart beating with passion and kindness.',
      icon: Heart,
      color: 'text-rose-500',
      bgColor: 'bg-rose-50',
    },
    {
      title: 'Breaths Taken',
      value: approxBreaths.toLocaleString(),
      unit: 'Breaths',
      desc: 'Breaths of fresh air, laughter, and calm focus.',
      icon: Sun,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Solar Orbits',
      value: age.toString(),
      unit: 'Trips Around the Sun',
      desc: 'Complete cosmic journeys through the solar system.',
      icon: Orbit,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Cosmic Travel',
      value: `${spaceKmTraveledMillions}M`,
      unit: 'Kilometers in Space',
      desc: 'Hurtling through space on spaceship Earth alongside the stars.',
      icon: Moon,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50',
    },
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-6 sm:p-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            <Sparkles className={`w-4 h-4 ${theme.accent}`} />
            <span>Milestone Statistics</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
            Fun Facts About {config.friendName}'s Journey
          </h2>
          <p className="mt-1 text-sm text-slate-600 max-w-md mx-auto">
            A quick look at the incredible milestones {config.friendName} has quietly achieved in {age} extraordinary years.
          </p>
        </div>

        {/* Fact Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {facts.map((fact, idx) => {
            const Icon = fact.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {fact.title}
                    </span>
                    <div className={`w-8 h-8 rounded-xl ${fact.bgColor} ${fact.color} flex items-center justify-center`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <p className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tabular-nums">
                    {fact.value}
                  </p>
                  <p className="text-xs font-medium text-slate-400 mt-0.5">
                    {fact.unit}
                  </p>
                </div>

                <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-200/60 leading-relaxed">
                  {fact.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
