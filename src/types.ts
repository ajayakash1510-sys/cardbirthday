export type ThemeColor = 'pink' | 'purple' | 'blue' | 'gold';

export interface BirthdayConfig {
  friendName: string;
  friendAge: number;
  personalMessage: string;
  birthdayDate: string; // YYYY-MM-DD
  photoUrl?: string; // base64 or object URL
  themeColor: ThemeColor;
  senderName?: string;
}

export interface Wish {
  id: string;
  author: string;
  message: string;
  color: string;
  timestamp: number;
  likes: number;
}

export interface ThemeStyles {
  name: string;
  primary: string;
  primaryHover: string;
  secondary: string;
  accent: string;
  softBg: string;
  cardBorder: string;
  gradientText: string;
  badgeBg: string;
  ringColor: string;
  buttonGradient: string;
  balloonColors: string[];
}

export const THEMES: Record<ThemeColor, ThemeStyles> = {
  pink: {
    name: 'Rose & Berry',
    primary: 'bg-rose-500',
    primaryHover: 'hover:bg-rose-600',
    secondary: 'bg-pink-100 text-rose-800',
    accent: 'text-rose-500',
    softBg: 'bg-gradient-to-b from-rose-50 via-pink-50/50 to-white',
    cardBorder: 'border-pink-200/80',
    gradientText: 'from-rose-500 via-pink-500 to-amber-500',
    badgeBg: 'bg-pink-100 text-pink-700',
    ringColor: 'focus:ring-rose-400',
    buttonGradient: 'from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-rose-200',
    balloonColors: ['#fb7185', '#f43f5e', '#ec4899', '#f472b6', '#fda4af', '#fcd34d'],
  },
  purple: {
    name: 'Lavender & Violet',
    primary: 'bg-purple-600',
    primaryHover: 'hover:bg-purple-700',
    secondary: 'bg-purple-100 text-purple-800',
    accent: 'text-purple-600',
    softBg: 'bg-gradient-to-b from-purple-50 via-fuchsia-50/40 to-white',
    cardBorder: 'border-purple-200/80',
    gradientText: 'from-purple-600 via-fuchsia-500 to-pink-500',
    badgeBg: 'bg-purple-100 text-purple-700',
    ringColor: 'focus:ring-purple-400',
    buttonGradient: 'from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 shadow-purple-200',
    balloonColors: ['#a855f7', '#8b5cf6', '#c084fc', '#d8b4fe', '#ec4899', '#818cf8'],
  },
  blue: {
    name: 'Sky & Ocean',
    primary: 'bg-sky-500',
    primaryHover: 'hover:bg-sky-600',
    secondary: 'bg-sky-100 text-sky-800',
    accent: 'text-sky-600',
    softBg: 'bg-gradient-to-b from-sky-50 via-cyan-50/40 to-white',
    cardBorder: 'border-sky-200/80',
    gradientText: 'from-sky-600 via-blue-500 to-teal-500',
    badgeBg: 'bg-sky-100 text-sky-700',
    ringColor: 'focus:ring-sky-400',
    buttonGradient: 'from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-sky-200',
    balloonColors: ['#38bdf8', '#0ea5e9', '#60a5fa', '#3b82f6', '#2dd4bf', '#a78bfa'],
  },
  gold: {
    name: 'Honey & Champagne',
    primary: 'bg-amber-500',
    primaryHover: 'hover:bg-amber-600',
    secondary: 'bg-amber-100 text-amber-800',
    accent: 'text-amber-600',
    softBg: 'bg-gradient-to-b from-amber-50/70 via-yellow-50/40 to-white',
    cardBorder: 'border-amber-200/80',
    gradientText: 'from-amber-600 via-yellow-500 to-orange-500',
    badgeBg: 'bg-amber-100 text-amber-800',
    ringColor: 'focus:ring-amber-400',
    buttonGradient: 'from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 shadow-amber-200',
    balloonColors: ['#f59e0b', '#fbbf24', '#f97316', '#fb923c', '#fde047', '#eab308'],
  },
};
