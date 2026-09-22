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
  Flame
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
  SAMPLE_ADS 
} from './utils/storage';
import { RewardedAdModal } from './components/RewardedAdModal';
import { CoinDrawer } from './components/CoinDrawer';
import { AdManagerSetupModal } from './components/AdManagerSetupModal';
import { RedemptionSuccessModal } from './components/RedemptionSuccessModal';
import { playCoinSound } from './utils/sound';

export default function App() {
  const [userStats, setUserStats] = useState<UserStats>(loadUserStats);
  const [redemptions, setRedemptions] = useState<RedemptionRecord[]>(loadRedemptions);
  const [adConfig, setAdConfig] = useState<AdManagerConfig>(loadAdConfig);

  // Modals & Drawers
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [isCoinDrawerOpen, setIsCoinDrawerOpen] = useState(false);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [lastRedemption, setLastRedemption] = useState<RedemptionRecord | null>(null);

  // Ad selection cycle
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isButtonPulsing, setIsButtonPulsing] = useState(true);
  const [recentEarningToast, setRecentEarningToast] = useState<{ amount: number; text: string } | null>(null);

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

  // Handle clicking "Earn Coin"
  const handleEarnCoinClick = () => {
    // Select next ad in sample queue
    setCurrentAdIndex((prev) => (prev + 1) % SAMPLE_ADS.length);
    setIsAdModalOpen(true);
  };

  // Handle completing rewarded ad
  const handleRewardClaimed = (earnedAmount: number) => {
    setUserStats((prev) => {
      const nextStats = {
        ...prev,
        coins: prev.coins + earnedAmount,
        totalAdsWatched: prev.totalAdsWatched + 1,
      };
      return nextStats;
    });

    setRecentEarningToast({
      amount: earnedAmount,
      text: userStats.isDeveloperBonus ? 'Double bonus applied! (+10)' : 'Reward granted! (+5)',
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
                Watch verified Google ads & redeem instant UPI cash
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

        {/* Central Reward System Hero Section */}
        <section className="w-full my-auto py-6 flex flex-col items-center text-center">
          
          {/* Multiplier / Referral Pill */}
          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {userStats.isDeveloperBonus ? (
              <span className="text-emerald-300 font-bold">
                Referral Bonus Active: Earning 10 Coins / Ad
              </span>
            ) : (
              <span>
                Standard Rate: <strong>5 coins</strong> for each ad watched
              </span>
            )}
            <button
              onClick={() => setIsCoinDrawerOpen(true)}
              className="text-[11px] text-amber-400 hover:text-amber-300 underline font-semibold ml-1"
            >
              {userStats.isDeveloperBonus ? 'View Code' : 'Enter Code'}
            </button>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
            Watch Ads & <span className="text-amber-400">Earn Coins</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-lg mb-8 leading-relaxed">
            Click the button below to trigger Google Ad Manager. Complete the short ad video to instantly credit coins to your wallet.
          </p>

          {/* Core Central "Earn Coin" Button */}
          <div className="relative group my-2">
            {/* Outer animated halo / glow */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 rounded-3xl blur-lg opacity-70 group-hover:opacity-100 transition duration-300 animate-pulse" />

            <button
              onClick={handleEarnCoinClick}
              id="btn-main-earn-coin"
              className="relative px-10 sm:px-14 py-5 sm:py-6 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:via-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xl sm:text-2xl uppercase tracking-wider shadow-2xl shadow-amber-500/40 transform transition-all duration-200 active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
            >
              <Coins className="w-7 h-7 fill-slate-950" />
              <span>Earn Coin</span>
              <div className="ml-1 px-2.5 py-0.5 rounded-lg bg-slate-950/20 text-slate-950 text-xs font-black tracking-normal uppercase">
                +{userStats.coinsPerAd}c
              </div>
            </button>
          </div>

          <p className="text-xs text-slate-400 mt-4 font-medium flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Recalls Ad Manager backend mediation & loads sponsored creative</span>
          </p>

          {/* Quick Stats & Progress toward 100 coin redemption milestone */}
          <div className="mt-10 w-full max-w-xl grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
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

            {/* Card 2: Ads Watched */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
                <span>Total Watched</span>
                <Flame className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <div className="text-xl font-extrabold text-white">
                {userStats.totalAdsWatched} <span className="text-xs font-normal text-slate-400">ads</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Earn rate: {userStats.coinsPerAd}c / ad
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

      {/* 1. Rewarded Ad Modal (Recalled on "Earn Coin" Tap) */}
      <RewardedAdModal
        isOpen={isAdModalOpen}
        onClose={() => setIsAdModalOpen(false)}
        onRewardClaimed={handleRewardClaimed}
        coinsReward={userStats.coinsPerAd}
        adCreative={SAMPLE_ADS[currentAdIndex]}
        adConfig={adConfig}
        isDeveloperBonus={userStats.isDeveloperBonus}
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

      {/* 3. Google Ad Manager Connection & Monetization Setup Modal */}
      <AdManagerSetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        config={adConfig}
        onSaveConfig={(newCfg) => setAdConfig(newCfg)}
      />

      {/* 4. Instant UPI Redemption Receipt Modal */}
      <RedemptionSuccessModal
        record={lastRedemption}
        onClose={() => setLastRedemption(null)}
      />
    </div>
  );
}
