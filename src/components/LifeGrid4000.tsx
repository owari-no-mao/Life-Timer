import React, { useState, useMemo } from 'react';
import { UserProfile } from '../types';
import { LIFE_ERAS, getLifeEraForAge, formatLargeNumber } from '../utils/lifeCalculator';
import { Calendar, Info, Filter } from 'lucide-react';

interface LifeGrid4000Props {
  profile: UserProfile;
}

type ViewFilter = 'all' | 'eras' | 'seasons';

export const LifeGrid4000: React.FC<LifeGrid4000Props> = React.memo(({ profile }) => {
  const [hoveredWeek, setHoveredWeek] = useState<{ age: number; week: number; isPast: boolean; isCurrent: boolean } | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<ViewFilter>('all');
  const [activeEraFilter, setActiveEraFilter] = useState<string | null>(null);

  const birthDate = useMemo(() => new Date(profile.birthDate), [profile.birthDate]);
  const targetAge = profile.targetAge || 85;
  const now = useMemo(() => new Date(), []);

  // Calculate current exact age in weeks
  const msLived = Math.max(0, now.getTime() - birthDate.getTime());
  const currentTotalWeeks = Math.floor(msLived / (1000 * 60 * 60 * 24 * 7));
  const currentAgeInYears = Math.floor(currentTotalWeeks / 52);

  const totalGridWeeks = targetAge * 52;
  const weeksRemaining = Math.max(0, totalGridWeeks - currentTotalWeeks);
  const percentageLived = Math.min(100, (currentTotalWeeks / totalGridWeeks) * 100);

  // Helper to determine week cell color and styling
  const getCellDetails = (age: number, week: number) => {
    const totalWeekIndex = age * 52 + week;
    const isCurrent = totalWeekIndex === currentTotalWeeks;
    const isPast = totalWeekIndex < currentTotalWeeks;
    const era = getLifeEraForAge(age);

    const isSummerWeek = week >= 23 && week <= 35;
    const isSpringWeek = week >= 10 && week <= 22;

    let bgClass = 'bg-neutral-800 border-neutral-800';

    if (isCurrent) {
      bgClass = 'bg-amber-400 border-amber-300 ring-2 ring-amber-400 ring-offset-2 ring-offset-neutral-950 animate-pulse-glow z-10';
    } else if (isPast) {
      if (selectedFilter === 'seasons') {
        if (isSummerWeek) bgClass = 'bg-amber-500 border-amber-400';
        else if (isSpringWeek) bgClass = 'bg-pink-400 border-pink-300';
        else bgClass = 'bg-neutral-600 border-neutral-500';
      } else if (selectedFilter === 'eras' || selectedFilter === 'all') {
        // Solid color coding by life era
        if (age < 6) bgClass = 'bg-amber-500 border-amber-400';
        else if (age < 12) bgClass = 'bg-emerald-500 border-emerald-400';
        else if (age < 18) bgClass = 'bg-sky-500 border-sky-400';
        else if (age < 25) bgClass = 'bg-indigo-500 border-indigo-400';
        else if (age < 40) bgClass = 'bg-purple-500 border-purple-400';
        else if (age < 60) bgClass = 'bg-rose-500 border-rose-400';
        else if (age < 75) bgClass = 'bg-yellow-500 border-yellow-400';
        else bgClass = 'bg-stone-500 border-stone-400';
      } else {
        bgClass = 'bg-neutral-600 border-neutral-500';
      }
    } else {
      // Future weeks
      if (selectedFilter === 'seasons') {
        if (isSummerWeek) bgClass = 'bg-amber-950 border-amber-900';
        else if (isSpringWeek) bgClass = 'bg-pink-950 border-pink-900';
        else bgClass = 'bg-neutral-900 border-neutral-800';
      } else if (activeEraFilter && era.name === activeEraFilter) {
        bgClass = 'bg-neutral-800 border-neutral-700 ring-1 ring-amber-500';
      } else {
        bgClass = 'bg-neutral-900 border-neutral-800 hover:border-neutral-600';
      }
    }

    return { isCurrent, isPast, era, bgClass };
  };

  return (
    <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-5 sm:p-7 shadow-xl">
      {/* Header of 4000 weeks */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-neutral-100 flex items-center gap-2 font-display">
              4,000 WEEKS MATRIX
            </h2>
            <span className="px-2 py-0.5 text-xs rounded-full bg-neutral-900 text-amber-300 border border-neutral-700 font-medium">
              人生のマス目
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            人間の一生は約4,000週間。1行が1年（52マス）、1マスがあなたのかけがえのない1週間です。
          </p>
        </div>

        {/* Quick summary numbers */}
        <div className="flex items-center gap-4 text-xs font-mono-numbers">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-neutral-600" />
            <span className="text-neutral-400">経過:</span>
            <span className="font-bold text-neutral-200">{formatLargeNumber(currentTotalWeeks)}週 ({percentageLived.toFixed(1)}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" />
            <span className="text-neutral-400">現在</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-neutral-800 border border-neutral-700" />
            <span className="text-neutral-400">未踏:</span>
            <span className="font-bold text-emerald-400">{formatLargeNumber(weeksRemaining)}週</span>
          </div>
        </div>
      </div>

      {/* Filter and Era legend bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 my-4">
        {/* View Mode */}
        <div className="flex items-center gap-1.5 bg-neutral-950 p-1 rounded-lg border border-neutral-800 text-xs">
          <span className="text-neutral-500 px-2 flex items-center gap-1">
            <Filter className="w-3 h-3" /> 表示:
          </span>
          {(
            [
              { id: 'all', label: '標準 (全年代)' },
              { id: 'seasons', label: '四季 (夏・桜の週)' },
              { id: 'eras', label: 'ライフステージ' },
            ] as const
          ).map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                selectedFilter === filter.id
                  ? 'bg-neutral-800 text-amber-300 shadow-sm border border-neutral-700'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Era Tag Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
          <span className="text-neutral-500 whitespace-nowrap">年代目安:</span>
          {LIFE_ERAS.slice(0, 6).map((era) => (
            <button
              key={era.name}
              onClick={() => setActiveEraFilter(activeEraFilter === era.name ? null : era.name)}
              className={`px-2 py-0.5 rounded border transition-all whitespace-nowrap ${
                activeEraFilter === era.name
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                  : era.bgClass
              }`}
            >
              {era.name} ({era.startAge}〜{era.endAge}歳)
            </button>
          ))}
        </div>
      </div>

      {/* Hover Info Tooltip Banner */}
      <div className="min-h-[44px] mb-3 px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs text-neutral-300">
        {hoveredWeek ? (
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1 text-amber-300 font-semibold font-mono-numbers">
              <Calendar className="w-3.5 h-3.5" />
              {hoveredWeek.age}歳 第{hoveredWeek.week + 1}週目
            </span>
            <span className="text-neutral-400">
              ステージ: {getLifeEraForAge(hoveredWeek.age).name}
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
              hoveredWeek.isCurrent
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : hoveredWeek.isPast
                ? 'bg-neutral-800 text-neutral-400'
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}>
              {hoveredWeek.isCurrent ? '★ 現在の週 (今を生きる)' : hoveredWeek.isPast ? '過ごした週' : 'これからの未来の週'}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-neutral-500">
            <Info className="w-3.5 h-3.5" />
            <span>マス目にカーソルを合わせると、その年齢・週の詳細を確認できます。</span>
          </div>
        )}
      </div>

      {/* The Scrollable Grid Container */}
      <div className="overflow-x-auto pb-4 pt-1 max-h-[580px] pr-2">
        <div className="min-w-[680px]">
          
          {/* Column Header: 52 Weeks */}
          <div className="flex items-center mb-1 text-[9px] text-neutral-500 font-mono-numbers pl-10">
            <span className="w-8">第1週</span>
            <div className="flex-1 flex justify-between px-2">
              <span>第13週 (春)</span>
              <span>第26週 (夏)</span>
              <span>第39週 (秋)</span>
            </div>
            <span className="w-8 text-right">第52週</span>
          </div>

          {/* Grid Rows (Each row = 1 year of age) */}
          <div className="space-y-1">
            {Array.from({ length: targetAge }, (_, age) => {
              const isCurrentAgeRow = age === currentAgeInYears;

              return (
                <div
                  key={`age-row-${age}`}
                  className={`flex items-center gap-2 group transition-colors py-0.5 px-1 rounded-md ${
                    isCurrentAgeRow
                      ? 'bg-neutral-800/80 border border-neutral-700'
                      : 'hover:bg-neutral-800/40'
                  }`}
                >
                  {/* Age Label */}
                  <div className="w-8 text-right shrink-0">
                    <span className={`text-[10px] font-mono-numbers ${
                      isCurrentAgeRow ? 'font-bold text-amber-300 text-xs' : 'text-neutral-500 group-hover:text-neutral-300'
                    }`}>
                      {age}歳
                    </span>
                  </div>

                  {/* 52 Week Cells */}
                  <div className="flex-1 grid grid-cols-52 gap-[2px] sm:gap-[3px]">
                    {Array.from({ length: 52 }, (_, week) => {
                      const details = getCellDetails(age, week);

                      return (
                        <div
                          key={`week-${age}-${week}`}
                          onMouseEnter={() => setHoveredWeek({ age, week, isPast: details.isPast, isCurrent: details.isCurrent })}
                          onMouseLeave={() => setHoveredWeek(null)}
                          className={`aspect-square rounded-[2px] transition-all border ${details.bgClass} ${
                            details.isCurrent ? 'scale-125' : 'hover:scale-125 hover:z-20 hover:border-amber-400'
                          }`}
                          title={`${age}歳 第${week + 1}週`}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Footer advice */}
      <div className="mt-4 pt-3 border-t border-neutral-800 text-[11px] text-neutral-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>※ 白・薄いマスはまだ誰も歩んでいないあなたの未来です。</span>
        <span className="text-amber-400">「人生のマス目を何で満たしますか？」</span>
      </div>
    </div>
  );
});
