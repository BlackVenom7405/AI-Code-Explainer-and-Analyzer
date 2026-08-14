import React from 'react';
import { AnalysisResult } from '../../types';
import { Badge } from '../ui/Badge';
import { ShieldCheck, ShieldAlert, AlertOctagon } from 'lucide-react';

interface SecurityTabProps {
  analysis: AnalysisResult;
}

export const SecurityTab: React.FC<SecurityTabProps> = ({ analysis }) => {
  if (!analysis.security_issues || analysis.security_issues.length === 0) {
    return (
      <div className="p-12 rounded-2xl bg-card border border-border text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h4 className="text-base font-bold text-foreground">Security Audit Passed</h4>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
            No SQL injections, authentication bypasses, insecure deserialization, or hardcoded secrets detected.
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
            Vulnerability Audit ({analysis.security_issues.length})
          </h4>
          <p className="text-xs text-muted-foreground">High-risk vectors and security remediations</p>
        </div>
      </div>

      <div className="space-y-3">
        {analysis.security_issues.map((sec, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-card border border-border space-y-3 shadow-sm hover:border-red-500/40 transition-colors"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center font-bold text-xs">
                  {idx + 1}
                </div>
                <h5 className="font-semibold text-sm text-foreground">
                  {sec.title}
                </h5>
              </div>
              <div className="flex items-center gap-2">
                {sec.location && (
                  <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                    {sec.location}
                  </span>
                )}
                <Badge variant="critical">
                  {sec.severity || 'Critical'}
                </Badge>
              </div>
            </div>

            <div className="space-y-2 text-xs sm:text-sm">
              <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 text-xs">
                <span className="font-semibold text-red-500 block mb-0.5">Exploit Risk:</span>
                <span className="text-muted-foreground leading-relaxed">{sec.risk}</span>
              </div>

              <div>
                <span className="font-semibold text-foreground text-xs block mb-0.5">Why this is unsafe:</span>
                <p className="text-xs text-muted-foreground leading-relaxed">{sec.explanation}</p>
              </div>

              {sec.recommendation && (
                <div className="p-3 rounded-xl bg-muted/40 border border-border/50 text-xs">
                  <span className="font-semibold text-primary block mb-0.5">Security Remediation:</span>
                  <span className="text-muted-foreground leading-relaxed">{sec.recommendation}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
