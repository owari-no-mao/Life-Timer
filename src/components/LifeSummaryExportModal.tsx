import React, { useState } from 'react';
import { UserProfile, LifeCalculations } from '../types';
import { calculateLifeMetrics, calculateDetailedAge, calculateDetailedRemaining, formatLargeNumber, getLifeEraForAge } from '../utils/lifeCalculator';
import { X, Copy, Check, Heart, Sun, Calendar, Clock, Share2 } from 'lucide-react';

interface LifeSummaryExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
}

export const LifeSummaryExportModal: React.FC<LifeSummaryExportModalProps> = ({
  isOpen,
  onClose,
  profile,
}) => {
  const [copied, setCopied] = useState(false);
  const now = new Date();
  const birthDate = new Date(`${profile.birthDate}T${profile.birthTime || '12:00'}:00`);
  const validBirthDate = isNaN(birthDate.getTime()) ? new Date('2001-10-14T12:00:00') : birthDate;
  
  const targetEndDate = new Date(validBirthDate.getTime());
  targetEndDate.setFullYear(validBirthDate.getFullYear() + (profile.targetAge || 85));

  const metrics: LifeCalculations = calculateLifeMetrics(profile, now);
  const detailedAge = calculateDetailedAge(validBirthDate, now);
  const detailedRemaining = calculateDetailedRemaining(targetEndDate, now);
  const era = getLifeEraForAge(metrics.exactAgeYears);

  if (!isOpen) return null;

  const summaryText = `⏳ 【私の人生の時間 - Life Timer】
👤 ${profile.name} の生きた時間
・生年月日: ${profile.birthDate} ${profile.birthTime || '12:00'}
・生きてきた時間 (年齢): ${detailedAge.formattedString} (${metrics.exactAgeYears.toFixed(2)}歳 / ${era.name})
・残された時間: 約 ${detailedRemaining.formattedString}
・生きた日数: ${formatLargeNumber(Math.floor(metrics.daysLived))} 日 (${metrics.percentageLived.toFixed(1)}% 経過)
・残された日数: 約 ${formatLargeNumber(Math.floor(metrics.daysRemaining))} 日
・残された覚醒時間: 約 ${formatLargeNumber(Math.floor(metrics.wakingHoursRemaining))} 時間
・残された週末: 約 ${formatLargeNumber(metrics.weekendsRemaining)} 回
・残された夏: 約 ${formatLargeNumber(metrics.summersRemaining)} 回
・親/大切な人と直接会える回数: 約 ${formatLargeNumber(metrics.parentVisitsRemaining)} 回

「明日のために今日を生きるのではない。今日のこの一瞬こそが生きることのすべてである。」
#LifeTimer #人生タイマー #MementoMori`;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl p-6 text-neutral-100 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-bold font-display">LIFE TIMER SUMMARY</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* The Visual Graphic Card Preview */}
        <div className="my-5 p-6 rounded-2xl bg-neutral-950 border border-neutral-800 shadow-xl relative overflow-hidden text-center space-y-4">

          {/* Card Top Label */}
          <div className="flex items-center justify-between text-[10px] text-neutral-500 uppercase tracking-widest font-mono">
            <span>LIFE TIMER</span>
            <span>{new Date().toLocaleDateString('ja-JP')}</span>
          </div>

          <div>
            <div className="text-xs text-amber-400 font-semibold mb-1">
              {profile.name} の命の現在地
            </div>
            <div className="font-mono-numbers text-4xl sm:text-5xl font-extrabold text-neutral-100 tracking-tight">
              {metrics.exactAgeYears.toFixed(3)}
              <span className="text-xl text-neutral-400 ml-1">歳</span>
            </div>
            <div className="text-xs text-neutral-400 mt-1">
              ステージ: <span className="text-amber-300 font-semibold">{era.name}</span> (目標寿命 {profile.targetAge}歳)
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1 py-1">
            <div className="h-3 w-full bg-neutral-900 rounded-full overflow-hidden p-0.5 border border-neutral-800">
              <div
                className="h-full bg-amber-400 rounded-full"
                style={{ width: `${metrics.percentageLived}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono-numbers text-neutral-400">
              <span>経過: {metrics.percentageLived.toFixed(1)}%</span>
              <span className="text-emerald-400">未来: {metrics.percentageRemaining.toFixed(1)}%</span>
            </div>
          </div>

          {/* 4 Stat Matrix */}
          <div className="grid grid-cols-2 gap-2 text-left pt-2">
            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
              <div className="flex items-center gap-1 text-[10px] text-neutral-400 mb-0.5">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>残された覚醒時間</span>
              </div>
              <div className="text-lg font-bold font-mono-numbers text-amber-300">
                {formatLargeNumber(Math.floor(metrics.wakingHoursRemaining))} <span className="text-xs font-normal">時間</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
              <div className="flex items-center gap-1 text-[10px] text-neutral-400 mb-0.5">
                <Calendar className="w-3 h-3 text-indigo-400" />
                <span>残された週末</span>
              </div>
              <div className="text-lg font-bold font-mono-numbers text-indigo-300">
                {formatLargeNumber(metrics.weekendsRemaining)} <span className="text-xs font-normal">回</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
              <div className="flex items-center gap-1 text-[10px] text-neutral-400 mb-0.5">
                <Sun className="w-3 h-3 text-amber-400" />
                <span>残された夏</span>
              </div>
              <div className="text-lg font-bold font-mono-numbers text-amber-300">
                {formatLargeNumber(metrics.summersRemaining)} <span className="text-xs font-normal">回</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
              <div className="flex items-center gap-1 text-[10px] text-neutral-400 mb-0.5">
                <Heart className="w-3 h-3 text-rose-400" />
                <span>親と会える回数</span>
              </div>
              <div className="text-lg font-bold font-mono-numbers text-rose-300">
                {formatLargeNumber(metrics.parentVisitsRemaining)} <span className="text-xs font-normal">回</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-neutral-500 italic pt-2 font-serif border-t border-neutral-800">
            "今日という一瞬こそが、生きることのすべてである。"
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <span className="text-xs text-neutral-500">テキスト要約をクリップボードにコピーできます</span>
          <button
            onClick={handleCopyText}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>コピー完了！</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>要約テキストをコピー</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
