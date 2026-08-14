import React, { useState } from 'react';
import { generateDocumentation } from '../../services/api';
import { useToast } from '../ui/Toast';
import { FileText, Loader2, Copy, Download, Sparkles, Check } from 'lucide-react';

interface DocumentationPanelProps {
  initialDocumentation?: string;
  code: string;
  language: string;
}

export const DocumentationPanel: React.FC<DocumentationPanelProps> = ({
  initialDocumentation = '',
  code,
  language
}) => {
  const [doc, setDoc] = useState<string>(initialDocumentation || '');
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const res = await generateDocumentation(language, code);
      setDoc(res.documentation);
      toast({
        title: 'Documentation Generated',
        message: 'Comprehensive Markdown documentation ready.',
        type: 'success'
      });
    } catch (err: any) {
      toast({
        title: 'Generation Failed',
        message: err.message || 'Could not generate documentation',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!doc) return;
    try {
      await navigator.clipboard.writeText(doc);
      setCopied(true);
      toast({ title: 'Copied', message: 'Markdown copied to clipboard.', type: 'info' });
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownload = () => {
    if (!doc) return;
    const blob = new Blob([doc], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${language.toLowerCase()}_documentation.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Exported', message: 'Saved Markdown file.', type: 'success' });
  };

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-card border border-border shadow-sm">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <h4 className="font-semibold text-xs text-foreground uppercase tracking-wider">
            Markdown README &amp; Technical Docs
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            disabled={!doc}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-all shadow-sm disabled:opacity-40"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Markdown</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={!doc}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-all shadow-sm disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .md</span>
          </button>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 shadow-sm disabled:opacity-50 transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Docs</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Docs Window */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm overflow-hidden">
        <div className="max-h-[460px] overflow-y-auto text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap font-mono">
          {doc || '// Click "Generate Docs" to produce full README documentation with functions, parameters, and examples.'}
        </div>
      </div>
    </div>
  );
};
