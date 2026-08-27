import React, { useState } from 'react';
import { UserProfile } from '../types';
import { X, Save, RotateCcw, Download, Upload, User, Moon } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (newProfile: UserProfile) => void;
  onResetAllData: () => void;
  onExportData: () => void;
  onImportData: (file: File) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  onResetAllData,
  onExportData,
  onImportData,
}) => {
  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [importError, setImportError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        onImportData(file);
        setImportError(null);
        onClose();
      } catch {
        setImportError('データの読み込みに失敗しました。有効なJSONファイルを選択してください。');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl p-6 text-neutral-100 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold font-display tracking-wider">設定 (生年月日・寿命)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Form */}
        <form onSubmit={handleSubmit} className="space-y-5 my-5">
          
          {/* Name & Birthday */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" /> お名前 / ニックネーム
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-xs text-neutral-100 focus:border-amber-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                生年月日
              </label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-xs text-neutral-100 focus:border-amber-400 outline-none font-mono-numbers"
              />
            </div>
          </div>

          {/* Birth Time & Target Age */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                誕生時刻 (正確な計算用)
              </label>
              <input
                type="time"
                value={formData.birthTime || '12:00'}
                onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-xs text-neutral-100 focus:border-amber-400 outline-none font-mono-numbers"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-neutral-300">
                  想定寿命 (目標年齢)
                </label>
                <span className="text-xs font-mono-numbers font-bold text-amber-300">
                  {formData.targetAge} 歳
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="115"
                value={formData.targetAge}
                onChange={(e) => setFormData({ ...formData, targetAge: Number(e.target.value) })}
                className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
                <button type="button" onClick={() => setFormData({ ...formData, targetAge: 81 })} className="hover:text-amber-300">日本男性平均(81)</button>
                <button type="button" onClick={() => setFormData({ ...formData, targetAge: 87 })} className="hover:text-amber-300">日本女性平均(87)</button>
                <button type="button" onClick={() => setFormData({ ...formData, targetAge: 100 })} className="hover:text-amber-300">100歳(100)</button>
              </div>
            </div>
          </div>

          {/* Sleep Hours (for waking free time) */}
          <div className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-3">
            <h4 className="text-xs font-bold text-neutral-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              1日の平均睡眠時間（覚醒時間計算用）
            </h4>

            <div>
              <div className="flex justify-between text-xs text-neutral-400 mb-1">
                <span>睡眠時間:</span>
                <span className="font-mono-numbers text-neutral-200 font-semibold">{formData.sleepHoursPerDay} 時間</span>
              </div>
              <input
                type="range"
                min="4"
                max="12"
                step="0.5"
                value={formData.sleepHoursPerDay}
                onChange={(e) => setFormData({ ...formData, sleepHoursPerDay: Number(e.target.value) })}
                className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-indigo-400"
              />
            </div>
          </div>

          {/* Save & Cancel */}
          <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={onResetAllData}
              className="text-xs text-neutral-500 hover:text-red-400 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>初期化</span>
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20"
              >
                <Save className="w-4 h-4" />
                <span>保存して再計算</span>
              </button>
            </div>
          </div>

        </form>

        {/* Data Backup & Export Section */}
        <div className="mt-6 pt-4 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-neutral-500">データバックアップ</span>
          <div className="flex items-center gap-2">
            <button
              onClick={onExportData}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center gap-1.5 transition-colors text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>保存</span>
            </button>
            
            <label className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center gap-1.5 transition-colors text-xs cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>復元</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {importError && (
          <p className="mt-2 text-xs text-red-400">{importError}</p>
        )}

      </div>
    </div>
  );
};
