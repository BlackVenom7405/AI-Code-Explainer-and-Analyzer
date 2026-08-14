import React from 'react';
import { QualityScoreMetrics } from '../../types';
import { ScoreRing } from '../ui/ScoreRing';
import { Gauge, CheckCircle2, ShieldAlert, Zap, Layers } from 'lucide-react';

interface QualityTabProps {
  quality: QualityScoreMetrics;
}

export const QualityTab: React.FC<QualityTabProps> = ({ quality }) => {
  const metrics = [
    { label: 'Readability', val: quality.readability, icon: Layers, desc: 'Code clarity, naming conventions, and cognitive complexity' },
    { label: 'Maintainability', val: quality.maintainability, icon: CheckCircle2, desc: 'Modularity, decoupling, and future extensibility' },
    { label: 'Efficiency', val: quality.efficiency, icon: Zap, desc: 'Resource utilization and computational throughput' },
    { label: 'Security', val: quality.security, icon: ShieldAlert, desc: 'Defensive coding and attack vector mitigation' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Ring */}
      <div className="p-6 rounded-2xl bg-card border border-border flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 text-center sm:text-left">
          <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider justify-center sm:justify-start">
            <Gauge className="w-4 h-4" />
            <span>Composite Score</span>
          </div>
          <h4 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
            Overall Code Quality: {Math.round(quality.score)}/100
          </h4>
          <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
            Composite evaluation derived from readability, modularity, algorithmic efficiency, and security defensive hygiene.
          </p>
        </div>

        <ScoreRing score={quality.score} size={120} strokeWidth={10} />
      </div>

      {/* Metrics Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="p-5 rounded-2xl bg-card border border-border space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-sm text-foreground">{m.label}</span>
                </div>
                <span className="font-mono font-bold text-sm text-foreground">
                  {Math.round(m.val)}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(5, Math.min(100, m.val))}%` }}
                />
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">{m.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
