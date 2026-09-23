import React, { useState, useEffect } from 'react';
import { 
  Coins, 
  Play, 
  Sparkles, 
  TrendingUp, 
  Gift, 
  CheckCircle2, 
  Zap,
  Award,
  ArrowUpRight,
  Flame,
  Clock,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserStats, RedemptionRecord, AdManagerConfig } from './types';
import { 
  loadUserStats, 
  saveUserStats, 
  loadRedemptions, 
  saveRedemptions, 
  loadAdConfig, 
  saveAdConfig,
} from './utils/storage';
import { AdSenseRewardedModal } from './components/AdSenseRewardedModal';
import { CoinDrawer } from './components/CoinDrawer';
import { AdManagerSetupModal } from './components/AdManagerSetupModal';
import { RedemptionSuccessModal } from './components/RedemptionSuccessModal';
import { GoogleAdUnit } from './components/GoogleAdUnit';
import { SeoFaqSection } from './components/SeoFaqSection';
import { playCoinSound } from './utils/sound';

const DAILY_AD_LIMIT = 10;

export default function App() {
  const [userStats, setUserStats] = useState<UserStats>(loadUserStats);
  const [redemptions, setRedemptions] = useState<RedemptionRecord[]>(loadRedemptions);
  const [adConfig, setAdConfig] = useState<AdManagerConfig>(loadAdConfig);

  // Modals & Drawers
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [isCoinDrawerOpen, setIsCoinDrawerOpen] = useState(false);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [lastRedemption, setLastRedemption] = useState<RedemptionRecord | null>(null);

  const [recentEarningToast, setRecentEarningToast] = useState<{ amount: number; text: string } | null>(null);
  const [limitWarningToast, setLimitWarningToast] = useState<string | null>(null);

  // Persist state changes
  useEffect(() => {
    saveUserStats(userStats);
  }, [userStats]);

  useEffect(() => {
    saveRedemptions(redemptions);
  }, [redemptions]);

  useEffect(() => {
    saveAdConfig(adConfig);
  }, [adConfig]);

  const dailyAdsWatched = userStats.dailyAdsWatched || 0;
  const remainingAdsToday = Math.max(0, DAILY_AD_LIMIT - dailyAdsWatched);
  const isDailyLimitReached = remainingAdsToday === 0;

  // Handle clicking "Watch Ad (Earn Coin)"
  const handleEarnCoinClick = () => {
    if (isDailyLimitReached) {
      setLimitWarningToast('Daily limit reached! You can watch a maximum of 10 ads per day to ensure high-quality advertising.');
      setTimeout(() => setLimitWarningToast(null), 5000);
      return;
    }
    setIsAdModalOpen(true);
  };

  // Handle completing rewarded ad
  const handleRewardClaimed = (earnedAmount: number) => {
    setUserStats((prev) => {
      const today = new Date().toISOString().split('T')[0];
      const nextDaily = (prev.lastWatchDate === today ? prev.dailyAdsWatched : 0) + 1;
      return {
        ...prev,
        coins: prev.coins + earnedAmount,
        totalAdsWatched: prev.totalAdsWatched + 1,
        dailyAdsWatched: nextDaily,
        lastWatchDate: today,
      };
    });

    setRecentEarningToast({
      amount: earnedAmount,
      text: userStats.isDeveloperBonus ? 'Double bonus applied! (+10)' : 'Google Ad reward granted! (+5)',
    });

    setTimeout(() => {
      setRecentEarningToast(null);
    }, 4000);
  };

  // Apply referral code
  const handleApplyReferral = (code: string): { success: boolean; message: string } => {
    const clean = code.trim().toUpperCase();
    if (clean === 'DEVELOPER') {
      const updated: UserStats = {
        ...userStats,
        referralCode: 'DEVELOPER',
        isDeveloperBonus: true,
        coinsPerAd: 10,
      };
      setUserStats(updated);
      playCoinSound();
      confetti({ particleCount: 50, spread: 60 });
      return {
        success: true,
        message: 'Success! DEVELOPER code activated. You now earn 10 coins per ad (2x multiplier)!',
      };
    } else {
      return {
        success: false,
        message: 'Invalid code. Tip: Use referral code "DEVELOPER" to unlock 10 coins per ad!',
      };
    }
  };

  // Redeem coins to UPI
  const handleRedeem = (name: string, upiId: string, coinsToRedeem: number): { success: boolean; message: string } => {
    if (userStats.coins < 100) {
      return { success: false, message: 'You need at least 100 coins to redeem.' };
    }

    if (coinsToRedeem > userStats.coins) {
      return { success: false, message: 'Insufficient coins.' };
    }

    const amountInr = (coinsToRedeem / 100) * 10; // 100 coins = ₹10
    const newRecord: RedemptionRecord = {
      id: `red-${Date.now()}`,
      userName: name,
      upiId,
      coinsRedeemed: coinsToRedeem,
      amountInr,
      timestamp: new Date().toLocaleString(),
      status: 'processing',
      referenceNumber: `UPI${Math.floor(100000000000 + Math.random() * 900000000000)}`,
    };

    setUserStats((prev) => ({
      ...prev,
      coins: prev.coins - coinsToRedeem,
    }));

    setRedemptions((prev) => [newRecord, ...prev]);
    setLastRedemption(newRecord);
    setIsCoinDrawerOpen(false);
    playCoinSound();
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });

    return { success: true, message: 'Redemption request logged!' };
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-x-hidden selection:bg-amber-500 selection:text-slate-950">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Navigation Bar */}
      <header className="sticky top-0 z-30 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left Top: Name "earn to watch" */}
          <div className="flex items-center gap-3" id="brand-header">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/20">
              <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-white capitalize leading-tight flex items-center gap-1.5">
                <span>earn to watch</span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  Ads & Rewards
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 font-medium hidden xs:block">
                Watch verified ads & redeem instant UPI rewards
              </p>
            </div>
          </div>

          {/* Right Top Header Actions & Coin Tab */}
          <div className="flex items-center gap-2.5">
            {/* Top Right Corner Coin Tab */}
            <button
              onClick={() => setIsCoinDrawerOpen(true)}
              id="btn-top-right-coin-tab"
              className="group relative px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 via-slate-900 to-amber-500/10 border border-amber-500/40 hover:border-amber-400 text-amber-300 hover:text-amber-200 transition-all shadow-md shadow-amber-500/10 flex items-center gap-2"
              title="Open Coin Tab & Rewards"
            >
              <div className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-sm">
                <Coins className="w-4 h-4 fill-slate-950" />
              </div>
              <div className="text-left">
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-extrabold text-white leading-none">
                    {userStats.coins}
                  </span>
                  <span className="text-[11px] font-bold text-amber-400">Coins</span>
                </div>
                <div className="text-[10px] text-slate-400 leading-none mt-0.5">
                  {userStats.isDeveloperBonus ? (
                    <span className="text-emerald-400 font-bold">+10/ad Active</span>
                  ) : (
                    <span>5 coins/ad</span>
                  )}
                </div>
              </div>

              {/* Status Dot */}
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping group-hover:bg-amber-300" />
            </button>
          </div>
        </div>
      </header>

      {/* Main App Container */}
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col items-center">
        {/* Earning Toast Notification */}
        {recentEarningToast && (
          <div className="mb-4 w-full max-w-md animate-in slide-in-from-top-4 fade-in duration-300">
            <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-lg shadow-emerald-950/40">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{recentEarningToast.text}</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold font-mono">
                +{recentEarningToast.amount} Coins
              </span>
            </div>
          </div>
        )}

        {/* Daily Limit Warning Toast */}
        {limitWarningToast && (
          <div className="mb-4 w-full max-w-md animate-in slide-in-from-top-4 fade-in duration-300">
            <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs font-semibold flex items-center gap-2 shadow-lg">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{limitWarningToast}</span>
            </div>
          </div>
        )}

        {/* Central Reward System Hero Section */}
        <section className="w-full my-auto py-4 flex flex-col items-center text-center">
          
          {/* Daily Limit Tracker Pill */}
          <div className="mb-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 shadow-inner">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>
              Daily Ads Watched: <strong className={isDailyLimitReached ? 'text-rose-400' : 'text-amber-400'}>{dailyAdsWatched} / {DAILY_AD_LIMIT}</strong>
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">
              {isDailyLimitReached ? 'Resets at midnight' : `${remainingAdsToday} remaining today`}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
            Watch Ads & <span className="text-amber-400">Earn Coins</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mb-6 leading-relaxed">
            Watch sponsored video ads to earn coins! You can watch up to 10 verified ads per day.
          </p>

          {/* Core Central "Watch Ad (Earn Coin)" Button */}
          <div className="relative group my-2">
            <div className={`absolute -inset-1.5 rounded-3xl blur-lg transition duration-300 ${
              isDailyLimitReached 
                ? 'bg-slate-700/50 opacity-40' 
                : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 opacity-70 group-hover:opacity-100 animate-pulse'
            }`} />

            <button
              onClick={handleEarnCoinClick}
              disabled={isDailyLimitReached}
              id="btn-main-earn-coin"
              className={`relative px-10 sm:px-14 py-5 sm:py-6 rounded-2xl font-black text-xl sm:text-2xl uppercase tracking-wider shadow-2xl transform transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer ${
                isDailyLimitReached
                  ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  : 'bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:via-amber-400 hover:to-yellow-400 text-slate-950 active:scale-95 shadow-amber-500/40'
              }`}
            >
              <Coins className={`w-7 h-7 ${isDailyLimitReached ? 'text-slate-500' : 'fill-slate-950'}`} />
              <span>{isDailyLimitReached ? 'Daily Limit Reached' : 'Watch Ad'}</span>
              <div className={`ml-1 px-2.5 py-0.5 rounded-lg text-xs font-black tracking-normal uppercase ${
                isDailyLimitReached ? 'bg-slate-700 text-slate-400' : 'bg-slate-950/20 text-slate-950'
              }`}>
                +{userStats.coinsPerAd}c
              </div>
            </button>
          </div>

          <p className="text-xs text-slate-400 mt-3 font-medium flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Fair reward policy: 10 ads daily limit per user</span>
          </p>

          {/* Quick Stats & Progress toward 100 coin redemption milestone */}
          <div className="mt-8 w-full max-w-xl grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            {/* Card 1: Balance */}
            <div 
              onClick={() => setIsCoinDrawerOpen(true)}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
                <span>Wallet Balance</span>
                <Coins className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-xl font-extrabold text-white">
                {userStats.coins} <span className="text-xs font-normal text-amber-400">coins</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                ≈ ₹{(userStats.coins * 0.1).toFixed(1)} INR
              </div>
            </div>

            {/* Card 2: Daily Ads Watched */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
                <span>Today's Limit</span>
                <Flame className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <div className="text-xl font-extrabold text-white">
                {dailyAdsWatched} / {DAILY_AD_LIMIT}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Total: {userStats.totalAdsWatched} ads
              </div>
            </div>

            {/* Card 3: 100 Coin Redemption Goal */}
            <div 
              onClick={() => setIsCoinDrawerOpen(true)}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
                <span>Redeem Target</span>
                <Award className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-xl font-extrabold text-white">
                {Math.min(100, userStats.coins)}/100
              </div>
              <div className="text-[11px] text-emerald-400 mt-0.5 font-medium flex items-center gap-1">
                {userStats.coins >= 100 ? (
                  <span>Ready to Withdraw!</span>
                ) : (
                  <span>{100 - userStats.coins} coins to unlock UPI</span>
                )}
                <ArrowUpRight className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* Referral Banner Prompt */}
          {!userStats.isDeveloperBonus && (
            <div className="mt-6 w-full max-w-xl p-3.5 rounded-xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 text-left">
                <Gift className="w-5 h-5 text-purple-400 shrink-0" />
                <div>
                  <span className="font-bold text-white">Want 10 coins per ad instead of 5?</span>
                  <p className="text-slate-400 text-[11px]">
                    Enter referral code <strong className="text-amber-300 font-mono">DEVELOPER</strong> in the coin tab!
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCoinDrawerOpen(true)}
                id="btn-quick-apply-code"
                className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shrink-0 transition-colors"
              >
                Apply Code
              </button>
            </div>
          )}

          {/* Official Google AdSense Display Banner */}
          <div className="w-full max-w-xl mt-6">
            <GoogleAdUnit 
              slot="9136412509" 
              client="ca-pub-2425727788776772" 
            />
          </div>

          {/* SEO Rich FAQs and Explanations */}
          <SeoFaqSection />
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950 px-4 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} Earn to Watch — UPI Rewards Platform</span>
          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => setIsCoinDrawerOpen(true)} className="hover:text-amber-400">
              Coin Tab
            </button>
            <span>•</span>
            <span>Referral: DEVELOPER (10c/ad)</span>
          </div>
        </div>
      </footer>

      {/* 1. Official Google AdSense Rewarded Modal */}
      <AdSenseRewardedModal
        isOpen={isAdModalOpen}
        onClose={() => setIsAdModalOpen(false)}
        onRewardClaimed={handleRewardClaimed}
        coinsReward={userStats.coinsPerAd}
        adConfig={adConfig}
        isDeveloperBonus={userStats.isDeveloperBonus}
        dailyAdsRemaining={remainingAdsToday}
      />

      {/* 2. Top Right Corner Coin Tab Drawer */}
      <CoinDrawer
        isOpen={isCoinDrawerOpen}
        onClose={() => setIsCoinDrawerOpen(false)}
        userStats={userStats}
        onApplyReferral={handleApplyReferral}
        onRedeem={handleRedeem}
        redemptions={redemptions}
      />

      {/* 4. Google Ad Manager Connection & Monetization Setup Modal */}
      <AdManagerSetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        config={adConfig}
        onSaveConfig={(newCfg) => setAdConfig(newCfg)}
      />

      {/* 5. Instant UPI Redemption Receipt Modal */}
      <RedemptionSuccessModal
        record={lastRedemption}
        onClose={() => setLastRedemption(null)}
      />
    </div>
  );
}
