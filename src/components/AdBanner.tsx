import React, { useState } from 'react';
import { ExternalLink, Info, ShieldCheck, Sparkles, Settings } from 'lucide-react';
import { AdManagerConfig } from '../types';

interface AdBannerProps {
  config: AdManagerConfig;
  onOpenSetup: () => void;
}

export const AdBanner: React.FC<AdBannerProps> = ({ config, onOpenSetup }) => {
  const [adHovered, setAdHovered] = useState(false);

  return (
    <div id="google-ad-banner-container" className="w-full mb-6">
      {/* Top Banner Wrapper with Google Ads Badge */}
      <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-3 shadow-lg shadow-black/40">
        
        {/* Ad Tag Bar */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 tracking-wider">
              SPONSORED
            </span>
            <span className="flex items-center gap-1 text-slate-400 font-medium">
              Google Ads Partner Network
              <ShieldCheck className="w-3 h-3 text-emerald-400 inline" />
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSetup}
              id="btn-banner-ad-setup"
              className="hover:text-amber-400 transition-colors flex items-center gap-1 text-[11px] font-medium text-slate-400"
              title="Configure Google Ad Manager / AdSense Slot"
            >
              <Settings className="w-3 h-3 text-slate-400" />
              <span>{config.isTestMode ? 'Test Mode' : 'Live Ad Unit'}</span>
            </button>
            <span className="text-slate-600">|</span>
            <span className="text-slate-500 text-[10px] flex items-center gap-1">
              AdChoices
              <Info className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>

        {/* Ad Body (Responsive Google Ad Display) */}
        <div
          className="relative min-h-[90px] md:min-h-[100px] flex flex-col md:flex-row items-center justify-between gap-4 p-3.5 rounded-lg bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-slate-900 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300"
          onMouseEnter={() => setAdHovered(true)}
          onMouseLeave={() => setAdHovered(false)}
        >
          {/* Ad Creative Content */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <Sparkles className="w-7 h-7 text-white animate-pulse" />
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 text-[9px] font-black px-1 rounded">
                AD
              </div>
            </div>

            <div className="flex-1 text-left">
              <div className="flex items-center gap-2 mb-0.5">
                <h4 className="text-sm md:text-base font-bold text-white tracking-tight">
                  Google Cloud for Startups & Creators
                </h4>
                <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-medium">
                  Verified Ad
                </span>
              </div>
              <p className="text-xs text-slate-300 line-clamp-2 max-w-xl leading-relaxed">
                Deploy fast, scale effortlessly, and unlock up to $2,000 in promotional Google Cloud credits. Build AI apps with ease.
              </p>
              <div className="mt-1 flex items-center gap-2 text-[11px] text-blue-400 font-medium">
                <span>cloud.google.com</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">Ad Slot: #{config.bannerAdSlotId}</span>
              </div>
            </div>
          </div>

          {/* CTA Action */}
          <div className="w-full md:w-auto flex items-center justify-end gap-2 shrink-0">
            <a
              href="https://cloud.google.com"
              target="_blank"
              rel="noreferrer"
              id="ad-banner-cta-button"
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 ${
                adHovered
                  ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20 scale-[1.02]'
                  : 'bg-blue-600 text-white hover:bg-blue-500'
              }`}
            >
              <span>Visit Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Ad Unit Metadata Footer */}
        <div className="mt-2 pt-1.5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span>Target: {config.adsTxtDomain}</span>
          <span>Google Ad Manager ID: {config.publisherId}</span>
        </div>
      </div>
    </div>
  );
};
