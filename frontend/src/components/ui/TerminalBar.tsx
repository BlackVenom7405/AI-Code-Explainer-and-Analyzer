import React from 'react';

interface TerminalBarProps {
  value: number;
  width?: number;
  showPercent?: boolean;
  className?: string;
}

export const TerminalBar: React.FC<TerminalBarProps> = ({
  value,
  width = 20,
  showPercent = true,
  className = ''
}) => {
  const clamped = Math.max(0, Math.min(100, value));
  const filled = Math.round((clamped / 100) * width);
  const tone =
    clamped >= 80 ? 'text-primary' : clamped >= 50 ? 'text-secondary' : 'text-destructive';

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono ${className}`}>
      <span className="text-muted-foreground">[</span>
      <span className={`${tone}`}>
        {'|'.repeat(filled)}
        <span className="text-muted-foreground opacity-70">{'.'.repeat(width - filled)}</span>
      </span>
      <span className="text-muted-foreground">]</span>
      {showPercent && <span className={`text-[10px] font-bold ${tone}`}>{Math.round(clamped)}%</span>}
    </span>
  );
};
