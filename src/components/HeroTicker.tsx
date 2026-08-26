import React, { useState, useEffect } from 'react';
import { UserProfile, LifeCalculations } from '../types';
import { 
  calculateLifeMetrics, 
  calculateDetailedAge, 
  calculateDetailedRemaining,
  formatLargeNumber, 
  getLifeEraForAge 
} from '../utils/lifeCalculator';
import { Hourglass, Sun, Calendar, Activity, Zap, Clock } from 'lucide-react';

interface HeroTickerProps {
  profile: UserProfile;
  onNavigateToTab?: (tab: string) => void;
}

type TimeUnit = 'detailed' | 'days' | 'hours' | 'minutes' | 'seconds' | 'weeks';

export const HeroTicker: React.FC<HeroTickerProps> = ({ profile, onNavigateToTab }) => {
  const [now, setNow] = useState<Date>(() => new Date());
  const [selectedUnit, setSelectedUnit] = useState<TimeUnit>('detailed');
  const [showWakingOnly, setShowWakingOnly] = useState<boolean>(false);

  // Update clock once every 500ms for lightweight, snappy performance
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 500);
    return () => clearInterval(timer);
  }, []);

  const birthDate = new Date(`${profile.birthDate}T${profile.birthTime || '12:00'}:00`);
  const validBirthDate = isNaN(birthDate.getTime()) ? new Date('2001-10-14T12:00:00') : birthDate;
  
  const targetEndDate = new Date(validBirthDate.getTime());
  targetEndDate.setFullYear(validBirthDate.getFullYear() + (profile.targetAge || 85));

  const metrics: LifeCalculations = calculateLifeMetrics(profile, now);
  const detailedAge = calculateDetailedAge(validBirthDate, now);
  const detailedRemaining = calculateDetailedRemaining(targetEndDate, now);
  const currentEra = getLifeEraForAge(metrics.exactAgeYears);

  // Format remaining time display based on unit
  const renderRemainingDisplay = () => {
    const hours = showWakingOnly ? metrics.wakingHoursRemaining : metrics.hoursRemaining;
    const days = showWakingOnly ? metrics.wakingDaysRemaining : metrics.daysRemaining;

    switch (selectedUnit) {
      case 'detailed':
        return {
          isDetailed: true,
          label: showWakingOnly ? '残された覚醒時間（年月日時間）' : '残された時間（年月日時間）',
        };
      case 'days':
        return {
          main: formatLargeNumber(Math.floor(days)),
          sub: `.${(days % 1).toFixed(4).slice(2)}`,
          unit: '日',
          label: showWakingOnly ? '残された覚醒日数（睡眠除く）' : '残された総日数',
        };
      case 'hours':
        return {
          main: formatLargeNumber(Math.floor(hours)),
          sub: `.${(hours % 1).toFixed(2).slice(2)}`,
          unit: '時間',
          label: showWakingOnly ? '残された意識ある時間' : '残された総時間',
        };
      case 'minutes': {
        const mins = showWakingOnly ? hours * 60 : metrics.minutesRemaining;
        return {
          main: formatLargeNumber(Math.floor(mins)),
          sub: '',
          unit: '分',
          label: '残された分数',
        };
      }
      case 'seconds': {
        const secs = showWakingOnly ? hours * 3600 : metrics.secondsRemaining;
        return {
          main: formatLargeNumber(Math.floor(secs)),
          sub: '',
          unit: '秒',
          label: '残された秒数（刻一刻と減少中）',
        };
      }
      case 'weeks': {
        const wks = days / 7;
        return {
          main: formatLargeNumber(Math.floor(wks)),
          sub: `.${(wks % 1).toFixed(2).slice(2)}`,
          unit: '週間',
          label: '残された週の数（人生の4,000週）',
        };
      }
    }
  };

  const remainingData = renderRemainingDisplay();
  const integerAge = Math.floor(metrics.exactAgeYears);
  const decimalAgeStr = metrics.exactAgeYears.toFixed(6);
  const decimalPart = decimalAgeStr.split('.')[1] || '000000';

  return (
    <section className="relative overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800 p-5 sm:p-7 shadow-xl">
      
      {/* Top Banner: Current Life Era & Age in Year/Month/Day/Hour */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-neutral-800">
        <div className="space-y-2">
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold border ${currentEra.bgClass}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              ステージ: {currentEra.name} ({currentEra.startAge}〜{currentEra.endAge}歳)
            </span>
            <span className="text-xs text-neutral-400">
              生年月日: {profile.birthDate} {profile.birthTime || '12:00'} (目標: {profile.targetAge}歳)
            </span>
          </div>

          {/* Primary Age Display: Year, Month, Day, Hour, Minute, Second */}
          <div>
            <div className="text-xs text-neutral-400 font-mono uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>あなたが生まれてから生きた時間 (年齢):</span>
            </div>
            
            <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 text-neutral-100 font-mono-numbers">
              <div className="flex items-baseline gap-1 bg-neutral-950 px-3 py-1.5 rounded-xl border border-neutral-800">
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-300">{detailedAge.years}</span>
                <span className="text-xs text-neutral-400 font-sans">年</span>
              </div>
              <div className="flex items-baseline gap-1 bg-neutral-950 px-3 py-1.5 rounded-xl border border-neutral-800">
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-300">{detailedAge.months}</span>
                <span className="text-xs text-neutral-400 font-sans">ヶ月</span>
              </div>
              <div className="flex items-baseline gap-1 bg-neutral-950 px-3 py-1.5 rounded-xl border border-neutral-800">
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-300">{detailedAge.days}</span>
                <span className="text-xs text-neutral-400 font-sans">日</span>
              </div>
              <div className="flex items-baseline gap-1 bg-neutral-950 px-3 py-1.5 rounded-xl border border-neutral-800">
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-300">{String(detailedAge.hours).padStart(2, '0')}</span>
                <span className="text-xs text-neutral-400 font-sans">時間</span>
              </div>
              <div className="flex items-baseline gap-1 bg-neutral-950 px-2.5 py-1.5 rounded-xl border border-neutral-800 text-neutral-300">
                <span className="text-xl sm:text-2xl font-bold text-neutral-200">{String(detailedAge.minutes).padStart(2, '0')}</span>
                <span className="text-[11px] text-neutral-400 font-sans">分</span>
              </div>
              <div className="flex items-baseline gap-1 bg-neutral-950 px-2.5 py-1.5 rounded-xl border border-neutral-800 text-neutral-400">
                <span className="text-xl sm:text-2xl font-bold text-neutral-300">{String(detailedAge.seconds).padStart(2, '0')}</span>
                <span className="text-[11px] text-neutral-500 font-sans">秒</span>
              </div>
            </div>

            {/* Decimal age pill */}
            <div className="mt-2 text-xs text-neutral-400 flex items-center gap-1.5">
              <span>精密表記:</span>
              <span className="font-mono-numbers font-semibold text-neutral-200">
                {integerAge}.<span className="text-amber-400">{decimalPart}</span> 歳
              </span>
              <span className="text-neutral-500">({formatLargeNumber(Math.floor(metrics.daysLived))}日 経過)</span>
            </div>
          </div>

        </div>

        {/* Life Progress Percentage Pill */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-neutral-950 border border-neutral-800 p-3.5 rounded-xl shrink-0">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <div className="text-xs">
              <div className="text-neutral-400 font-medium">人生の進行度</div>
              <div className="font-mono-numbers text-base font-bold text-neutral-100">
                {metrics.percentageLived.toFixed(2)}%
              </div>
            </div>
          </div>
          <div className="h-6 w-px bg-neutral-800 hidden sm:block" />
          <div className="text-xs">
            <div className="text-neutral-400 font-medium">残された割合</div>
            <div className="font-mono-numbers text-base font-bold text-emerald-400">
              {metrics.percentageRemaining.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>

      {/* Main Big Counter: Time Remaining */}
      <div className="my-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Hourglass className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-neutral-200 tracking-wide uppercase">
              {remainingData.label} (目標 {profile.targetAge}歳まで)
            </h2>
          </div>

          {/* Sleep subtraction toggle */}
          <button
            onClick={() => setShowWakingOnly(!showWakingOnly)}
            className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border transition-colors ${
              showWakingOnly
                ? 'bg-amber-400 text-neutral-950 font-bold border-amber-400'
                : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-neutral-200'
            }`}
            title="睡眠時間（1日7.5時間想定）を引いた実質的な意識ある時間を表示"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{showWakingOnly ? '覚醒時間のみ表示中 (睡眠除外)' : '睡眠時間を差し引く'}</span>
          </button>
        </div>

        {/* Display remaining time */}
        <div className="p-5 sm:p-7 rounded-xl bg-neutral-950 border border-neutral-800 shadow-inner">
          {selectedUnit === 'detailed' ? (
            /* Detailed breakdown format for remaining time */
            <div>
              <div className="text-xs text-neutral-400 mb-3">
                残り年・月・日・時間・分・秒のカウントダウン:
              </div>
              <div className="flex flex-wrap items-baseline gap-2 sm:gap-4 text-neutral-100 font-mono-numbers">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-amber-300">{detailedRemaining.years}</span>
                  <span className="text-sm sm:text-base text-neutral-400 font-sans">年</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-amber-300">{detailedRemaining.months}</span>
                  <span className="text-sm sm:text-base text-neutral-400 font-sans">ヶ月</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-amber-300">{detailedRemaining.days}</span>
                  <span className="text-sm sm:text-base text-neutral-400 font-sans">日</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-amber-300">{String(detailedRemaining.hours).padStart(2, '0')}</span>
                  <span className="text-sm sm:text-base text-neutral-400 font-sans">時間</span>
                </div>
                <div className="flex items-baseline gap-1 text-neutral-300">
                  <span className="text-2xl sm:text-4xl font-bold text-neutral-200">{String(detailedRemaining.minutes).padStart(2, '0')}</span>
                  <span className="text-xs text-neutral-400 font-sans">分</span>
                </div>
                <div className="flex items-baseline gap-1 text-neutral-400">
                  <span className="text-2xl sm:text-4xl font-bold text-neutral-300">{String(detailedRemaining.seconds).padStart(2, '0')}</span>
                  <span className="text-xs text-neutral-500 font-sans">秒</span>
                </div>
              </div>
            </div>
          ) : (
            /* Single unit format */
            <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
              <div className="flex items-baseline flex-wrap">
                <span className="font-mono-numbers text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-amber-300">
                  {remainingData.main}
                </span>
                {remainingData.sub && (
                  <span className="font-mono-numbers text-xl sm:text-3xl lg:text-4xl font-semibold text-amber-400/80 ml-1">
                    {remainingData.sub}
                  </span>
                )}
                <span className="text-2xl sm:text-3xl font-bold text-neutral-300 ml-3">
                  {remainingData.unit}
                </span>
              </div>
            </div>
          )}

          {/* Unit Toggle Chips */}
          <div className="flex items-center gap-1.5 flex-wrap pt-5 mt-4 border-t border-neutral-800">
            <span className="text-xs text-neutral-400 mr-1">単位切替:</span>
            {[
              { id: 'detailed' as const, label: '年月日時間' },
              { id: 'days' as const, label: '日数 (日)' },
              { id: 'hours' as const, label: '時間 (h)' },
              { id: 'minutes' as const, label: '分数 (min)' },
              { id: 'seconds' as const, label: '秒数 (sec)' },
              { id: 'weeks' as const, label: '週数 (4000週)' },
            ].map((unit) => (
              <button
                key={unit.id}
                onClick={() => setSelectedUnit(unit.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
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
      </div>

      {/* Main Life Bar */}
      <div className="space-y-2 pt-2">
        <div className="flex justify-between text-xs text-neutral-400">
          <span>0歳 (誕生)</span>
          <span className="font-semibold text-amber-300 font-mono-numbers">
            現在: {integerAge}歳 ({metrics.percentageLived.toFixed(1)}% 生きた)
          </span>
          <span>{profile.targetAge}歳 (目標)</span>
        </div>

        <div className="relative h-4 w-full bg-neutral-950 rounded-full overflow-hidden p-0.5 border border-neutral-800">
          <div
            className="h-full rounded-full bg-amber-400 transition-all duration-500 relative"
            style={{ width: `${Math.min(100, metrics.percentageLived)}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-lg" />
          </div>
        </div>
      </div>

      {/* Micro Progress Bars: Today, This Year, Decade */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 mt-5 border-t border-neutral-800">
        
        {/* Today's Progress */}
        <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-neutral-400 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-400" /> 今日の進捗
            </span>
            <span className="font-mono-numbers font-bold text-amber-300">
              {metrics.todayProgressPercentage.toFixed(1)}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${metrics.todayProgressPercentage}%` }}
            />
          </div>
        </div>

        {/* Year Progress */}
        <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-neutral-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" /> 今年の進捗 ({now.getFullYear()}年)
            </span>
            <span className="font-mono-numbers font-bold text-indigo-300">
              {metrics.yearProgressPercentage.toFixed(1)}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-400 rounded-full transition-all duration-500"
              style={{ width: `${metrics.yearProgressPercentage}%` }}
            />
          </div>
        </div>

        {/* Free Conscious Time */}
        <div 
          onClick={() => onNavigateToTab && onNavigateToTab('perspectives')}
          className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-neutral-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-400" /> 残りの意識ある覚醒時間
            </span>
            <span className="font-mono-numbers font-bold text-emerald-400">
              約 {formatLargeNumber(Math.floor(metrics.wakingDaysRemaining))} 日
            </span>
          </div>
          <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${metrics.percentageRemaining}%` }}
            />
          </div>
        </div>

      </div>

    </section>
  );
};
