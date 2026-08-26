import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  CustomPerspectiveMetric, 
  ActiveTab 
} from './types';
import { DEFAULT_USER_PROFILE } from './utils/lifeCalculator';
import { Header } from './components/Header';
import { HeroTicker } from './components/HeroTicker';
import { LifeGrid4000 } from './components/LifeGrid4000';
import { PerspectiveCards } from './components/PerspectiveCards';
import { SettingsModal } from './components/SettingsModal';
import { LifeSummaryExportModal } from './components/LifeSummaryExportModal';
import { 
  Clock, 
  Grid3X3, 
  Eye, 
  Sparkles
} from 'lucide-react';

const STORAGE_KEYS = {
  PROFILE: 'life_timer_profile_v2',
  CUSTOM_METRICS: 'life_timer_custom_metrics_v2',
};

export default function App() {
  // Load state from localStorage with safe defaults
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_USER_PROFILE,
          ...parsed,
        };
      }
      return DEFAULT_USER_PROFILE;
    } catch {
      return DEFAULT_USER_PROFILE;
    }
  });

  const [customMetrics, setCustomMetrics] = useState<CustomPerspectiveMetric[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_METRICS);
      return saved ? JSON.parse(saved) : [
        { id: 'cm1', title: '大自然や旅行へ出かける回数', frequencyPerYear: 3, unit: '回', category: 'custom', iconName: 'Plane' },
        { id: 'cm2', title: '旧友と心ゆくまで語り合う夜', frequencyPerYear: 4, unit: '夜', category: 'custom', iconName: 'Coffee' },
      ];
    } catch {
      return [];
    }
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_METRICS, JSON.stringify(customMetrics));
    } catch (e) {
      console.error(e);
    }
  }, [customMetrics]);

  // Handlers for data updates
  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updated }));
  };

  const handleAddCustomMetric = (metric: Omit<CustomPerspectiveMetric, 'id'>) => {
    const item: CustomPerspectiveMetric = {
      ...metric,
      id: `cm_${Date.now()}`,
    };
    setCustomMetrics(prev => [...prev, item]);
  };

  const handleDeleteCustomMetric = (id: string) => {
    setCustomMetrics(prev => prev.filter(m => m.id !== id));
  };

  const handleResetAllData = () => {
    if (window.confirm('すべての記録と設定を初期状態にリセットしますか？')) {
      setProfile(DEFAULT_USER_PROFILE);
      setCustomMetrics([]);
      localStorage.clear();
      setIsSettingsOpen(false);
    }
  };

  const handleExportData = () => {
    const data = {
      profile,
      customMetrics,
      version: 2,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `life_timer_data_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (json.profile) setProfile(json.profile);
        if (json.customMetrics) setCustomMetrics(json.customMetrics);
      } catch (err) {
        console.error(err);
      }
    };
    reader.readAsText(file);
  };

  const navItems = [
    { id: 'dashboard' as const, label: 'リアルタイム生誕タイマー', shortLabel: 'タイマー', icon: Clock },
    { id: 'grid4000' as const, label: '4,000週のマス目 (人生グリッド)', shortLabel: '4000週', icon: Grid3X3 },
    { id: 'perspectives' as const, label: '残された回数の可視化', shortLabel: '体験回数', icon: Eye },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-400/20 selection:text-amber-200">
      
      {/* App Header */}
      <Header
        profile={profile}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenSummary={() => setIsSummaryOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Navigation Tabs Bar */}
        <nav className="flex items-center gap-2 p-1.5 rounded-xl bg-neutral-900 border border-neutral-800 shadow-md">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`tab-nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex-1 justify-center sm:justify-start ${
                  isActive
                    ? 'bg-amber-400 text-neutral-950 font-bold shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-neutral-950' : 'text-neutral-400'}`} />
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">{item.shortLabel}</span>
              </button>
            );
          })}
        </nav>

        {/* Tab Views */}
        <div className="animate-fade-in">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <HeroTicker
                profile={profile}
                onNavigateToTab={(tab) => setActiveTab(tab as ActiveTab)}
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-5 sm:p-6 space-y-5 shadow-xl flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                      <h3 className="text-sm font-bold text-neutral-100 flex items-center gap-2">
                        <Grid3X3 className="w-4 h-4 text-amber-400" />
                        4,000週の人生マトリクス
                      </h3>
                      <button
                        onClick={() => setActiveTab('grid4000')}
                        className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                      >
                        <span>全マス目を拡大</span>
                        <span>→</span>
                      </button>
                    </div>

                    <p className="text-xs text-neutral-400 leading-relaxed">
                      人間の一生（80〜85年）はおよそ <strong className="text-neutral-200">4,000週間</strong>。1週間を1つのマス目として捉えることで、人生の有限性と今週の重みがリアルに見えてきます。
                    </p>

                    {/* Quick Stats Matrix */}
                    <div className="grid grid-cols-3 gap-2.5 pt-1">
                      <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                        <div className="text-[10px] text-neutral-400 mb-1">生きてきた週数</div>
                        <div className="text-lg font-bold font-mono-numbers text-neutral-200">
                          {Math.floor((new Date().getTime() - new Date(profile.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 7))} <span className="text-xs text-neutral-400 font-normal">週</span>
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                        <div className="text-[10px] text-neutral-400 mb-1">残された週数</div>
                        <div className="text-lg font-bold font-mono-numbers text-emerald-400">
                          {Math.max(0, (profile.targetAge || 85) * 52 - Math.floor((new Date().getTime() - new Date(profile.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 7)))} <span className="text-xs text-neutral-400 font-normal">週</span>
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                        <div className="text-[10px] text-neutral-400 mb-1">総週間数</div>
                        <div className="text-lg font-bold font-mono-numbers text-amber-300">
                          {(profile.targetAge || 85) * 52} <span className="text-xs text-neutral-400 font-normal">週</span>
                        </div>
                      </div>
                    </div>

                    {/* Life Stages Progress breakdown */}
                    <div className="space-y-2 pt-2">
                      <div className="text-xs font-semibold text-neutral-300">各ライフステージの進行状況</div>
                      <div className="space-y-1.5 text-[11px] font-mono-numbers">
                        {[
                          { label: '0〜18歳 (幼少・青春期)', age: 18, color: 'bg-sky-400' },
                          { label: '18〜30歳 (自立・飛躍期)', age: 30, color: 'bg-indigo-400' },
                          { label: '30〜50歳 (挑戦・円熟期)', age: 50, color: 'bg-purple-400' },
                          { label: '50〜85歳 (黄金・余暇期)', age: profile.targetAge || 85, color: 'bg-amber-400' },
                        ].map((stage, idx) => {
                          const currentAge = (new Date().getTime() - new Date(profile.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365.2425);
                          const isPassed = currentAge >= stage.age;
                          return (
                            <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-neutral-950 border border-neutral-800">
                              <span className="text-neutral-300 font-sans">{stage.label}</span>
                              <span className={isPassed ? 'text-neutral-400' : 'text-amber-400 font-bold'}>
                                {isPassed ? '達成済' : `${Math.max(0, stage.age - currentAge).toFixed(1)} 年後`}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('grid4000')}
                    className="w-full py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-amber-300 text-xs font-bold transition-colors border border-neutral-700 flex items-center justify-center gap-2"
                  >
                    <Grid3X3 className="w-4 h-4 text-amber-400" />
                    <span>4,000週の全マス目（52列×85行）を閲覧・操作する</span>
                  </button>
                </div>

                <div className="space-y-6">
                  <PerspectiveCards
                    profile={profile}
                    onUpdateProfile={handleUpdateProfile}
                    customMetrics={customMetrics}
                    onAddCustomMetric={handleAddCustomMetric}
                    onDeleteCustomMetric={handleDeleteCustomMetric}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'grid4000' && (
            <LifeGrid4000
              profile={profile}
            />
          )}

          {activeTab === 'perspectives' && (
            <PerspectiveCards
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
              customMetrics={customMetrics}
              onAddCustomMetric={handleAddCustomMetric}
              onDeleteCustomMetric={handleDeleteCustomMetric}
            />
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800 bg-neutral-950 py-6 px-4 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>すべてのデータはブラウザの端末内にのみ安全に保存されます。</span>
          </p>
          <p>
            Memento Mori — 今この瞬間を、大切に生きる。
          </p>
        </div>
      </footer>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={profile}
        onSaveProfile={handleUpdateProfile}
        onResetAllData={handleResetAllData}
        onExportData={handleExportData}
        onImportData={handleImportData}
      />

      <LifeSummaryExportModal
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        profile={profile}
      />

    </div>
  );
}
