import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'critical' | 'high' | 'medium' | 'low' | 'success' | 'outline' | 'info';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  const variantStyles = {
    default: 'bg-primary/10 text-primary border-primary/20',
    critical: 'bg-red-500/10 text-red-500 border-red-500/20 font-semibold',
    high: 'bg-orange-500/10 text-orange-500 border-orange-500/20 font-semibold',
    medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 font-semibold',
    low: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    success: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-semibold',
    outline: 'border-border text-muted-foreground',
    info: 'bg-sky-500/10 text-sky-500 border-sky-500/20'
  };

  const currentVariant = variantStyles[variant.toLowerCase() as keyof typeof variantStyles] || variantStyles.default;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${currentVariant} ${className}`}>
      {children}
    </span>
  );
};
