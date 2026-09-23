import React, { useEffect, useRef, useState } from 'react';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  Coins, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AdManagerConfig } from '../types';
import { playCoinSound } from '../utils/sound';

interface AdSenseRewardedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardClaimed: (coinsEarned: number) => void;
  coinsReward: number;
  adConfig: AdManagerConfig;
  isDeveloperBonus: boolean;
  dailyAdsRemaining: number;
}

export const AdSenseRewardedModal: React.FC<AdSenseRewardedModalProps> = ({
  isOpen,
  onClose,
  onRewardClaimed,
  coinsReward,
  adConfig,
  isDeveloperBonus,
  dailyAdsRemaining,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(15);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);
  const hasTriggeredRef = useRef(false);
  const adContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSecondsRemaining(15);
      setIsCompleted(false);
      setShowExitWarning(false);
      setAdLoaded(false);
      hasTriggeredRef.current = false;
      return;
    }

    // Attempt to push Google AdSense ad slot inside modal
    try {
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setAdLoaded(true);
        }, 300);
      }
    } catch (e) {
      console.warn('AdSense slot init:', e);
      setAdLoaded(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || isCompleted) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!hasTriggeredRef.current) {
            hasTriggeredRef.current = true;
            setIsCompleted(true);
            playCoinSound();
            confetti({
              particleCount: 75,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#f59e0b', '#fbbf24', '#3b82f6', '#10b981', '#ec4899'],
            });
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isCompleted]);

  if (!isOpen) return null;

  const handleClaim = () => {
    onRewardClaimed(coinsReward);
    onClose();
  };

  const handleAttemptClose = () => {
    if (isCompleted) {
      handleClaim();
    } else {
      setShowExitWarning(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-950/90 border-b border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 font-semibold text-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Sponsored Video
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Countdown Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold text-xs">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              {isCompleted ? (
                <span className="text-emerald-400 font-bold">Reward Ready!</span>
              ) : (
                <span>Wait {secondsRemaining}s</span>
              )}
            </div>

            <button
              onClick={handleAttemptClose}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body: Displaying Official Google AdSense Tag */}
        <div className="p-6 flex flex-col items-center justify-center min-h-[320px] bg-slate-950/60">
          <div className="text-center mb-3">
            <span className="text-[10px] uppercase tracking-widest font-mono text-slate-400">
              Sponsored Creative
            </span>
            <p className="text-xs text-slate-400 mt-0.5">
              Viewing sponsored video ad to earn coins
            </p>
          </div>

          {/* Real Google AdSense Display in Modal */}
          <div 
            ref={adContainerRef}
            className="w-full min-h-[250px] flex items-center justify-center p-2 rounded-xl bg-slate-900 border border-slate-800/80 overflow-hidden"
          >
            <ins
              className="adsbygoogle"
              style={{ display: 'block', minHeight: '250px', width: '100%', textAlign: 'center' }}
              data-ad-client="ca-pub-2425727788776772"
              data-ad-slot="9136412509"
              data-ad-format="rectangle,horizontal"
              data-full-width-responsive="true"
            />
          </div>

          {/* Progress bar */}
          <div className="w-full mt-5">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400">
                {isCompleted ? 'Viewing session completed' : 'Ad viewing session active'}
              </span>
              <span className="text-amber-400 font-bold">
                {isCompleted ? `+${coinsReward} Coins Unlocked` : `${secondsRemaining}s remaining`}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${
                  isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-amber-300'
                }`}
                style={{
                  width: `${isCompleted ? 100 : Math.min(100, ((15 - secondsRemaining) / 15) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            <span>Daily ad views left today: <strong>{dailyAdsRemaining}</strong></span>
          </div>

          {isCompleted ? (
            <button
              onClick={handleClaim}
              className="px-6 py-2.5 rounded-xl font-extrabold text-sm bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-transform active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Claim +{coinsReward} Coins</span>
            </button>
          ) : (
            <button
              onClick={handleAttemptClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
            >
              Cancel / Close
            </button>
          )}
        </div>

        {/* Exit Warning */}
        {showExitWarning && !isCompleted && (
          <div className="absolute inset-0 z-20 bg-slate-950/95 p-6 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-150">
            <AlertCircle className="w-12 h-12 text-amber-400 mb-3" />
            <h4 className="text-lg font-bold text-white mb-1">
              Leave Before Earning Coins?
            </h4>
            <p className="text-xs text-slate-300 max-w-sm mb-5 leading-relaxed">
              If you close this view now, you will lose your reward of{' '}
              <strong className="text-amber-400">{coinsReward} coins</strong>. Only {secondsRemaining}s left!
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowExitWarning(false)}
                className="px-4 py-2 rounded-xl font-bold text-xs bg-amber-400 text-slate-950 hover:bg-amber-300"
              >
                Continue Viewing ({secondsRemaining}s)
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
