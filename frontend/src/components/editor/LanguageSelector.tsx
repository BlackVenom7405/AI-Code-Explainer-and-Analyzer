import React from 'react';
import { SUPPORTED_LANGUAGES } from '../../utils/languages';
import { SupportedLanguage } from '../../types';
import { ChevronDown } from 'lucide-react';

interface LanguageSelectorProps {
  selectedLanguage: string;
  onChange: (language: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLanguage, onChange }) => {
  return (
    <div className="relative inline-block">
      <select
        value={selectedLanguage}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-card hover:bg-muted/60 border border-border rounded-xl pl-3.5 pr-8 py-1.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer transition-all shadow-sm"
      >
        {SUPPORTED_LANGUAGES.map((lang: SupportedLanguage) => (
          <option key={lang.id} value={lang.id} className="bg-card text-foreground">
            {lang.name} ({lang.extension})
          </option>
        ))}
      </select>
      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
};
