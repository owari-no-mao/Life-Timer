import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { TIME_QUOTES, Quote } from '../utils/quotes';
import { Clock, Share2, Sparkles, RefreshCw } from 'lucide-react';

interface HeaderProps {
  profile: UserProfile;
  onOpenSummary: () => void;
}

export const Header: React.FC<HeaderProps> = ({ profile, onOpenSummary }) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [quoteIndex, setQuoteIndex] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const nextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % TIME_QUOTES.length);
  };

  const currentQuote: Quote = TIME_QUOTES[quoteIndex];

  const formattedTime = currentTime.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const formattedDate = currentTime.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  return (
    <header className="relative w-full border-b border-neutral-800 bg-neutral-950 px-4 sm:px-6 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: App Logo & Title (Stacked vertically) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-400 shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold tracking-wider text-neutral-100 font-display leading-none">
              LIFE TIMER
            </h1>
            <span className="text-[11px] text-neutral-500 font-medium tracking-normal mt-0.5">
              人生タイマー
            </span>
          </div>
        </div>

        {/* Center: Quote of the Day (Fixed width and height, dedicated next button) */}
        <div className="w-full md:w-[500px] max-w-full h-[64px] px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center gap-3 shrink-0 overflow-hidden">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="flex-1 min-w-0 flex flex-col justify-center overflow-hidden">
            <p className="text-xs text-neutral-200 italic font-serif leading-snug line-clamp-1 truncate">
              "{currentQuote.text}"
            </p>
            <p className="text-[10px] text-neutral-400 font-sans truncate mt-1">
              — {currentQuote.author} {currentQuote.source ? `(${currentQuote.source})` : ''}
            </p>
          </div>
          <button
            onClick={nextQuote}
            type="button"
            title="次の言葉を表示"
            className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-neutral-300 hover:text-amber-300 border border-neutral-800 transition-colors text-[11px] font-sans cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="whitespace-nowrap">次の言葉</span>
          </button>
        </div>

        {/* Right: Actions & Current Clock */}
        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          <div className="hidden sm:flex flex-col items-end mr-2 text-right">
            <span className="text-xs font-mono-numbers text-neutral-300 font-semibold tracking-wider">
              {formattedTime}
            </span>
            <span className="text-[10px] text-neutral-500">
              {formattedDate}
            </span>
          </div>

          <button
            id="btn-share-summary"
            onClick={onOpenSummary}
            aria-label="人生サマリーカードを共有"
            className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-amber-400 border border-neutral-700 hover:border-neutral-600 transition-colors"
            title="人生サマリーを共有・コピー"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
