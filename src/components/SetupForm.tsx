import React, { useState } from 'react';
import { BirthdayConfig, THEMES, ThemeColor } from '../types';
import { compressImage } from '../utils/imageCompressor';
import { DEFAULT_SAMPLE_CONFIG } from '../utils/storage';
import { Cake, Sparkles, Upload, X, Heart, Calendar, User, MessageSquare, Palette, RefreshCw } from 'lucide-react';

interface SetupFormProps {
  initialConfig: BirthdayConfig | null;
  onSave: (config: BirthdayConfig) => void;
}

const MESSAGE_IDEAS = [
  "Happy Birthday! You make every day brighter and more fun. So lucky to have you as my friend!",
  "Happy Birthday to my favorite human! May this year bring you top grades, zero stress, and endless pizza!",
  "Cheers to another year of surviving deadlines and laughing until our stomachs hurt. Keep shining!",
  "Another year older, wiser, and even more fabulous! Can't wait to celebrate you today!",
];

export const SetupForm: React.FC<SetupFormProps> = ({ initialConfig, onSave }) => {
  const [friendName, setFriendName] = useState(initialConfig?.friendName || '');
  const [friendAge, setFriendAge] = useState<number | ''>(initialConfig?.friendAge || 20);
  const [personalMessage, setPersonalMessage] = useState(
    initialConfig?.personalMessage ||
      "Happy Birthday! 🎉 You bring so much energy, laughter, and joy into every day. Wishing you a year packed with unforgettable adventures, huge achievements, and all the happiness in the world!"
  );
  const [birthdayDate, setBirthdayDate] = useState(
    initialConfig?.birthdayDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
  );
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(initialConfig?.photoUrl);
  const [themeColor, setThemeColor] = useState<ThemeColor>(initialConfig?.themeColor || 'pink');
  const [senderName, setSenderName] = useState(initialConfig?.senderName || '');
  const [isCompressing, setIsCompressing] = useState(false);
  const [formError, setFormError] = useState('');

  const currentTheme = THEMES[themeColor];

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      const compressedData = await compressImage(file, 640, 640, 0.82);
      setPhotoUrl(compressedData);
    } catch (err) {
      console.error('Failed to process photo', err);
      setFormError('Failed to upload image. Please try another photo.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoUrl(undefined);
  };

  const handleLoadSample = () => {
    setFriendName(DEFAULT_SAMPLE_CONFIG.friendName);
    setFriendAge(DEFAULT_SAMPLE_CONFIG.friendAge);
    setPersonalMessage(DEFAULT_SAMPLE_CONFIG.personalMessage);
    setBirthdayDate(DEFAULT_SAMPLE_CONFIG.birthdayDate);
    setThemeColor(DEFAULT_SAMPLE_CONFIG.themeColor);
    setSenderName(DEFAULT_SAMPLE_CONFIG.senderName || 'Sam');
    setFormError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendName.trim()) {
      setFormError("Please enter your friend's name");
      return;
    }
    const ageNum = Number(friendAge);
    if (!friendAge || isNaN(ageNum) || ageNum < 1 || ageNum > 125) {
      setFormError('Please enter a valid age (between 1 and 120)');
      return;
    }
    if (!personalMessage.trim()) {
      setFormError('Please add a short birthday message');
      return;
    }
    if (!birthdayDate) {
      setFormError('Please select the birthday date');
      return;
    }

    setFormError('');
    onSave({
      friendName: friendName.trim(),
      friendAge: ageNum,
      personalMessage: personalMessage.trim(),
      birthdayDate,
      photoUrl,
      themeColor,
      senderName: senderName.trim(),
    });
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-slate-50 flex items-center justify-center">
      <div className="w-full max-w-3xl">
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden mb-6">
          <div className="p-6 sm:p-8 text-center bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-pink-100 text-pink-600 mb-3 shadow-inner">
              <Cake className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-display">
              Create a Birthday Surprise
            </h1>
            <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
              Personalise an interactive card for your friend with an animated envelope, interactive cake with candles, popping balloons, music, and a wishes wall.
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleLoadSample}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                Fill with Example
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {formError && (
              <div className="p-3.5 text-sm rounded-xl bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                {formError}
              </div>
            )}

            {/* Friend's Name & Age */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Friend's Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={friendName}
                  onChange={(e) => setFriendName(e.target.value)}
                  placeholder="e.g. Maya, Jordan, Alex"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Cake className="w-3.5 h-3.5 text-slate-400" />
                  Age Turning <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={120}
                  value={friendAge}
                  onChange={(e) => setFriendAge(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 20"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all tabular-nums"
                />
              </div>
            </div>

            {/* Birthday Date & Sender's Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Birthday Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={birthdayDate}
                  onChange={(e) => setBirthdayDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-slate-400" />
                  Your Name (Sender)
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="e.g. With love from Sam"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Theme Colour Choice */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-slate-400" />
                Theme Colour Choice
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {(['pink', 'purple', 'blue', 'gold'] as ThemeColor[]).map((colorKey) => {
                  const theme = THEMES[colorKey];
                  const isSelected = themeColor === colorKey;
                  return (
                    <button
                      key={colorKey}
                      type="button"
                      onClick={() => setThemeColor(colorKey)}
                      className={`relative flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? `border-slate-900 bg-white ring-2 ring-slate-900/10 shadow-sm font-semibold`
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full shrink-0 shadow-inner"
                        style={{ backgroundColor: theme.balloonColors[0] }}
                      />
                      <span className="text-xs text-slate-800 capitalize">{colorKey}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Personal Message */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                  Personal Handwritten Message <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">{personalMessage.length} characters</span>
              </div>
              <textarea
                required
                rows={4}
                value={personalMessage}
                onChange={(e) => setPersonalMessage(e.target.value)}
                placeholder="Write your personal birthday wishes here..."
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all leading-relaxed"
              />
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-slate-400 font-medium">Quick ideas:</span>
                {MESSAGE_IDEAS.map((idea, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPersonalMessage(idea)}
                    className="text-[11px] text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md transition-colors cursor-pointer text-left truncate max-w-xs"
                  >
                    "{idea.slice(0, 32)}..."
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Upload (Optional) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-slate-400" />
                Optional Photo (Shows in a Polaroid frame)
              </label>

              {photoUrl ? (
                <div className="relative inline-block border border-slate-200 rounded-2xl p-2 bg-slate-50">
                  <img
                    src={photoUrl}
                    alt="Birthday preview"
                    className="w-36 h-36 object-cover rounded-xl shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="absolute -top-2 -right-2 w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-rose-600 transition-colors shadow cursor-pointer"
                    title="Remove photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-slate-400 rounded-2xl p-6 cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <Upload className="w-6 h-6 text-slate-400 mb-1.5" />
                  <span className="text-xs font-medium text-slate-700">
                    {isCompressing ? 'Optimizing photo...' : 'Click or tap to upload a photo'}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, or WEBP from device</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={isCompressing}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Live Mini Preview */}
            <div className={`p-4 rounded-2xl border ${currentTheme.cardBorder} ${currentTheme.softBg}`}>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-semibold uppercase tracking-wider text-[10px]">Surprise Preview</span>
                <span className="capitalize text-[11px] font-medium">{themeColor} Theme</span>
              </div>
              <p className="text-lg font-bold text-slate-900 font-display">
                Happy {friendAge ? `${friendAge}th` : ''} Birthday, {friendName || '[Friend Name]'}! 🎉
              </p>
              <p className="text-xs text-slate-600 line-clamp-1 italic mt-0.5 font-handwriting text-base">
                "{personalMessage || 'Your personal note here...'}"
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className={`w-full py-3.5 px-6 rounded-2xl text-white font-semibold text-sm shadow-md bg-gradient-to-r ${currentTheme.buttonGradient} flex items-center justify-center gap-2 active:scale-[0.99] transition-all cursor-pointer`}
              >
                <Sparkles className="w-4 h-4" />
                Create Birthday Surprise
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
