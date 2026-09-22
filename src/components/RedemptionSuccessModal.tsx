import React from 'react';
import { CheckCircle2, Copy, Check, ShieldCheck, X } from 'lucide-react';
import { RedemptionRecord } from '../types';

interface RedemptionSuccessModalProps {
  record: RedemptionRecord | null;
  onClose: () => void;
}

export const RedemptionSuccessModal: React.FC<RedemptionSuccessModalProps> = ({ record, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!record) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(record.referenceNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in zoom-in-95 duration-200">
      <div 
        id="redemption-success-card"
        className="relative w-full max-w-md rounded-2xl border border-emerald-500/30 bg-slate-900 p-6 shadow-2xl shadow-black/80 text-center"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <h3 className="text-xl font-bold text-white mb-1">
          UPI Redemption Initiated!
        </h3>
        <p className="text-xs text-slate-300 mb-5 leading-relaxed">
          Your request to redeem <strong>{record.coinsRedeemed} coins</strong> for{' '}
          <strong className="text-emerald-400">₹{record.amountInr.toFixed(2)} INR</strong> has been logged to your UPI ID.
        </p>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 text-left text-xs mb-5">
          <div className="flex justify-between">
            <span className="text-slate-400">Recipient Name</span>
            <span className="font-semibold text-white">{record.userName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">UPI Address</span>
            <span className="font-mono font-semibold text-amber-300">{record.upiId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Amount Transferred</span>
            <span className="font-bold text-emerald-400">₹{record.amountInr.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-slate-800">
            <span className="text-slate-400">UPI Ref ID</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 font-mono text-[11px] text-slate-300 hover:text-white"
            >
              <span>{record.referenceNumber}</span>
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mb-5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Status: Processing (Credited within 1-2 business hours)</span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors"
        >
          Done & Keep Earning
        </button>
      </div>
    </div>
  );
};
