import React, { useState } from 'react';
import { AnalysisResult } from '../../types';
import { MonacoCodeEditor } from '../editor/MonacoCodeEditor';
import { refactorCode } from '../../services/api';
import { useToast } from '../ui/Toast';
import { Wrench, Loader2, Copy, Check, Sparkles } from 'lucide-react';

interface RefactorTabProps {
  analysis: AnalysisResult;
  originalCode: string;
  language: string;
}

export const RefactorTab: React.FC<RefactorTabProps> = ({ analysis, originalCode, language }) => {
  const [refactoredCode, setRefactoredCode] = useState<string>(analysis.refactored_code || '');
  const [focus, setFocus] = useState<string>('clean_and_efficient');
  const [loading, setLoading] = useState<boolean>(false);
  const [changesList, setChangesList] = useState<string[]>([]);
  const [copied, setCopied] = useState<boolean>(false);
  const { toast } = useToast();

  const handleRefactor = async () => {
    try {
      setLoading(true);
      const res = await refactorCode(language, originalCode, focus);
      setRefactoredCode(res.refactored_code);
      setChangesList(res.changes_made || []);
      toast({
        title: 'Refactored Successfully',
        message: 'Generated optimized code adhering to best practices.',
        type: 'success'
      });
    } catch (err: any) {
      toast({
        title: 'Refactor Failed',
        message: err.message || 'Could not generate refactored code',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!refactoredCode) return;
    try {
      await navigator.clipboard.writeText(refactoredCode);
      setCopied(true);
      toast({ title: 'Code Copied', message: 'Refactored code copied to clipboard.', type: 'info' });
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-card border border-border shadow-sm">
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
            Refactoring Goal:
          </label>
          <select
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
            className="bg-muted border border-border rounded-xl px-3 py-1.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="clean_and_efficient">Clean &amp; Efficient (Recommended)</option>
            <option value="maximum_performance">Maximum Performance</option>
            <option value="readability_and_docs">Readability &amp; Maintainability</option>
            <option value="security_hardening">Security Hardening</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            disabled={!refactoredCode}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-all shadow-sm disabled:opacity-40"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Code</span>
          </button>

          <button
            onClick={handleRefactor}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 shadow-sm disabled:opacity-50 transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Refactoring...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Refactor Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Changes list if present */}
      {changesList.length > 0 && (
        <div className="p-4 rounded-2xl bg-card border border-border space-y-2 shadow-sm">
          <h5 className="font-semibold text-xs text-foreground uppercase tracking-wider">
            Key Architectural Changes:
          </h5>
          <ul className="space-y-1 text-xs text-muted-foreground">
            {changesList.map((chg, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>{chg}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Editor Frame */}
      <div className="rounded-2xl border border-border overflow-hidden bg-card shadow-sm">
        <div className="px-4 py-2.5 bg-muted/30 border-b border-border/80 flex items-center justify-between text-xs font-semibold text-muted-foreground">
          <span>Refactored Result ({language.toUpperCase()})</span>
          <span className="text-[11px] text-muted-foreground/80 font-mono">Read Only</span>
        </div>
        <div className="h-80">
          <MonacoCodeEditor
            value={refactoredCode || '// Click "Refactor Code" to generate improved source code.'}
            onChange={() => {}}
            language={language}
            readOnly={true}
          />
        </div>
      </div>
    </div>
  );
};
