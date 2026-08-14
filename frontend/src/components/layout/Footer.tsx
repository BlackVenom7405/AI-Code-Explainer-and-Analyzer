import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Code2, ShieldCheck, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-card/50 text-muted-foreground text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-foreground font-bold text-base">
              <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center text-white">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span>CodeLens AI</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              AI-driven code analysis, security auditing, complexity calculation, and automated refactoring powered by Google Gemini.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2">
            <h4 className="text-foreground font-semibold text-xs uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-1.5">
              <li>
                <Link to="/analyzer" className="hover:text-foreground transition-colors">Code Analyzer</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard Telemetry</Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-foreground transition-colors">Analysis History</Link>
              </li>
            </ul>
          </div>

          {/* Capabilities */}
          <div className="space-y-2">
            <h4 className="text-foreground font-semibold text-xs uppercase tracking-wider">Capabilities</h4>
            <ul className="space-y-1.5">
              <li>Line-by-Line Code Breakdown</li>
              <li>OWASP Security Vulnerability Audit</li>
              <li>Asymptotic Big-O Complexity Calculation</li>
              <li>Automated Code Refactoring &amp; Docs</li>
            </ul>
          </div>

          {/* Engine & Security */}
          <div className="space-y-2">
            <h4 className="text-foreground font-semibold text-xs uppercase tracking-wider">Architecture</h4>
            <p className="leading-relaxed text-muted-foreground">
              Powered by Google Gemini 1.5/Flash AI intelligence. Zero cloud code retention. Direct-access instant workspace.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>&copy; {new Date().getFullYear()} CodeLens AI. Understand. Analyze. Improve. Your Code.</p>
          <div className="flex items-center gap-6">
            <span>Direct Access Web Application</span>
            <span>FastAPI + React + Vite</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
