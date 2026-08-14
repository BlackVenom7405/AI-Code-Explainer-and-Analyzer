import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, Circle, Loader2 } from 'lucide-react';

interface LoadingProgressProps {
  isLoading: boolean;
}

const STEPS = [
  { id: 1, label: "Parsing AST & Code Structure" },
  { id: 2, label: "Analyzing Logic & Control Flow" },
  { id: 3, label: "Detecting Bugs & Edge Cases" },
  { id: 4, label: "Auditing Security Vulnerabilities" },
  { id: 5, label: "Deriving Time & Space Complexity" },
  { id: 6, label: "Scoring Code & Formulating Optimizations" },
];

export const LoadingProgress: React.FC<LoadingProgressProps> = ({ isLoading }) => {
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (!isLoading) {
      setCurrentStep(1);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length ? prev + 1 : prev));
    }, 1200);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-card border border-border rounded-2xl shadow-xl max-w-md mx-auto w-full">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary animate-pulse">
          <Sparkles className="w-8 h-8" />
        </div>
      </div>

      <h3 className="text-lg font-bold text-foreground mb-1">
        Analyzing Code with AI
      </h3>
      <p className="text-xs text-muted-foreground mb-6 text-center">
        Our multi-vector analysis model is reviewing your code structure.
      </p>

      {/* Steps List */}
      <div className="w-full space-y-3">
        {STEPS.map((step) => {
          const isDone = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div
              key={step.id}
              className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all duration-300 ${
                isCurrent
                  ? 'border-primary/40 bg-primary/5 text-foreground font-semibold shadow-sm'
                  : isDone
                  ? 'border-border/50 text-muted-foreground'
                  : 'border-transparent text-muted-foreground/40'
              }`}
            >
              <div className="flex items-center gap-3">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                ) : (
                  <Circle className="w-4 h-4 text-muted-foreground/30" />
                )}
                <span>{step.label}</span>
              </div>
              {isDone && <span className="text-[10px] text-emerald-500 font-medium">Done</span>}
              {isCurrent && <span className="text-[10px] text-primary font-medium animate-pulse">Working...</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
