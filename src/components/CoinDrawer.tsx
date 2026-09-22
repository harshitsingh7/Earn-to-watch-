import React, { useState } from 'react';
import { 
  X, 
  Coins, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp,
  CreditCard,
  Gift
} from 'lucide-react';
import { UserStats, RedemptionRecord } from '../types';

interface CoinDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userStats: UserStats;
  onApplyReferral: (code: string) => { success: boolean; message: string };
  onRedeem: (name: string, upiId: string, coinsToRedeem: number) => { success: boolean; message: string };
  redemptions: RedemptionRecord[];
}

export const CoinDrawer: React.FC<CoinDrawerProps> = ({
  isOpen,
  onClose,
  userStats,
  onApplyReferral,
  onRedeem,
  redemptions,
}) => {
  const [referralInput, setReferralInput] = useState('');
  const [referralFeedback, setReferralFeedback] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  // Redemption Form State
  const [name, setName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [redeemError, setRedeemError] = useState('');

  if (!isOpen) return null;

  const canRedeem = userStats.coins >= 100;
  const progressPercent = Math.min(100, (userStats.coins / 100) * 100);

  const handleReferralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referralInput.trim()) return;

    const result = onApplyReferral(referralInput.trim());
    setReferralFeedback({
      type: result.success ? 'success' : 'error',
      message: result.message,
    });
  };

  const handleRedeemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRedeemError('');

    if (!canRedeem) {
      setRedeemError('You need at least 100 coins to redeem.');
      return;
    }

    if (!name.trim()) {
      setRedeemError('Please enter your full name.');
      return;
    }

    if (!upiId.trim() || !upiId.includes('@')) {
      setRedeemError('Please enter a valid UPI ID (e.g. yourname@okhdfcbank or 9876543210@paytm).');
      return;
    }

    // Default redeem 100 coins (or blocks of 100)
    const coinsToRedeem = 100;
    const res = onRedeem(name.trim(), upiId.trim(), coinsToRedeem);
    if (!res.success) {
      setRedeemError(res.message);
    } else {
      setName('');
      setUpiId('');
      setRedeemError('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="coin-rewards-drawer" 
        className="relative w-full max-w-md h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col overflow-y-auto"
      >
        {/* Drawer Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-4 bg-slate-950/95 border-b border-slate-800 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">Coin Wallet & Rewards</h3>
              <p className="text-[11px] text-slate-400">Earn, multiply & redeem to UPI</p>
            </div>
          </div>

          <button
            onClick={onClose}
            id="btn-close-coin-drawer"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-5 space-y-6 flex-1">
          {/* Balance Overview Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/15 via-slate-900 to-slate-950 border border-amber-500/30 p-5 shadow-lg shadow-black/40">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-amber-400/90">
                  Total Balance
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-extrabold text-white tracking-tight">
                    {userStats.coins}
                  </span>
                  <span className="text-sm font-semibold text-amber-400">Coins</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  ≈ ₹{(userStats.coins * 0.1).toFixed(1)} INR Instant UPI value
                </p>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {userStats.coinsPerAd} Coins/Ad
                </span>
                <p className="text-[10px] text-slate-500 mt-1">
                  {userStats.totalAdsWatched} ads watched
                </p>
              </div>
            </div>

            {/* Progress to 100 Coins */}
            <div className="mt-4 pt-4 border-t border-slate-800">
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-300">UPI Redemption Threshold</span>
                <span className={canRedeem ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                  {userStats.coins}/100 Coins
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    canRedeem ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-amber-300'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 flex items-center justify-between">
                <span>{canRedeem ? '🎉 Threshold reached! Ready to withdraw' : `Need ${100 - userStats.coins} more coins to redeem`}</span>
                <span className="font-semibold text-slate-300">Min. 100 Coins</span>
              </p>
            </div>
          </div>

          {/* Referral Code Box */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-emerald-400" />
                Referral Code (2X Bonus)
              </h4>
              {userStats.isDeveloperBonus && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  DEVELOPER ACTIVE
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Enter referral code <span className="font-mono font-bold text-amber-300">DEVELOPER</span> to double your earnings from <strong>5 coins</strong> to <strong>10 coins</strong> per ad!
            </p>

            <form onSubmit={handleReferralSubmit} className="flex gap-2">
              <input
                type="text"
                id="input-referral-code"
                value={referralInput}
                onChange={(e) => setReferralInput(e.target.value)}
                placeholder="Enter code (e.g. DEVELOPER)"
                className="flex-1 px-3 py-2 text-xs font-mono rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                id="btn-apply-referral"
                className="px-3 py-2 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shrink-0"
              >
                Apply
              </button>
            </form>

            {referralFeedback.type && (
              <div 
                className={`mt-2.5 p-2 rounded-lg text-xs flex items-start gap-2 ${
                  referralFeedback.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                }`}
              >
                {referralFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <span>{referralFeedback.message}</span>
              </div>
            )}
          </div>

          {/* UPI Redemption Section */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-blue-400" />
                Redeem to UPI (Min. 100 Coins)
              </h4>
              <span className="text-[10px] text-slate-500 font-mono">Instant Transfer</span>
            </div>

            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              After reaching 100 coins, enter your registered name and UPI ID to redeem directly into your bank account or wallet.
            </p>

            <form onSubmit={handleRedeemSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Full Name (Account Holder)
                </label>
                <input
                  type="text"
                  id="input-redeem-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!canRedeem}
                  placeholder="e.g. Harshit Singh"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  UPI ID / Virtual Address
                </label>
                <input
                  type="text"
                  id="input-redeem-upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  disabled={!canRedeem}
                  placeholder="e.g. 9876543210@paytm or user@okhdfcbank"
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Redeem Package</span>
                <span className="font-bold text-amber-400">100 Coins = ₹10.00 INR</span>
              </div>

              {redeemError && (
                <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{redeemError}</span>
                </div>
              )}

              <button
                type="submit"
                id="btn-submit-redemption"
                disabled={!canRedeem}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  canRedeem
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/20 cursor-pointer'
                    : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                }`}
              >
                <span>{canRedeem ? 'Submit UPI Redemption' : `Unlock at 100 Coins (${100 - userStats.coins} needed)`}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Redemption History */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              Redemption History ({redemptions.length})
            </h4>

            {redemptions.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs">
                No redemptions yet. Reach 100 coins to claim your first reward!
              </div>
            ) : (
              <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
                {redemptions.map((item) => (
                  <div 
                    key={item.id}
                    className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        <span>₹{item.amountInr} via UPI</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 font-mono">
                          {item.coinsRedeemed}c
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono truncate max-w-[170px]">
                        {item.upiId} ({item.userName})
                      </div>
                      <div className="text-[9px] text-slate-500">
                        {item.timestamp}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        {item.status.toUpperCase()}
                      </span>
                      <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                        Ref: {item.referenceNumber.slice(-6)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 text-center text-[11px] text-slate-500">
          <p className="flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Verified UPI Payout Gateway with Auto-Validation
          </p>
        </div>
      </div>
    </div>
  );
};
