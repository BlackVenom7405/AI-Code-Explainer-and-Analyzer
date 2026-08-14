import React from 'react';
import { 
  Play, 
  Sparkles, 
  Copy, 
  Trash2, 
  RotateCcw, 
  Check, 
  Loader2,
  FileCode2
} from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { FileUploader } from './FileUploader';
import { useToast } from '../ui/Toast';
import { getLanguageById, getRandomSample } from '../../utils/languages';

interface EditorToolbarProps {
  language: string;
  onLanguageChange: (lang: string) => void;
  code: string;
  onCodeChange: (code: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  onFileLoaded: (code: string, language: string, filename: string) => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  language,
  onLanguageChange,
  code,
  onCodeChange,
  onAnalyze,
  isAnalyzing,
  onFileLoaded
}) => {
  const [copied, setCopied] = React.useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast({ title: 'Code Copied', message: 'Source code copied to clipboard.', type: 'info' });
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleClear = () => {
    if (!code) return;
    if (window.confirm('Clear the code editor?')) {
      onCodeChange('');
    }
  };

  const handleLoadSample = () => {
    const sample = getRandomSample(language, code);
    onCodeChange(sample.code);
    toast({ 
      title: 'Sample Code Loaded', 
      message: `Loaded: ${sample.title}`, 
      type: 'info' 
    });
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-muted/40 border-b border-border/80">
      {/* Left controls */}
      <div className="flex items-center gap-2">
        <LanguageSelector selectedLanguage={language} onChange={onLanguageChange} />
        <FileUploader onFileLoaded={onFileLoaded} />
        <button
          onClick={handleLoadSample}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-all shadow-sm"
          title="Load sample code snippet"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
          <span>Sample</span>
        </button>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={handleCopy}
          disabled={!code}
          className="p-2 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
          title="Copy code"
          aria-label="Copy code"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
        </button>

        <button
          onClick={handleClear}
          disabled={!code}
          className="p-2 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-40"
          title="Clear editor"
          aria-label="Clear editor"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <button
          onClick={onAnalyze}
          disabled={isAnalyzing || !code.trim()}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all cursor-pointer"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Analyze Code</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
