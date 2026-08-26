import React, { useState, useEffect } from 'react';
import { UserProfile, LifeCalculations } from '../types';
import { calculateLifeMetrics, formatLargeNumber, getLifeEraForAge } from '../utils/lifeCalculator';
import { Hourglass, Sun, Calendar, Activity, Moon, Zap, ArrowRight } from 'lucide-react';

interface HeroTickerProps {
  profile: UserProfile;
  onNavigateToTab?: (tab: string) => void;
}

type TimeUnit = 'days' | 'hours' | 'minutes' | 'seconds' | 'heartbeats' | 'weeks';

export const HeroTicker: React.FC<HeroTickerProps> = ({ profile, onNavigateToTab }) => {
  const [metrics, setMetrics] = useState<LifeCalculations>(() => calculateLifeMetrics(profile, new Date()));
  const [selectedUnit, setSelectedUnit] = useState<TimeUnit>('days');
  const [showWakingOnly, setShowWakingOnly] = useState<boolean>(false);

  useEffect(() => {
    let animationFrameId: number;
    let lastUpdate = 0;

    const updateTicker = (timestamp: number) => {
      // Update at roughly 30-40 fps for silky smooth decimal movement without burning CPU
      if (timestamp - lastUpdate > 30) {
        setMetrics(calculateLifeMetrics(profile, new Date()));
        lastUpdate = timestamp;
      }
      animationFrameId = requestAnimationFrame(updateTicker);
    };

    animationFrameId = requestAnimationFrame(updateTicker);
    return () => cancelAnimationFrame(animationFrameId);
  }, [profile]);

  const currentEra = getLifeEraForAge(metrics.exactAgeYears);
  
  // Format remaining time display based on unit
  const renderRemainingDisplay = () => {
    const hours = showWakingOnly ? metrics.wakingHoursRemaining : metrics.hoursRemaining;
    const days = showWakingOnly ? metrics.wakingDaysRemaining : metrics.daysRemaining;
    
    switch (selectedUnit) {
      case 'days':
        return {
          main: formatLargeNumber(Math.floor(days)),
          sub: `.${(days % 1).toFixed(6).slice(2)}`,
          unit: '日',
          label: showWakingOnly ? '残された覚醒日数（睡眠除く）' : '残された日数',
        };
      case 'hours':
        return {
          main: formatLargeNumber(Math.floor(hours)),
          sub: `.${(hours % 1).toFixed(5).slice(2)}`,
          unit: '時間',
          label: showWakingOnly ? '残された意識ある時間' : '残された総時間',
        };
      case 'minutes': {
        const mins = showWakingOnly ? hours * 60 : metrics.minutesRemaining;
        return {
          main: formatLargeNumber(Math.floor(mins)),
          sub: `.${(mins % 1).toFixed(4).slice(2)}`,
          unit: '分',
          label: '残された分数',
        };
      }
      case 'seconds': {
        const secs = showWakingOnly ? hours * 3600 : metrics.secondsRemaining;
        return {
          main: formatLargeNumber(Math.floor(secs)),
          sub: `.${(secs % 1).toFixed(2).slice(2)}`,
          unit: '秒',
          label: '残された秒数（刻一刻と減少中）',
        };
      }
      case 'weeks': {
        const wks = days / 7;
        return {
          main: formatLargeNumber(Math.floor(wks)),
          sub: `.${(wks % 1).toFixed(4).slice(2)}`,
          unit: '週間',
          label: '残された週の数（人生の4,000週）',
        };
      }
      case 'heartbeats': {
        // Average 70 beats per minute
        const beats = (showWakingOnly ? hours * 60 : metrics.minutesRemaining) * 70;
        return {
          main: formatLargeNumber(Math.floor(beats)),
          sub: ``,
          unit: '回',
          label: '胸の鼓動があと何回打つか (約70bpm推定)',
        };
      }
    }
  };

  const remainingData = renderRemainingDisplay();
  const integerAge = Math.floor(metrics.exactAgeYears);
  const decimalAgeStr = metrics.exactAgeYears.toFixed(8);
  const decimalPart = decimalAgeStr.split('.')[1] || '00000000';

  return (
    <section className="relative overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800 p-5 sm:p-7 shadow-xl">
      {/* Top Banner: Current Life Era & Age */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold border ${currentEra.bgClass}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
              現在のステージ: {currentEra.name} ({currentEra.startAge}〜{currentEra.endAge}歳)
            </span>
            <span className="text-xs text-neutral-400">目標寿命: {profile.targetAge}歳</span>
          </div>

          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-xs text-neutral-400 uppercase tracking-widest font-mono">Current Age:</span>
            <div className="flex items-baseline font-mono-numbers text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-100">
              <span>{integerAge}</span>
              <span className="text-amber-400">.{decimalPart.slice(0, 4)}</span>
              <span className="text-amber-400/70 text-xl sm:text-2xl lg:text-3xl">{decimalPart.slice(4, 8)}</span>
              <span className="text-sm sm:text-base font-normal text-neutral-400 ml-2">歳</span>
            </div>
          </div>
        </div>

        {/* Life Progress Percentage Pill */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-neutral-950 border border-neutral-800 p-3 rounded-xl">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <div className="text-xs">
              <div className="text-neutral-400 font-medium">人生の進行度</div>
              <div className="font-mono-numbers text-base font-bold text-neutral-100">
                {metrics.percentageLived.toFixed(3)}%
              </div>
            </div>
          </div>
          <div className="h-6 w-px bg-neutral-800 hidden sm:block" />
          <div className="text-xs">
            <div className="text-neutral-400 font-medium">残された割合</div>
            <div className="font-mono-numbers text-base font-bold text-emerald-400">
              {metrics.percentageRemaining.toFixed(3)}%
            </div>
          </div>
        </div>
      </div>

      {/* Main Big Counter: Time Remaining */}
      <div className="my-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Hourglass className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <h2 className="text-sm font-semibold text-neutral-200 tracking-wide uppercase">
              {remainingData.label}
            </h2>
          </div>

          {/* Sleep subtraction toggle */}
          <button
            onClick={() => setShowWakingOnly(!showWakingOnly)}
            className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border transition-all ${
              showWakingOnly
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-neutral-200'
            }`}
            title="睡眠時間（1日7.5時間想定）を引いた実質的な意識ある時間を表示"
          >
            {showWakingOnly ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
            <span>{showWakingOnly ? '睡眠控除モード: ON (覚醒時間のみ)' : '睡眠含む総時間表示中'}</span>
          </button>
        </div>

        {/* Big Numbers Display */}
        <div className="p-5 sm:p-8 rounded-xl bg-neutral-950 border border-neutral-800 shadow-inner flex flex-col md:flex-row md:items-baseline justify-between gap-4">
          <div className="flex items-baseline flex-wrap">
            <span className="font-mono-numbers text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-amber-300">
              {remainingData.main}
            </span>
            {remainingData.sub && (
              <span className="font-mono-numbers text-xl sm:text-3xl lg:text-4xl font-semibold text-amber-400/80 ml-1">
                {remainingData.sub}
              </span>
            )}
            <span className="text-xl sm:text-2xl font-bold text-neutral-300 ml-3">
              {remainingData.unit}
            </span>
          </div>

          <div className="text-xs text-neutral-400 max-w-xs space-y-1">
            <p className="leading-relaxed">
              1秒ごとに過去になり、二度と戻らない大切な時間です。
            </p>
            <div className="flex items-center gap-2 pt-1 font-mono-numbers text-neutral-300 text-[11px]">
              <span>生きた日数: {formatLargeNumber(Math.floor(metrics.daysLived))}日</span>
              <span>•</span>
              <span>週換算: {formatLargeNumber(Math.floor(metrics.weeksLived))}週</span>
            </div>
          </div>
        </div>

        {/* Unit Selector Chips */}
        <div className="flex items-center gap-1.5 sm:gap-2 mt-3 overflow-x-auto pb-1">
          <span className="text-xs text-neutral-500 mr-1 shrink-0">単位切替:</span>
          {(
            [
              { id: 'days', label: '日' },
              { id: 'hours', label: '時間' },
              { id: 'minutes', label: '分' },
              { id: 'seconds', label: '秒' },
              { id: 'weeks', label: '週 (4000週)' },
              { id: 'heartbeats', label: '鼓動回数' },
            ] as const
          ).map((unit) => (
            <button
              key={unit.id}
              onClick={() => setSelectedUnit(unit.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedUnit === unit.id
                  ? 'bg-amber-400 text-neutral-950 font-bold shadow-md'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
              }`}
            >
              {unit.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Overall Progress Bar */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-xs font-medium">
          <span className="text-neutral-400">
            誕生 (0歳)
          </span>
          <span className="text-amber-300 font-mono-numbers">
            現在: {integerAge}歳 ({metrics.percentageLived.toFixed(2)}% 到達)
          </span>
          <span className="text-neutral-400">
            生涯 ({profile.targetAge}歳)
          </span>
        </div>

        <div className="relative h-4 w-full bg-neutral-950 rounded-full overflow-hidden p-0.5 border border-neutral-800">
          <div
            className="h-full rounded-full bg-amber-400 transition-all duration-300 relative"
            style={{ width: `${Math.min(100, metrics.percentageLived)}%` }}
          >
            {/* Pulsing indicator at current point */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-lg animate-ping opacity-75" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white" />
          </div>
        </div>
      </div>

      {/* Micro Progress Bars: Today, This Year, Decade */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-neutral-800">
        
        {/* Today's Progress */}
        <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-neutral-400 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-400" /> 今日の進捗
            </span>
            <span className="font-mono-numbers font-semibold text-neutral-200">
              {metrics.todayProgressPercentage.toFixed(1)}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full"
              style={{ width: `${metrics.todayProgressPercentage}%` }}
            />
          </div>
          <div className="mt-1.5 text-[10px] text-neutral-500 flex justify-between font-mono-numbers">
            <span>00:00</span>
            <span>本日残り: {((24 * (100 - metrics.todayProgressPercentage)) / 100).toFixed(1)}時間</span>
            <span>24:00</span>
          </div>
        </div>

        {/* Year Progress */}
        <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-neutral-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" /> 今年の進捗 ({new Date().getFullYear()}年)
            </span>
            <span className="font-mono-numbers font-semibold text-neutral-200">
              {metrics.yearProgressPercentage.toFixed(1)}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-400 rounded-full"
              style={{ width: `${metrics.yearProgressPercentage}%` }}
            />
          </div>
          <div className="mt-1.5 text-[10px] text-neutral-500 flex justify-between font-mono-numbers">
            <span>1月1日</span>
            <span>残り約 {Math.floor(365 * (1 - metrics.yearProgressPercentage / 100))}日</span>
            <span>12月31日</span>
          </div>
        </div>

        {/* Free Conscious Time */}
        <div 
          onClick={() => onNavigateToTab && onNavigateToTab('perspectives')}
          className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-neutral-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-400" /> 真の自由時間（推計）
            </span>
            <ArrowRight className="w-3 h-3 text-neutral-500 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div className="font-mono-numbers font-bold text-emerald-400 text-sm">
            {formatLargeNumber(Math.floor(metrics.freeHoursRemaining))} 時間
          </div>
          <div className="mt-1 text-[10px] text-neutral-500">
            睡眠・仕事を除く、自分だけの可処分時間
          </div>
        </div>

      </div>
    </section>
  );
};
