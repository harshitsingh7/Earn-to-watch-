import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink, 
  Coins, 
  CheckCircle2, 
  AlertCircle,
  Loader2 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AdCreative, AdManagerConfig } from '../types';
import { playCoinSound } from '../utils/sound';

interface RewardedAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardClaimed: (coinsEarned: number) => void;
  coinsReward: number;
  adCreative: AdCreative;
  adConfig: AdManagerConfig;
  isDeveloperBonus: boolean;
}

export const RewardedAdModal: React.FC<RewardedAdModalProps> = ({
  isOpen,
  onClose,
  onRewardClaimed,
  coinsReward,
  adCreative,
  adConfig,
  isDeveloperBonus,
}) => {
  const [loadingBackend, setLoadingBackend] = useState(true);
  const [secondsRemaining, setSecondsRemaining] = useState(adCreative.durationSeconds || 6);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const hasTriggeredRewardRef = useRef(false);

  // Simulate backend recalling Google Ad Manager GPT tag / Mediation
  useEffect(() => {
    if (!isOpen) {
      setLoadingBackend(true);
      setSecondsRemaining(adCreative.durationSeconds || 6);
      setIsCompleted(false);
      setShowExitWarning(false);
      hasTriggeredRewardRef.current = false;
      return;
    }

    setLoadingBackend(true);
    const backendTimeout = setTimeout(() => {
      setLoadingBackend(false);
    }, 1100);

    return () => clearTimeout(backendTimeout);
  }, [isOpen, adCreative]);

  // Countdown timer for Rewarded Ad
  useEffect(() => {
    if (!isOpen || loadingBackend || isCompleted) return;

    if (secondsRemaining <= 0) {
      if (!hasTriggeredRewardRef.current) {
        hasTriggeredRewardRef.current = true;
        setIsCompleted(true);
        playCoinSound();
        triggerConfetti();
      }
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!hasTriggeredRewardRef.current) {
            hasTriggeredRewardRef.current = true;
            setIsCompleted(true);
            playCoinSound();
            triggerConfetti();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, loadingBackend, secondsRemaining, isCompleted]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#fbbf24', '#3b82f6', '#10b981', '#ec4899'],
    });
  };

  const handleClaimAndClose = () => {
    onRewardClaimed(coinsReward);
    onClose();
  };

  const handleAttemptClose = () => {
    if (isCompleted) {
      handleClaimAndClose();
    } else {
      setShowExitWarning(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div 
        id="rewarded-ad-dialog" 
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900 shadow-2xl shadow-black/80 flex flex-col"
      >
        {/* Ad Header: Google Ad Manager indicator & status */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 font-semibold text-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Google Ad Manager Rewarded Unit
            </span>
            <span className="hidden sm:inline-block text-[11px] text-slate-500 font-mono">
              {adConfig.rewardedAdUnitPath}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Countdown / Reward Badge */}
            {!loadingBackend && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold text-xs">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                {isCompleted ? (
                  <span className="text-emerald-400 font-bold">Reward Unlocked!</span>
                ) : (
                  <span>Reward in {secondsRemaining}s</span>
                )}
              </div>
            )}

            {/* Mute button */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={handleAttemptClose}
              id="btn-close-rewarded-ad"
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close Ad"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Ad Body Content */}
        <div className="relative min-h-[380px] p-6 flex flex-col justify-between overflow-hidden">
          {/* Background Decorative Lighting */}
          <div 
            className="absolute inset-0 opacity-25 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 40%, ${adCreative.gradientTo} 0%, transparent 70%)`
            }}
          />

          {loadingBackend ? (
            /* Backend Recall / Mediation Loading State */
            <div className="my-auto flex flex-col items-center justify-center py-12 text-center">
              <div className="relative mb-4">
                <Loader2 className="w-12 h-12 text-amber-400 animate-spin" />
                <Coins className="w-5 h-5 text-amber-400 absolute top-3.5 left-3.5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                Recalling Google Ad Manager...
              </h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Requesting rewarded video creative from Google Ad Exchange backend slot. Verifying user session for reward credit.
              </p>
              <div className="mt-4 px-3 py-1 rounded bg-slate-800/80 text-[11px] font-mono text-slate-400 border border-slate-700">
                Unit: {adConfig.rewardedAdUnitPath}
              </div>
            </div>
          ) : (
            /* Ad Creative Active State */
            <>
              {/* Top Banner inside Creative */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-white/10 text-white border border-white/20 uppercase tracking-wider backdrop-blur-sm">
                    {adCreative.category}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {adCreative.badge}
                  </span>
                </div>

                {isDeveloperBonus && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    2X DEVELOPER Bonus Active (+10)
                  </span>
                )}
              </div>

              {/* Main Ad Showcase */}
              <div className="relative z-10 my-auto text-center py-6">
                <div 
                  className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20 transform transition-transform hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${adCreative.gradientFrom}, ${adCreative.gradientTo})`
                  }}
                >
                  <Sparkles className="w-10 h-10 text-white animate-pulse" />
                </div>

                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-2">
                  {adCreative.brandName}
                </h2>
                <p className="text-base md:text-lg font-semibold text-amber-300 mb-3 max-w-md mx-auto leading-snug">
                  "{adCreative.tagline}"
                </p>
                <p className="text-xs md:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                  {adCreative.description}
                </p>

                <div className="mt-5 flex justify-center">
                  <a
                    href={adCreative.actionUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all hover:scale-[1.02]"
                  >
                    <span>Visit Sponsor Website</span>
                    <ExternalLink className="w-4 h-4 text-slate-300" />
                  </a>
                </div>
              </div>

              {/* Reward Progress Bar */}
              <div className="relative z-10 mt-auto pt-4 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                  <span className="text-slate-400">
                    {isCompleted ? 'Video Ad Complete' : 'Viewing Video Ad...'}
                  </span>
                  <span className="text-amber-400 font-bold">
                    {isCompleted ? `+${coinsReward} Coins Ready!` : `${secondsRemaining}s left to earn reward`}
                  </span>
                </div>

                {/* Progress bar line */}
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${
                      isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-amber-300'
                    }`}
                    style={{
                      width: `${
                        isCompleted
                          ? 100
                          : Math.min(
                              100,
                              ((adCreative.durationSeconds - secondsRemaining) /
                                adCreative.durationSeconds) *
                                100
                            )
                      }%`,
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Ad Footer Action Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400 text-center sm:text-left">
            <span>Powered by Google Publisher Tag (GPT) & Ad Manager Web Rewarded SDK</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {isCompleted ? (
              <button
                onClick={handleClaimAndClose}
                id="btn-claim-ad-reward"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-extrabold text-sm bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
                <span>Claim +{coinsReward} Coins</span>
              </button>
            ) : (
              <button
                onClick={handleAttemptClose}
                disabled={loadingBackend}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                Skip / Close Ad
              </button>
            )}
          </div>
        </div>

        {/* Exit Warning Dialog if user attempts to close early */}
        {showExitWarning && !isCompleted && (
          <div className="absolute inset-0 z-20 bg-slate-950/95 p-6 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-150">
            <AlertCircle className="w-12 h-12 text-amber-400 mb-3" />
            <h4 className="text-lg font-bold text-white mb-1">
              Leave Before Earning Coins?
            </h4>
            <p className="text-xs text-slate-300 max-w-sm mb-5 leading-relaxed">
              If you close this ad now, you will lose your reward of{' '}
              <strong className="text-amber-400">{coinsReward} coins</strong>. Only {secondsRemaining} seconds remaining!
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowExitWarning(false)}
                className="px-4 py-2 rounded-xl font-bold text-xs bg-amber-400 text-slate-950 hover:bg-amber-300"
              >
                Continue Watching ({secondsRemaining}s)
              </button>
              <button
                onClick={() => {
                  setShowExitWarning(false);
                  onClose();
                }}
                className="px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-rose-400"
              >
                Leave Without Coins
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
