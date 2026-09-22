import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

interface GoogleAdUnitProps {
  slot?: string;
  client?: string;
  format?: string;
  responsive?: boolean;
  className?: string;
}

export const GoogleAdUnit: React.FC<GoogleAdUnitProps> = ({
  slot = '9136412509',
  client = 'ca-pub-2425727788776772',
  format = 'auto',
  responsive = true,
  className = '',
}) => {
  const adRef = useRef<HTMLModElement | null>(null);
  const isPushedRef = useRef(false);

  useEffect(() => {
    if (!isPushedRef.current) {
      try {
        if (typeof window !== 'undefined') {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          isPushedRef.current = true;
        }
      } catch (e) {
        console.warn('AdSense tag could not be pushed:', e);
      }
    }
  }, []);

  return (
    <div className={`w-full max-w-xl mx-auto my-6 p-2 rounded-xl bg-slate-900/50 border border-slate-800 text-center ${className}`}>
      <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mb-1">
        Sponsored Ad
      </div>
      <div className="min-h-[100px] w-full flex items-center justify-center overflow-hidden">
        {/* Google AdSense Ad Unit */}
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', minHeight: '90px', width: '100%' }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />
      </div>
    </div>
  );
};
