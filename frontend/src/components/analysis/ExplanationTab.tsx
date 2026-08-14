import React, { useState } from 'react';
import { AnalysisResult } from '../../types';
import { ChevronDown, ChevronUp, Sparkles, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExplanationTabProps {
  analysis: AnalysisResult;
}

export const ExplanationTab: React.FC<ExplanationTabProps> = ({ analysis }) => {
  const [openBlocks, setOpenBlocks] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = {};
    analysis.explanation.forEach((_, idx) => {
      initial[idx] = true;
    });
    return initial;
  });

  const toggleBlock = (idx: number) => {
    setOpenBlocks((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleExpandAll = () => {
    const allOpen: Record<number, boolean> = {};
    analysis.explanation.forEach((_, idx) => {
      allOpen[idx] = true;
    });
    setOpenBlocks(allOpen);
  };

  const handleCollapseAll = () => {
    const allClosed: Record<number, boolean> = {};
    analysis.explanation.forEach((_, idx) => {
      allClosed[idx] = false;
    });
    setOpenBlocks(allClosed);
  };

  return (
    <div className="space-y-6">
      {/* High Level Explanation Card */}
      <div className="p-5 rounded-2xl bg-card border border-border space-y-3 shadow-sm">
        <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Executive Walkthrough</span>
        </div>
        <p className="text-xs sm:text-sm text-foreground leading-relaxed">
          {analysis.summary}
        </p>
      </div>

      {/* Line-by-Line Code Breakdown Section Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h4 className="font-bold text-sm text-foreground">Line-by-Line Code Breakdown</h4>
          <p className="text-xs text-muted-foreground">Sequential statement-by-statement walkthrough and state analysis</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExpandAll}
            className="px-2.5 py-1 text-xs font-medium rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            Expand All
          </button>
          <button
            onClick={handleCollapseAll}
            className="px-2.5 py-1 text-xs font-medium rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Code Block Cards */}
      <div className="space-y-3">
        {analysis.explanation.map((block, idx) => {
          const isOpen = !!openBlocks[idx];
          return (
            <div
              key={idx}
              className="rounded-xl border border-border bg-card overflow-hidden transition-all shadow-sm"
            >
              <button
                onClick={() => toggleBlock(idx)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-bold font-mono shrink-0">
                    {block.lines || `Line ${idx + 1}`}
                  </span>
                  <div className="min-w-0">
                    <h5 className="text-xs sm:text-sm font-semibold font-mono text-foreground truncate">
                      {block.title}
                    </h5>
                  </div>
                </div>

                <div className="p-1 rounded-md text-muted-foreground">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-border/60 p-4 bg-muted/20 text-xs sm:text-sm text-muted-foreground leading-relaxed"
                  >
                    {block.explanation}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
