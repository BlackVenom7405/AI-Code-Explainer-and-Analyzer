import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  FileText, 
  Bug, 
  ShieldAlert, 
  Gauge, 
  Cpu, 
  Zap, 
  Wrench, 
  BookOpen, 
  MessageSquareCode
} from 'lucide-react';
import { AnalysisResult } from '../../types';

export type TabId = 
  | 'overview' 
  | 'explanation' 
  | 'bugs' 
  | 'security' 
  | 'complexity' 
  | 'quality' 
  | 'optimization' 
  | 'refactor' 
  | 'documentation' 
  | 'chat';

interface AnalysisTabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  analysis: AnalysisResult;
}

export const AnalysisTabs: React.FC<AnalysisTabsProps> = ({ activeTab, onTabChange, analysis }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Sparkles },
    { id: 'explanation', label: 'Explanation', icon: FileText },
    { 
      id: 'bugs', 
      label: 'Bugs', 
      icon: Bug, 
      count: analysis.bugs?.length || 0,
      badgeColor: 'bg-amber-500/10 text-amber-500'
    },
    { 
      id: 'security', 
      label: 'Security', 
      icon: ShieldAlert, 
      count: analysis.security_issues?.length || 0,
      badgeColor: 'bg-red-500/10 text-red-500'
    },
    { id: 'complexity', label: 'Complexity', icon: Cpu },
    { 
      id: 'quality', 
      label: 'Quality', 
      icon: Gauge, 
      count: Math.round(analysis.quality?.score || 0),
      badgeColor: 'bg-emerald-500/10 text-emerald-500'
    },
    { id: 'optimization', label: 'Optimization', icon: Zap },
    { id: 'refactor', label: 'Refactor', icon: Wrench },
    { id: 'documentation', label: 'Docs', icon: BookOpen },
    { id: 'chat', label: 'AI Chat', icon: MessageSquareCode },
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto p-2 bg-muted/30 border-b border-border/80 no-scrollbar">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id as TabId)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              isActive
                ? 'bg-card text-foreground shadow-sm border border-border/80'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
            }`}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.96 }}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-primary' : ''}`} />
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${tab.badgeColor || 'bg-muted text-muted-foreground'}`}>
                {tab.count}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};
