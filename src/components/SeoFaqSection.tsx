import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck, CheckCircle2, Zap } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_LIST: FAQItem[] = [
  {
    category: 'Earning Coins',
    question: 'How do I earn coins on Earn to Watch?',
    answer: 'Simply click "Watch Ad" to view a verified 15–30 second sponsored video. When the timer finishes, your reward coins are automatically credited to your balance. You can watch up to 10 verified ads every day.',
  },
  {
    category: 'Payouts & UPI',
    question: 'How do I redeem my coins for real cash in India via UPI?',
    answer: 'Once your wallet reaches the 100 coin milestone (equivalent to ₹10 INR), open the Coin Tab, enter your full name and valid UPI ID (e.g. yourname@oksbi or mobile@paytm), and submit. Payouts are verified and sent directly to your bank account.',
  },
  {
    category: 'Rates & Multipliers',
    question: 'What is the coin-to-rupee conversion rate and can I earn faster?',
    answer: 'Standard rate: 10 coins = ₹1.00 INR (100 coins = ₹10 INR). By using the special referral code "DEVELOPER" in the Coin Tab, you double your earnings from 5 coins to 10 coins for every single ad you watch.',
  },
  {
    category: 'Policy & Safety',
    question: 'Are the ads safe and compliant with Google policies?',
    answer: 'Yes. All ads are delivered through official Google channels. We enforce a strict 10-ad daily cap per user to avoid automated spam, ensure authentic attention, and protect advertiser value.',
  },
  {
    category: 'Withdrawal Times',
    question: 'How long does UPI payout processing take?',
    answer: 'Requests are logged with a unique transaction reference number and processed within 15 minutes to 24 business hours to ensure security against fraudulent bot claims.',
  },
];

export const SeoFaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section className="w-full max-w-2xl mt-12 mb-6 px-4 text-left" id="faq-section">
      <div className="flex items-center gap-2 mb-2">
        <HelpCircle className="w-4 h-4 text-amber-400" />
        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
          Frequently Asked Questions (FAQ)
        </h3>
      </div>
      <p className="text-xs text-slate-400 mb-4">
        Everything you need to know about watching ads, earning coins, and receiving instant UPI payouts.
      </p>

      <div className="space-y-2.5">
        {FAQ_LIST.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`rounded-xl border transition-all overflow-hidden ${
                isOpen 
                  ? 'bg-slate-900 border-amber-500/40 shadow-lg shadow-amber-500/5' 
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(index)}
                className="w-full p-4 flex items-center justify-between gap-3 text-left focus:outline-none cursor-pointer"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase tracking-wider hidden sm:inline-block">
                    {item.category}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-100">
                    {item.question}
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-amber-400' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* SEO Key Value Highlights */}
      <div className="mt-6 p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 flex flex-wrap items-center justify-around gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Instant UPI Transfer</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>100 Coins = ₹10 INR</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>100% Free to Join</span>
        </div>
      </div>
    </section>
  );
};
