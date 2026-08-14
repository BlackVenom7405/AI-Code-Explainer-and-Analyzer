import React from 'react';
import { Modal } from '../ui/Modal';
import { useSettings } from '../../context/SettingsContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Laptop, RotateCcw } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings, resetSettings } = useSettings();
  const { theme, setTheme } = useTheme();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Application Settings">
      <div className="space-y-6 text-sm">
        {/* Theme Preferences */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
            Theme Mode
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'dark', label: 'Dark', icon: Moon },
              { id: 'light', label: 'Light', icon: Sun },
              { id: 'system', label: 'System', icon: Laptop },
            ].map((t) => {
              const Icon = t.icon;
              const isSelected = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as any)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/10 text-primary shadow-sm'
                      : 'border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1.5" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Detail Level */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              AI Analysis Detail Level
            </label>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(['concise', 'balanced', 'detailed'] as const).map((level) => (
              <button
                key={level}
                onClick={() => updateSettings({ detailLevel: level })}
                className={`py-2 px-3 rounded-xl border text-xs font-medium capitalize transition-all ${
                  settings.detailLevel === level
                    ? 'border-primary bg-primary/10 text-primary font-semibold'
                    : 'border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Editor Settings */}
        <div className="pt-4 border-t border-border space-y-4">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
            Monaco Code Editor
          </label>

          {/* Font Size */}
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-foreground">Font Size</span>
              <p className="text-xs text-muted-foreground">Editor text scaling</p>
            </div>
            <select
              value={settings.fontSize}
              onChange={(e) => updateSettings({ fontSize: Number(e.target.value) })}
              className="bg-card border border-border rounded-lg px-3 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value={12}>12px</option>
              <option value={14}>14px (Default)</option>
              <option value={16}>16px</option>
              <option value={18}>18px</option>
              <option value={20}>20px</option>
            </select>
          </div>

          {/* Word Wrap */}
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-foreground">Word Wrap</span>
              <p className="text-xs text-muted-foreground">Wrap long lines of code</p>
            </div>
            <button
              onClick={() => updateSettings({ wordWrap: settings.wordWrap === 'on' ? 'off' : 'on' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                settings.wordWrap === 'on'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-muted-foreground border-border'
              }`}
            >
              {settings.wordWrap === 'on' ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* Minimap */}
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-foreground">Code Minimap</span>
              <p className="text-xs text-muted-foreground">Display overview scrollbar</p>
            </div>
            <button
              onClick={() => updateSettings({ minimap: !settings.minimap })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                settings.minimap
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-muted-foreground border-border'
              }`}
            >
              {settings.minimap ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* Tab Size */}
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-foreground">Tab Size</span>
              <p className="text-xs text-muted-foreground">Indentation spacing</p>
            </div>
            <div className="flex gap-2">
              {[2, 4].map((size) => (
                <button
                  key={size}
                  onClick={() => updateSettings({ tabSize: size })}
                  className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                    settings.tabSize === size
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card text-muted-foreground border-border'
                  }`}
                >
                  {size} spaces
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reset & Footer */}
        <div className="pt-4 border-t border-border flex justify-between items-center">
          <button
            onClick={resetSettings}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to defaults</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
};
