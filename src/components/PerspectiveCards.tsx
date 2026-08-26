import React, { useState } from 'react';
import { UserProfile, CustomPerspectiveMetric } from '../types';
import { calculateLifeMetrics, formatLargeNumber } from '../utils/lifeCalculator';
import { 
  Sun, 
  Calendar, 
  Heart, 
  BookOpen, 
  Trophy, 
  Moon, 
  Coffee, 
  Flower2, 
  TreePine, 
  Plane, 
  Plus, 
  Trash2,
  HelpCircle
} from 'lucide-react';

interface PerspectiveCardsProps {
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  customMetrics: CustomPerspectiveMetric[];
  onAddCustomMetric: (metric: Omit<CustomPerspectiveMetric, 'id'>) => void;
  onDeleteCustomMetric: (id: string) => void;
}

export const PerspectiveCards: React.FC<PerspectiveCardsProps> = ({
  profile,
  onUpdateProfile,
  customMetrics,
  onAddCustomMetric,
  onDeleteCustomMetric,
}) => {
  const metrics = calculateLifeMetrics(profile, new Date());
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customFrequency, setCustomFrequency] = useState<number>(4);
  const [customUnit, setCustomUnit] = useState('回');

  // Local state for parent interactive slider
  const parentAge = profile.parentAge ?? 62;
  const parentVisits = profile.parentVisitsPerYear ?? 3;
  const booksPerYear = profile.booksPerYear ?? 12;

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;
    onAddCustomMetric({
      title: customTitle.trim(),
      frequencyPerYear: customFrequency,
      unit: customUnit.trim() || '回',
      category: 'custom',
      iconName: 'Heart',
    });
    setCustomTitle('');
    setCustomFrequency(4);
    setIsAddingCustom(false);
  };

  const yearsRemaining = Math.max(0, profile.targetAge - metrics.exactAgeYears);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
          <div>
            <h2 className="text-xl font-bold text-neutral-100 flex items-center gap-2 font-display">
              MEMENTO MORI PERSPECTIVES
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              「時間」を抽象的な数字ではなく、人生で実際に体験できる「具体的な回数」として可視化します。
            </p>
          </div>

          <button
            onClick={() => setIsAddingCustom(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold transition-colors self-start sm:self-auto shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>オリジナルの回数を追加</span>
          </button>
        </div>

        {/* Highlight Card: Parent Visits */}
        <div className="my-5 p-5 rounded-2xl bg-neutral-950 border border-neutral-800 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider">
                <Heart className="w-4 h-4 text-rose-400" />
                <span>大切な人・親と直接会える残り回数</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-extrabold font-mono-numbers text-rose-300">
                  {formatLargeNumber(metrics.parentVisitsRemaining)}
                </span>
                <span className="text-xl font-bold text-neutral-300">回</span>
              </div>
              <p className="text-xs text-neutral-300 max-w-lg leading-relaxed pt-1">
                親の生まれ年 {profile.parentBirthYear ?? 1975}年（現在約{parentAge}歳）。平均余命まであと約{Math.max(0, 85 - parentAge)}年。もし年に{parentVisits}回会うなら、一生で直接言葉を交わせる回数はあとわずかです。
              </p>
            </div>

            {/* Interactive Sliders for Parent Calculation */}
            <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl space-y-3 min-w-[260px]">
              <div>
                <div className="flex justify-between text-xs text-neutral-300 mb-1">
                  <span>親の現在年齢 (生まれ年: {profile.parentBirthYear ?? 1975}年):</span>
                  <span className="font-mono-numbers font-bold text-rose-300">{parentAge}歳</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="95"
                  value={parentAge}
                  onChange={(e) => onUpdateProfile({ parentAge: Number(e.target.value) })}
                  className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-rose-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-neutral-300 mb-1">
                  <span>年に会う回数:</span>
                  <span className="font-mono-numbers font-bold text-rose-300">年 {parentVisits} 回</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="52"
                  value={parentVisits}
                  onChange={(e) => onUpdateProfile({ parentVisitsPerYear: Number(e.target.value) })}
                  className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-rose-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Perspective Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Weekends Left */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-colors space-y-2">
            <div className="flex items-center justify-between text-neutral-400 text-xs">
              <span className="flex items-center gap-1.5 text-amber-300 font-medium">
                <Calendar className="w-4 h-4 text-amber-400" /> 残された週末 (土日)
              </span>
              <span className="font-mono-numbers text-[10px]">週に1度</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold font-mono-numbers text-neutral-100">
                {formatLargeNumber(metrics.weekendsRemaining)}
              </span>
              <span className="text-xs text-neutral-400">回</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              思い切り羽を伸ばし、旅や趣味に没頭できる週末の総数。
            </p>
          </div>

          {/* Summers Left */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-colors space-y-2">
            <div className="flex items-center justify-between text-neutral-400 text-xs">
              <span className="flex items-center gap-1.5 text-orange-300 font-medium">
                <Sun className="w-4 h-4 text-orange-400" /> 残された夏
              </span>
              <span className="font-mono-numbers text-[10px]">年に1度</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold font-mono-numbers text-orange-300">
                {formatLargeNumber(metrics.summersRemaining)}
              </span>
              <span className="text-xs text-neutral-400">回</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              入道雲、海の青さ、夜の打ち上げ花火を肌で感じられる夏の回数。
            </p>
          </div>

          {/* Sakura & Spring Left */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-colors space-y-2">
            <div className="flex items-center justify-between text-neutral-400 text-xs">
              <span className="flex items-center gap-1.5 text-pink-300 font-medium">
                <Flower2 className="w-4 h-4 text-pink-400" /> 残された桜・春
              </span>
              <span className="font-mono-numbers text-[10px]">年に1度</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold font-mono-numbers text-pink-300">
                {formatLargeNumber(metrics.springsRemaining)}
              </span>
              <span className="text-xs text-neutral-400">回</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              満開の桜を見上げ、新緑の風に心を弾ませる季節の残り回数。
            </p>
          </div>

          {/* Autumn Leaves */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-colors space-y-2">
            <div className="flex items-center justify-between text-neutral-400 text-xs">
              <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                <TreePine className="w-4 h-4 text-amber-500" /> 残された紅葉・実りの秋
              </span>
              <span className="font-mono-numbers text-[10px]">年に1度</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold font-mono-numbers text-amber-300">
                {formatLargeNumber(metrics.autumnsRemaining)}
              </span>
              <span className="text-xs text-neutral-400">回</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              澄んだ夜空、色づく山々、読書と食欲を楽しむ秋の回数。
            </p>
          </div>

          {/* Books to Read */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-colors space-y-2">
            <div className="flex items-center justify-between text-neutral-400 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-300 font-medium">
                <BookOpen className="w-4 h-4 text-emerald-400" /> 読める本の総冊数
              </span>
              <span className="font-mono-numbers text-[10px]">年{booksPerYear}冊ペース</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold font-mono-numbers text-emerald-300">
                {formatLargeNumber(metrics.booksRemainingToRead)}
              </span>
              <span className="text-xs text-neutral-400">冊</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-neutral-500">年間読書ペース調整:</span>
              <div className="flex items-center gap-1">
                {[6, 12, 24, 50].map((count) => (
                  <button
                    key={count}
                    onClick={() => onUpdateProfile({ booksPerYear: count })}
                    className={`px-1.5 py-0.5 text-[10px] rounded ${
                      booksPerYear === count
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {count}冊
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* World Cups / Global Festivals */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-colors space-y-2">
            <div className="flex items-center justify-between text-neutral-400 text-xs">
              <span className="flex items-center gap-1.5 text-indigo-300 font-medium">
                <Trophy className="w-4 h-4 text-indigo-400" /> ワールドカップ / 五輪
              </span>
              <span className="font-mono-numbers text-[10px]">4年に1度</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold font-mono-numbers text-indigo-300">
                {formatLargeNumber(metrics.worldCupsRemaining)}
              </span>
              <span className="text-xs text-neutral-400">大会</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              世界中が熱狂する大祭典を体験できる残りの回数。
            </p>
          </div>

          {/* Full Moons */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-colors space-y-2">
            <div className="flex items-center justify-between text-neutral-400 text-xs">
              <span className="flex items-center gap-1.5 text-violet-300 font-medium">
                <Moon className="w-4 h-4 text-violet-400" /> 見上げられる満月
              </span>
              <span className="font-mono-numbers text-[10px]">約29.5日に1度</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold font-mono-numbers text-violet-300">
                {formatLargeNumber(metrics.fullMoonsRemaining)}
              </span>
              <span className="text-xs text-neutral-400">回</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              夜空に輝く完全な月を仰ぎ見ることができる回数。
            </p>
          </div>

          {/* User's Custom Metrics */}
          {customMetrics.map((custom) => {
            const countRemaining = Math.floor(yearsRemaining * custom.frequencyPerYear);
            return (
              <div
                key={custom.id}
                className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-colors space-y-2 relative group"
              >
                <button
                  onClick={() => onDeleteCustomMetric(custom.id)}
                  className="absolute top-3 right-3 text-neutral-600 hover:text-red-400 transition-colors p-1"
                  title="削除"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="flex items-center justify-between text-neutral-400 text-xs pr-6">
                  <span className="flex items-center gap-1.5 text-amber-300 font-medium truncate">
                    <Plane className="w-4 h-4 text-amber-400 shrink-0" />
                    {custom.title}
                  </span>
                  <span className="font-mono-numbers text-[10px] shrink-0">年{custom.frequencyPerYear}回</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold font-mono-numbers text-amber-300">
                    {formatLargeNumber(countRemaining)}
                  </span>
                  <span className="text-xs text-neutral-400">{custom.unit}</span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  あなたが設定したオリジナル体験の残り回数。
                </p>
              </div>
            );
          })}

        </div>

        {/* Add Custom Metric Form Modal / Inline Box */}
        {isAddingCustom && (
          <form onSubmit={handleSaveCustom} className="mt-6 p-5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-4">
            <h3 className="text-sm font-bold text-neutral-100 flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-400" />
              新しい「人生の体験」を計算に追加
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-neutral-400 mb-1">体験の名称</label>
                <input
                  type="text"
                  placeholder="例: 海外旅行, 友人との温泉, ライブ参戦"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-100 text-xs focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1">年間の予定回数</label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={customFrequency}
                  onChange={(e) => setCustomFrequency(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-100 text-xs focus:border-amber-400 outline-none font-mono-numbers"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1">単位 (例: 回, 泊, 本)</label>
                <input
                  type="text"
                  placeholder="回"
                  value={customUnit}
                  onChange={(e) => setCustomUnit(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-100 text-xs focus:border-amber-400 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingCustom(false)}
                className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs shadow-md"
              >
                追加して計算
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
