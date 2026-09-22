import { UserStats, RedemptionRecord, AdManagerConfig, AdCreative } from '../types';

const STORAGE_KEYS = {
  USER_STATS: 'earn_to_watch_user_stats',
  REDEMPTIONS: 'earn_to_watch_redemptions',
  AD_CONFIG: 'earn_to_watch_ad_config',
};

export const DEFAULT_USER_STATS: UserStats = {
  coins: 0,
  totalAdsWatched: 0,
  referralCode: null,
  isDeveloperBonus: false,
  coinsPerAd: 5,
};

export const DEFAULT_AD_CONFIG: AdManagerConfig = {
  publisherId: 'ca-pub-2425727788776772',
  bannerAdSlotId: '9827364510',
  rewardedAdUnitPath: '/2425727788776772/earn_to_watch_rewarded',
  isTestMode: false,
  adsTxtDomain: 'earntowatch.app',
};

export const SAMPLE_ADS: AdCreative[] = [
  {
    id: 'ad-google-cloud',
    brandName: 'Google Cloud Platform',
    tagline: 'Build next-generation AI apps with Gemini Models',
    description: 'Get $300 in free credits to build and deploy intelligent full-stack applications with high reliability and zero maintenance overhead.',
    badge: 'Official Sponsor',
    actionUrl: 'https://cloud.google.com',
    durationSeconds: 7,
    gradientFrom: '#1e3a8a',
    gradientTo: '#2563eb',
    category: 'Cloud & AI',
  },
  {
    id: 'ad-zerodha-kite',
    brandName: 'Kite by Zerodha',
    tagline: 'Invest in stocks, mutual funds & ETFs with zero commission',
    description: 'India’s largest stock broker platform trusted by over 1.2 Crore users with ultra-fast charts and seamless UPI payments.',
    badge: 'Top Rated Finance',
    actionUrl: 'https://zerodha.com',
    durationSeconds: 8,
    gradientFrom: '#064e3b',
    gradientTo: '#059669',
    category: 'Fintech',
  },
  {
    id: 'ad-coursera-ai',
    brandName: 'DeepLearning.AI',
    tagline: 'Master Machine Learning & Generative AI with Andrew Ng',
    description: 'Learn modern LLM architectures, fine-tuning, embeddings, and prompt engineering with hands-on labs and certified degrees.',
    badge: 'Education',
    actionUrl: 'https://deeplearning.ai',
    durationSeconds: 6,
    gradientFrom: '#4c1d95',
    gradientTo: '#7c3aed',
    category: 'Learning',
  },
  {
    id: 'ad-swiggy-one',
    brandName: 'Swiggy One',
    tagline: 'Unlimited free deliveries on food & groceries',
    description: 'Enjoy 0 delivery fees from thousands of restaurants plus instant 10-minute grocery drops on Instamart. Try 30 days trial.',
    badge: 'Lifestyle',
    actionUrl: 'https://swiggy.com',
    durationSeconds: 7,
    gradientFrom: '#7c2d12',
    gradientTo: '#ea580c',
    category: 'Food & Dining',
  },
];

export function loadUserStats(): UserStats {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_STATS);
    if (!data) return DEFAULT_USER_STATS;
    const parsed = JSON.parse(data);
    const isDev = (parsed.referralCode || '').trim().toUpperCase() === 'DEVELOPER';
    return {
      ...DEFAULT_USER_STATS,
      ...parsed,
      isDeveloperBonus: isDev,
      coinsPerAd: isDev ? 10 : 5,
    };
  } catch (e) {
    console.error('Failed to load user stats', e);
    return DEFAULT_USER_STATS;
  }
}

export function saveUserStats(stats: UserStats): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save user stats', e);
  }
}

export function loadRedemptions(): RedemptionRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.REDEMPTIONS);
    if (!data) return [];
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load redemptions', e);
    return [];
  }
}

export function saveRedemptions(records: RedemptionRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.REDEMPTIONS, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save redemptions', e);
  }
}

export function loadAdConfig(): AdManagerConfig {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.AD_CONFIG);
    if (!data) return DEFAULT_AD_CONFIG;
    const parsed = JSON.parse(data);
    if (!parsed.publisherId || parsed.publisherId.includes('9845720194827103')) {
      parsed.publisherId = DEFAULT_AD_CONFIG.publisherId;
    }
    return { ...DEFAULT_AD_CONFIG, ...parsed };
  } catch (e) {
    console.error('Failed to load ad config', e);
    return DEFAULT_AD_CONFIG;
  }
}

export function saveAdConfig(config: AdManagerConfig): void {
  try {
    localStorage.setItem(STORAGE_KEYS.AD_CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save ad config', e);
  }
}
