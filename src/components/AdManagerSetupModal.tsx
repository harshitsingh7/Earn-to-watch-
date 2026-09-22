import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  ShieldCheck, 
  HelpCircle, 
  Copy, 
  Check, 
  ExternalLink, 
  DollarSign, 
  ArrowRight,
  CheckCircle2,
  FileCode,
  Globe,
  Radio,
  Sparkles,
  ChevronRight,
  Eye
} from 'lucide-react';
import { AdManagerConfig } from '../types';

interface AdManagerSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AdManagerConfig;
  onSaveConfig: (newConfig: AdManagerConfig) => void;
}

export const AdManagerSetupModal: React.FC<AdManagerSetupModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [formData, setFormData] = useState<AdManagerConfig>({ ...config });
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [copiedAdsTxt, setCopiedAdsTxt] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'stepByStep' | 'config' | 'guide'>('stepByStep');

  if (!isOpen) return null;

  const cleanPubId = formData.publisherId.replace('ca-', '').trim();
  const adsTxtContent = `google.com, ${cleanPubId || 'pub-XXXXXXXXXXXXXXXX'}, DIRECT, f08c47fec0942fa0`;

  const handleCopyAdsTxt = () => {
    navigator.clipboard.writeText(adsTxtContent);
    setCopiedAdsTxt(true);
    setTimeout(() => setCopiedAdsTxt(false), 2000);
  };

  const handleSaveStep = () => {
    onSaveConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div 
        id="ad-manager-setup-modal" 
        className="relative w-full max-w-2xl max-h-[92vh] rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight flex items-center gap-2">
                <span>Google Ad Manager Connection Assistant</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                  1-by-1 Setup
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Step-by-step instructions to find and plug in your real Google Ad units
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('stepByStep')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'stepByStep'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>1-by-1 Interactive Guide (Start Here)</span>
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'config'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>All IDs & Codes</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>FAQ & Payout Rules</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* TAB 1: 1-BY-1 STEP-BY-STEP WIZARD */}
          {activeTab === 'stepByStep' && (
            <div className="space-y-6">
              {/* Stepper Progress Indicator */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { num: 1, label: 'Publisher ID' },
                  { num: 2, label: 'Banner Slot' },
                  { num: 3, label: 'Rewarded Ad' },
                  { num: 4, label: 'Domain & ads.txt' },
                ].map((s) => (
                  <button
                    key={s.num}
                    onClick={() => setCurrentStep(s.num)}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      currentStep === s.num
                        ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 shadow-sm'
                        : currentStep > s.num
                        ? 'bg-slate-900 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold mb-0.5">
                      <span>STEP {s.num}</span>
                      {currentStep > s.num && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                    </div>
                    <div className="font-semibold truncate text-[11px]">{s.label}</div>
                  </button>
                ))}
              </div>

              {/* STEP 1: PUBLISHER ID OR NETWORK CODE */}
              {currentStep === 1 && (
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        STEP 1 OF 4
                      </span>
                      <h4 className="text-base font-bold text-white mt-1">
                        Find Your Publisher ID or Network Code
                      </h4>
                    </div>
                    <a
                      href="https://admanager.google.com"
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-[11px] font-semibold flex items-center gap-1 border border-blue-500/30"
                    >
                      <span>Open Ad Manager</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="space-y-2 text-slate-300 leading-relaxed bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                    <p className="font-semibold text-white">Where to find this in your Google Console:</p>
                    <div className="space-y-1.5 pl-2">
                      <p>
                        <strong>If using Google Ad Manager (GAM):</strong><br />
                        1. Log into <a href="https://admanager.google.com" target="_blank" rel="noreferrer" className="text-blue-400 underline">admanager.google.com</a>.<br />
                        2. Look at the top-left or go to <strong>Admin &gt; Global settings &gt; Network settings</strong>.<br />
                        3. You will see <strong>"Network code"</strong> (e.g. <code className="text-amber-300 font-mono">/21775744923/</code>).
                      </p>
                      <div className="border-t border-slate-800 my-2 pt-2">
                        <p>
                          <strong>If using Google AdSense:</strong><br />
                          1. Log into <a href="https://adsense.google.com" target="_blank" rel="noreferrer" className="text-blue-400 underline">adsense.google.com</a>.<br />
                          2. Click on <strong>Account &gt; Settings &gt; Account information</strong>.<br />
                          3. Copy your <strong>"Publisher ID"</strong> (starts with <code className="text-amber-300 font-mono">pub-XXXXXXXXXXXXX</code> or <code className="text-amber-300 font-mono">ca-pub-XXXXXXXXXXXXX</code>).
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Input field for step 1 */}
                  <div>
                    <label className="block font-semibold text-slate-200 mb-1">
                      Paste your Publisher ID or Network Code here:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.publisherId}
                        onChange={(e) => setFormData({ ...formData, publisherId: e.target.value })}
                        placeholder="e.g. ca-pub-9845720194827103 or /21775744923/"
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                      />
                      <button
                        onClick={handleSaveStep}
                        className="px-4 py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => {
                        handleSaveStep();
                        setCurrentStep(2);
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center gap-1.5"
                    >
                      <span>Proceed to Step 2</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: TOP BANNER AD UNIT */}
              {currentStep === 2 && (
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        STEP 2 OF 4
                      </span>
                      <h4 className="text-base font-bold text-white mt-1">
                        Create & Find the Top Banner Ad Unit
                      </h4>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">Format: 728x90 or Responsive</span>
                  </div>

                  <div className="space-y-2 text-slate-300 leading-relaxed bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                    <p className="font-semibold text-white">How to create & get this unit in your console:</p>
                    <div className="space-y-1 pl-2">
                      <p>
                        1. In Google Ad Manager, click <strong>Inventory &gt; Ad units &gt; New ad unit</strong>.<br />
                        2. Choose <strong>Parent ad unit</strong>: Top level.<br />
                        3. Set <strong>Name</strong>: <code className="text-amber-300 font-mono">earn_to_watch_banner</code>.<br />
                        4. Under <strong>Sizes</strong>, select <strong>Leaderboard (728x90)</strong> or <strong>Fluid / Responsive</strong>.<br />
                        5. Click <strong>Save</strong>. In the Ad units list, click on it, then click <strong>Tags</strong> and copy the ad unit path or slot code.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-200 mb-1">
                      Paste Banner Ad Unit Slot / Path here:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.bannerAdSlotId}
                        onChange={(e) => setFormData({ ...formData, bannerAdSlotId: e.target.value })}
                        placeholder="e.g. 9827364510 or /21775744923/earn_to_watch_banner"
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                      />
                      <button
                        onClick={handleSaveStep}
                        className="px-4 py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="px-3 py-2 rounded-xl text-slate-400 hover:text-white"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => {
                        handleSaveStep();
                        setCurrentStep(3);
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center gap-1.5"
                    >
                      <span>Proceed to Step 3</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: REWARDED WEB AD UNIT */}
              {currentStep === 3 && (
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        STEP 3 OF 4
                      </span>
                      <h4 className="text-base font-bold text-white mt-1">
                        Create & Find the Rewarded Web Ad Unit
                      </h4>
                    </div>
                    <span className="text-xs text-amber-400 font-semibold">High CPM Revenue</span>
                  </div>

                  <div className="space-y-2 text-slate-300 leading-relaxed bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                    <p className="font-semibold text-white">How to set up the Rewarded Web Unit in Ad Manager:</p>
                    <div className="space-y-1 pl-2">
                      <p>
                        1. Go to <strong>Inventory &gt; Ad units &gt; New ad unit</strong>.<br />
                        2. Name: <code className="text-amber-300 font-mono">earn_to_watch_rewarded</code>.<br />
                        3. For <strong>Format</strong> or <strong>Size</strong>, choose <strong>"Out-of-page"</strong> and select <strong>"Rewarded"</strong> format.<br />
                        4. (Optional) Set the reward: <strong>5 Coins</strong>.<br />
                        5. Click <strong>Save</strong> and copy the full path (e.g. <code className="text-amber-300 font-mono">/21775744923/earn_to_watch_rewarded</code>).
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-200 mb-1">
                      Paste Rewarded Ad Unit Path here:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.rewardedAdUnitPath}
                        onChange={(e) => setFormData({ ...formData, rewardedAdUnitPath: e.target.value })}
                        placeholder="e.g. /21775744923/earn_to_watch_rewarded"
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                      />
                      <button
                        onClick={handleSaveStep}
                        className="px-4 py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-3 py-2 rounded-xl text-slate-400 hover:text-white"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => {
                        handleSaveStep();
                        setCurrentStep(4);
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center gap-1.5"
                    >
                      <span>Proceed to Step 4</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: DOMAIN & ADS.TXT */}
              {currentStep === 4 && (
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        STEP 4 OF 4 (FINAL)
                      </span>
                      <h4 className="text-base font-bold text-white mt-1">
                        Domain Verification & Live ads.txt
                      </h4>
                    </div>
                    <span className="text-xs text-emerald-400 font-semibold">Pre-Configured!</span>
                  </div>

                  <div className="space-y-2 text-slate-300 leading-relaxed bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                    <p className="font-semibold text-white">Your ads.txt is already created in this app!</p>
                    <p className="text-xs text-slate-400">
                      We have generated your <code className="text-amber-300">/ads.txt</code> file in the public folder. When you connect your domain or open the URL below, Google will be able to verify your publisher ownership:
                    </p>
                    
                    {/* Live preview of ads.txt */}
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] flex items-center justify-between text-slate-200">
                      <span>{adsTxtContent}</span>
                      <button
                        onClick={handleCopyAdsTxt}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 text-[10px] font-bold flex items-center gap-1"
                      >
                        {copiedAdsTxt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copiedAdsTxt ? 'Copied' : 'Copy'}
                      </button>
                    </div>

                    <div className="pt-1 flex items-center gap-2">
                      <a
                        href="/ads.txt"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:underline font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View live /ads.txt on this app</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-200 mb-1">
                      Your Custom Domain Name (e.g. earntowatch.com)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.adsTxtDomain}
                        onChange={(e) => setFormData({ ...formData, adsTxtDomain: e.target.value })}
                        placeholder="e.g. earntowatch.com"
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                      />
                      <button
                        onClick={handleSaveStep}
                        className="px-4 py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  </div>

                  {/* Production switch */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">Live Ad Serving Mode</div>
                      <div className="text-[10px] text-slate-400">Switch to Live once Google approves your domain</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = { ...formData, isTestMode: !formData.isTestMode };
                        setFormData(updated);
                        onSaveConfig(updated);
                      }}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                        formData.isTestMode
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {formData.isTestMode ? '🧪 Test / Demo Ads' : '🟢 Live Google Ads'}
                    </button>
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="px-3 py-2 rounded-xl text-slate-400 hover:text-white"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => {
                        handleSaveStep();
                        onClose();
                      }}
                      className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Finish & Save Setup</span>
                    </button>
                  </div>
                </div>
              )}

              {savedSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Configuration saved and active in the app!</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: AD CONFIGURATION FORM */}
          {activeTab === 'config' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-amber-400" />
                  All Ad Unit IDs & Parameters
                </h4>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Publisher ID or GAM Network Code
                  </label>
                  <input
                    type="text"
                    value={formData.publisherId}
                    onChange={(e) => setFormData({ ...formData, publisherId: e.target.value })}
                    placeholder="e.g. ca-pub-9845720194827103 or /21775744923/"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Top Banner Ad Slot ID / Path
                  </label>
                  <input
                    type="text"
                    value={formData.bannerAdSlotId}
                    onChange={(e) => setFormData({ ...formData, bannerAdSlotId: e.target.value })}
                    placeholder="e.g. 9827364510 or /21775744923/top_banner"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Rewarded Ad Unit Path
                  </label>
                  <input
                    type="text"
                    value={formData.rewardedAdUnitPath}
                    onChange={(e) => setFormData({ ...formData, rewardedAdUnitPath: e.target.value })}
                    placeholder="e.g. /21775744923/earn_to_watch_rewarded"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Custom Domain
                  </label>
                  <input
                    type="text"
                    value={formData.adsTxtDomain}
                    onChange={(e) => setFormData({ ...formData, adsTxtDomain: e.target.value })}
                    placeholder="e.g. earntowatch.com"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                  <div>
                    <span className="font-semibold text-white">Mode</span>
                    <p className="text-[10px] text-slate-400">
                      Use Test Mode while testing without risking account suspension
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isTestMode: !formData.isTestMode })}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                      formData.isTestMode
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {formData.isTestMode ? '🧪 Test & Demo Mode' : '🟢 Live Production Ads'}
                  </button>
                </div>
              </div>

              {savedSuccess && (
                <div className="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Ad configuration updated successfully!</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors"
              >
                Save All Changes
              </button>
            </form>
          )}

          {/* TAB 3: GUIDE & FAQ */}
          {activeTab === 'guide' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <h4 className="font-bold text-white text-sm mb-1.5">
                  How does Google Pay you?
                </h4>
                <p className="text-slate-400 leading-relaxed">
                  Google pays publishers directly via <strong>Wire Transfer (Direct Bank Transfer)</strong> on the 21st to 26th of every month for earnings exceeding $100 (or equivalent in INR, ~₹8,000). The coins in this app give your users an incentive to view ads, while Google deposits the ad revenue into your bank account.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <h4 className="font-bold text-white text-sm mb-1.5">
                  What is the difference between AdSense and Ad Manager?
                </h4>
                <ul className="list-disc pl-4 space-y-1.5 text-slate-400 leading-relaxed">
                  <li>
                    <strong>Google AdSense:</strong> Simpler setup, primarily focused on display banner ads and auto-ads.
                  </li>
                  <li>
                    <strong>Google Ad Manager:</strong> Professional publisher ad server with support for <em>Rewarded Web Ads</em>, direct brand deals, yield partner mediation, and custom CPM pricing.
                  </li>
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <h4 className="font-bold text-white text-sm mb-1.5">
                  How does the "DEVELOPER" referral code interact with your earnings?
                </h4>
                <p className="text-slate-400 leading-relaxed">
                  Users entering <strong>DEVELOPER</strong> earn 10 coins instead of 5 coins. This accelerates their user retention and ad watches. For every ad watched, Google serves an ad impression, increasing your total ad impressions and RPM (Revenue Per Mille).
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Google Publisher Tag (GPT) Script Integrated</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
