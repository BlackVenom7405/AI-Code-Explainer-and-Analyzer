import React from 'react';
import { clsx } from 'clsx';

interface PaneProps {
  title?: React.ReactNode;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export const Pane: React.FC<PaneProps> = ({
  title,
  icon,
  actions,
  children,
  className = '',
  bodyClassName = ''
}) => {
  return (
    <div className={clsx('term-window', className)}>
      {(title || actions) && (
        <div className="term-window-header">
          <span className="flex items-center gap-1.5 truncate min-w-0">
            {icon}
            <span className="truncate">{title}</span>
          </span>
          {actions && <span className="flex items-center gap-1 ml-auto shrink-0">{actions}</span>}
        </div>
      )}
      <div className={clsx('p-4', bodyClassName)}>{children}</div>
    </div>
  );
};
