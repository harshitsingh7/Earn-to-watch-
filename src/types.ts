export interface UserStats {
  coins: number;
  totalAdsWatched: number;
  dailyAdsWatched: number;
  lastWatchDate: string; // YYYY-MM-DD
  referralCode: string | null;
  isDeveloperBonus: boolean;
  coinsPerAd: number;
  dailyPartnerVisits: number;
  lastPartnerVisitDate: string; // YYYY-MM-DD
}

export interface RedemptionRecord {
  id: string;
  userName: string;
  upiId: string;
  coinsRedeemed: number;
  amountInr: number;
  timestamp: string;
  status: 'pending' | 'completed' | 'processing';
  referenceNumber: string;
}

export interface AdManagerConfig {
  publisherId: string; // ca-pub-XXXXXXXXXXXXXXXX or Ad Manager Network Code
  bannerAdSlotId: string;
  rewardedAdUnitPath: string;
  isTestMode: boolean;
  adsTxtDomain: string;
}

export interface AdCreative {
  id: string;
  brandName: string;
  tagline: string;
  description: string;
  badge: string;
  actionUrl: string;
  durationSeconds: number;
  gradientFrom: string;
  gradientTo: string;
  category: string;
}
