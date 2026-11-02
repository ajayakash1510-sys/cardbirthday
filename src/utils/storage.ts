import { BirthdayConfig, Wish } from '../types';

const STORAGE_KEY_CONFIG = 'celebrateme_birthday_config_v1';
const STORAGE_KEY_WISHES = 'celebrateme_wishes_wall_v1';

export const DEFAULT_SAMPLE_CONFIG: BirthdayConfig = {
  friendName: 'Alex',
  friendAge: 20,
  personalMessage:
    "Happy 20th Birthday, Alex! 🎉 You bring so much energy, laughter, and wisdom into every study session and coffee break. Here's to surviving finals, laughing till our stomachs hurt, and achieving every bold dream you have set for this new decade! Keep shining bright!",
  birthdayDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days in future
  themeColor: 'pink',
  senderName: 'Sam',
};

export const INITIAL_WISHES: Wish[] = [
  {
    id: 'wish-1',
    author: 'Maya S.',
    message: 'Happy birthday to the most supportive study partner ever! 🌟 May this year bring endless adventures!',
    color: '#fef08a', // light yellow
    timestamp: Date.now() - 3600000 * 5,
    likes: 4,
  },
  {
    id: 'wish-2',
    author: 'Jordan K.',
    message: 'Cheers to another year of great laughs and late night snack runs! You rock! 🍕✨',
    color: '#fbcfe8', // light pink
    timestamp: Date.now() - 3600000 * 3,
    likes: 6,
  },
  {
    id: 'wish-3',
    author: 'Dev & Crew',
    message: 'Happy Milestone Birthday! May all your projects succeed and your dreams take flight! 🚀🎈',
    color: '#bae6fd', // light cyan
    timestamp: Date.now() - 3600000 * 1,
    likes: 8,
  },
];

// Safe LocalStorage helpers
export function loadSavedConfig(): BirthdayConfig | null {
  try {
    // 1. First check if URL hash or search params contains encoded config
    const fromUrl = loadConfigFromUrl();
    if (fromUrl) {
      // Also save to localStorage so it persists upon reload
      saveConfig(fromUrl);
      return fromUrl;
    }

    const data = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (data) {
      return JSON.parse(data) as BirthdayConfig;
    }
  } catch (err) {
    console.warn('Could not read birthday config from localStorage', err);
  }
  return null;
}

export function saveConfig(config: BirthdayConfig): boolean {
  try {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
    return true;
  } catch (err) {
    console.warn('Could not save birthday config to localStorage', err);
    return false;
  }
}

export function clearSavedConfig(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_CONFIG);
  } catch (err) {
    console.warn('Could not clear config', err);
  }
}

export function loadWishes(): Wish[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_WISHES);
    if (data) {
      const parsed = JSON.parse(data) as Wish[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read wishes from localStorage', err);
  }
  return INITIAL_WISHES;
}

export function saveWishes(wishes: Wish[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY_WISHES, JSON.stringify(wishes));
    return true;
  } catch (err) {
    console.warn('Could not save wishes to localStorage', err);
    return false;
  }
}

// URL encode / decode for frictionless sharing
export function generateShareUrl(config: BirthdayConfig): string {
  try {
    // Create shareable payload without giant raw base64 images that exceed browser URL limits
    const payload = {
      n: config.friendName,
      a: config.friendAge,
      m: config.personalMessage,
      d: config.birthdayDate,
      t: config.themeColor,
      s: config.senderName || '',
    };
    const jsonStr = JSON.stringify(payload);
    const encoded = btoa(encodeURIComponent(jsonStr));
    const url = new URL(window.location.href);
    url.searchParams.set('bday', encoded);
    return url.toString();
  } catch (err) {
    console.error('Failed to generate share URL', err);
    return window.location.href;
  }
}

function loadConfigFromUrl(): BirthdayConfig | null {
  try {
    const url = new URL(window.location.href);
    const param = url.searchParams.get('bday');
    if (!param) return null;

    const decodedStr = decodeURIComponent(atob(param));
    const data = JSON.parse(decodedStr);

    if (data && data.n) {
      return {
        friendName: data.n,
        friendAge: Number(data.a) || 18,
        personalMessage: data.m || '',
        birthdayDate: data.d || new Date().toISOString().split('T')[0],
        themeColor: data.t || 'pink',
        senderName: data.s || '',
      };
    }
  } catch (err) {
    console.warn('Failed to parse URL bday parameter', err);
  }
  return null;
}
