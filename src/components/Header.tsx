import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { TIME_QUOTES, Quote } from '../utils/quotes';
import { soundManager } from '../utils/audio';
import { Clock, Settings, Volume2, VolumeX, Share2, Sparkles, RefreshCw } from 'lucide-react';

interface HeaderProps {
  profile: UserProfile;
  onOpenSettings: () => void;
  onOpenSummary: () => void;
}

export const Header: React.FC<HeaderProps> = ({ profile, onOpenSettings, onOpenSummary }) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [quoteIndex, setQuoteIndex] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(soundManager.isMuted);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleSound = () => {
    soundManager.isMuted = !soundManager.isMuted;
    setIsMuted(soundManager.isMuted);
    if (!soundManager.isMuted) {
      soundManager.playBell(440);
    }
  };

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
        
        {/* Left: App Logo & Title (Clean & Smart) */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-400 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-bold tracking-tight text-neutral-100 font-display">
                LIFE TIMER
              </h1>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-neutral-900 text-amber-400 border border-neutral-700 font-semibold whitespace-nowrap">
                人生タイマー
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              あなたの生きた時間と、残されたかけがえのない現在
            </p>
          </div>
        </div>

        {/* Center: Quote of the Day */}
        <div 
          onClick={nextQuote}
          title="クリックで名言を切り替え"
          className="group cursor-pointer max-w-md w-full md:w-auto px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 transition-colors flex items-center gap-3 text-left"
        >
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="overflow-hidden flex-1">
            <p className="text-xs text-neutral-300 line-clamp-1 italic font-serif">
              "{currentQuote.text}"
            </p>
            <div className="flex items-center justify-between gap-2 mt-0.5">
              <span className="text-[10px] text-neutral-500">
                — {currentQuote.author} {currentQuote.source ? `(${currentQuote.source})` : ''}
              </span>
              <span className="text-[10px] text-neutral-500 group-hover:text-neutral-300 flex items-center gap-0.5 whitespace-nowrap">
                <RefreshCw className="w-2.5 h-2.5" /> 次の言葉
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions & Current Clock */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <div className="hidden sm:flex flex-col items-end mr-2 text-right">
            <span className="text-xs font-mono-numbers text-neutral-300 font-semibold tracking-wider">
              {formattedTime}
            </span>
            <span className="text-[10px] text-neutral-500">
              {formattedDate}
            </span>
          </div>

          <button
            id="btn-sound-toggle"
            onClick={toggleSound}
            aria-label={isMuted ? '音声をオンにする' : '音声をミュートする'}
            className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800 transition-colors"
            title={isMuted ? '音声: オフ' : '音声: オン'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          <button
            id="btn-share-summary"
            onClick={onOpenSummary}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-amber-400 border border-neutral-700 hover:border-neutral-600 text-xs font-semibold transition-colors"
            title="人生サマリーカードを生成"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>共有</span>
          </button>

          <button
            id="btn-open-settings"
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 text-xs font-medium transition-colors"
            title="生年月日・寿命設定"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">設定</span>
          </button>
        </div>

      </div>
    </header>
  );
};
