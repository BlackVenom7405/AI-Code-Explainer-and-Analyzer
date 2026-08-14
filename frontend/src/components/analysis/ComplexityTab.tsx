import React from 'react';
import { ComplexityAnalysis } from '../../types';
import { Clock, HardDrive, Cpu } from 'lucide-react';

interface ComplexityTabProps {
  complexity: ComplexityAnalysis;
}

export const ComplexityTab: React.FC<ComplexityTabProps> = ({ complexity }) => {
  return (
    <div className="space-y-6">
      {/* Cards Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Time Complexity */}
        <div className="p-6 rounded-2xl bg-card border border-border space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Time Complexity</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-foreground">
              {complexity.time}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Theoretical computational runtime as input size scaled to infinity.
          </p>
        </div>

        {/* Space Complexity */}
        <div className="p-6 rounded-2xl bg-card border border-border space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-500 font-semibold text-xs uppercase tracking-wider">
              <HardDrive className="w-4 h-4" />
              <span>Space Complexity</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-foreground">
              {complexity.space}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Auxiliary memory and call stack overhead allocated during execution.
          </p>
        </div>
      </div>

      {/* Algorithmic Derivation & Proof */}
      <div className="p-6 rounded-2xl bg-card border border-border space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
          <Cpu className="w-4 h-4" />
          <span>Algorithmic Derivation &amp; Proof</span>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {complexity.explanation}
        </p>

        <div className="p-4 rounded-xl bg-muted/30 border border-border/40 space-y-2 text-xs">
          <span className="font-semibold text-foreground block">Standard Big-O Reference:</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-muted-foreground">
            <div className="p-2 rounded bg-card border border-border text-center"><span className="text-emerald-500 font-bold">O(1)</span> - Constant</div>
            <div className="p-2 rounded bg-card border border-border text-center"><span className="text-emerald-500 font-bold">O(log n)</span> - Logarithmic</div>
            <div className="p-2 rounded bg-card border border-border text-center"><span className="text-amber-500 font-bold">O(n)</span> - Linear</div>
            <div className="p-2 rounded bg-card border border-border text-center"><span className="text-red-500 font-bold">O(n²)</span> - Quadratic</div>
          </div>
        </div>
      </div>
    </div>
  );
};
