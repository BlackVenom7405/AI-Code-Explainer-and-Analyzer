import React from 'react';
import { AnalysisResult } from '../../types';
import { Badge } from '../ui/Badge';
import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface BugsTabProps {
  analysis: AnalysisResult;
}

export const BugsTab: React.FC<BugsTabProps> = ({ analysis }) => {
  if (!analysis.bugs || analysis.bugs.length === 0) {
    return (
      <div className="p-12 rounded-2xl bg-card border border-border text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h4 className="text-base font-bold text-foreground">Zero Logical Bugs Found</h4>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
            Static analysis and heuristic code checks found no runtime exceptions or unhandled branch conditions.
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
            Identified Issues ({analysis.bugs.length})
          </h4>
          <p className="text-xs text-muted-foreground">Potential logical flaws and runtime edge-case vulnerabilities</p>
        </div>
      </div>

      <div className="space-y-3">
        {analysis.bugs.map((bug, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-card border border-border space-y-3 shadow-sm hover:border-amber-500/40 transition-colors"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xs">
                  {idx + 1}
                </div>
                <h5 className="font-semibold text-sm text-foreground">
                  {bug.title}
                </h5>
              </div>
              <div className="flex items-center gap-2">
                {bug.location && (
                  <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                    {bug.location}
                  </span>
                )}
                <Badge variant={bug.severity?.toLowerCase() === 'critical' ? 'critical' : 'high'}>
                  {bug.severity || 'High'}
                </Badge>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {bug.description}
            </p>

            {bug.recommendation && (
              <div className="p-3 rounded-xl bg-muted/40 border border-border/50 text-xs">
                <span className="font-semibold text-primary block mb-0.5">
                  Recommendation:
                </span>
                <span className="text-muted-foreground leading-relaxed">{bug.recommendation}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
