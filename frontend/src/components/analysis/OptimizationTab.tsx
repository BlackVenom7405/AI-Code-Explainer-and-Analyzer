import React from 'react';
import { AnalysisResult } from '../../types';
import { Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

interface OptimizationTabProps {
  analysis: AnalysisResult;
}

export const OptimizationTab: React.FC<OptimizationTabProps> = ({ analysis }) => {
  if (!analysis.optimizations || analysis.optimizations.length === 0) {
    return (
      <div className="p-12 rounded-2xl bg-card border border-border text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h4 className="text-base font-bold text-foreground">Optimal Performance</h4>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
            Current implementation already utilizes optimal data structures and runtime patterns.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-foreground">
            Optimization Opportunities ({analysis.optimizations.length})
          </h4>
          <p className="text-xs text-muted-foreground">Architectural and algorithmic performance improvements</p>
        </div>
      </div>

      <div className="space-y-3">
        {analysis.optimizations.map((opt, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-card border border-border space-y-3 shadow-sm hover:border-primary/40 transition-colors">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                  {idx + 1}
                </div>
                <h5 className="font-semibold text-sm text-foreground">
                  {opt.problem}
                </h5>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                {opt.expected_benefit}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 space-y-1">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Current Approach
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">{opt.current_approach}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 space-y-1">
                <span className="text-[11px] font-semibold text-primary uppercase tracking-wider block">
                  Recommended Approach
                </span>
                <p className="text-xs text-foreground leading-relaxed">{opt.recommended_approach}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
