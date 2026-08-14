import React from 'react';
import { AnalysisResult } from '../../types';
import { ScoreRing } from '../ui/ScoreRing';
import { Badge } from '../ui/Badge';
import { 
  Sparkles, 
  ShieldCheck, 
  ShieldAlert, 
  Cpu, 
  Layers, 
  CheckCircle2 
} from 'lucide-react';

interface OverviewTabProps {
  analysis: AnalysisResult;
  language: string;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ analysis, language }) => {
  return (
    <div className="space-y-6">
      {/* High-Level Purpose & Summary */}
      <div className="p-6 rounded-2xl bg-card border border-border space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Code Purpose &amp; Architecture</span>
          </div>
          <Badge variant="default">{language.toUpperCase()}</Badge>
        </div>

        <div>
          <h4 className="text-sm sm:text-base font-bold text-foreground mb-1.5">
            {analysis.purpose}
          </h4>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {analysis.summary}
          </p>
        </div>
      </div>

      {/* Grid: Quality & Complexity High Level */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quality Card */}
        <div className="p-5 rounded-2xl bg-card border border-border flex items-center justify-between gap-4 shadow-sm">
          <div className="space-y-2 flex-1">
            <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
              Code Quality Health
            </h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Readability</span>
                <span className="font-semibold text-foreground">{Math.round(analysis.quality.readability)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Maintainability</span>
                <span className="font-semibold text-foreground">{Math.round(analysis.quality.maintainability)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Efficiency</span>
                <span className="font-semibold text-foreground">{Math.round(analysis.quality.efficiency)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Security</span>
                <span className="font-semibold text-foreground">{Math.round(analysis.quality.security)}%</span>
              </div>
            </div>
          </div>
          <ScoreRing score={analysis.quality.score} size={90} strokeWidth={8} />
        </div>

        {/* Complexity Card */}
        <div className="p-5 rounded-2xl bg-card border border-border flex flex-col justify-between shadow-sm space-y-4">
          <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
            Asymptotic Complexity
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-muted/40 border border-border/50 text-center">
              <span className="text-xs text-muted-foreground block font-medium">Time Complexity</span>
              <span className="text-lg font-bold font-mono text-primary mt-0.5 block">{analysis.complexity.time}</span>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border border-border/50 text-center">
              <span className="text-xs text-muted-foreground block font-medium">Space Complexity</span>
              <span className="text-lg font-bold font-mono text-amber-500 mt-0.5 block">{analysis.complexity.space}</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {analysis.complexity.explanation}
          </p>
        </div>
      </div>

      {/* Security Status Bar */}
      <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          {analysis.security_issues.length > 0 ? (
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          )}
          <div>
            <h5 className="font-semibold text-xs text-foreground">
              Security Vulnerability Audit
            </h5>
            <p className="text-xs text-muted-foreground">
              {analysis.security_issues.length > 0
                ? `${analysis.security_issues.length} potential security concerns identified.`
                : 'Zero security vulnerabilities detected.'}
            </p>
          </div>
        </div>
        <Badge variant={analysis.security_issues.length > 0 ? 'critical' : 'success'}>
          {analysis.security_issues.length > 0 ? `${analysis.security_issues.length} Issues` : 'Secure'}
        </Badge>
      </div>

      {/* Key Components */}
      {analysis.key_components && analysis.key_components.length > 0 && (
        <div className="p-5 rounded-2xl bg-card border border-border space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Key Components &amp; Logic Units</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {analysis.key_components.map((comp, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-muted/30 border border-border/40 text-xs text-foreground flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="truncate">{comp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
