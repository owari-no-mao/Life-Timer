import React, { useState, useEffect } from 'react';
import { UserProfile } from './types';
import { DEFAULT_USER_PROFILE } from './utils/lifeCalculator';
import { Header } from './components/Header';
import { HeroTicker } from './components/HeroTicker';
import { SettingsModal } from './components/SettingsModal';
import { LifeSummaryExportModal } from './components/LifeSummaryExportModal';
import { Sparkles } from 'lucide-react';

const STORAGE_KEYS = {
  PROFILE: 'life_timer_profile_v2',
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

  // Handlers for data updates
  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updated }));
  };

  const handleResetAllData = () => {
    if (window.confirm('生年月日と設定を初期状態にリセットしますか？')) {
      setProfile(DEFAULT_USER_PROFILE);
      localStorage.clear();
      setIsSettingsOpen(false);
    }
  };

  const handleExportData = () => {
    const data = {
      profile,
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
      } catch (err) {
        console.error(err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-400/20 selection:text-amber-200">
      
      {/* App Header */}
      <Header
        profile={profile}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenSummary={() => setIsSummaryOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex flex-col justify-center">
        <HeroTicker profile={profile} />
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-5 px-4 text-center text-xs text-neutral-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>ブラウザ内に安全に保存されています</span>
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
