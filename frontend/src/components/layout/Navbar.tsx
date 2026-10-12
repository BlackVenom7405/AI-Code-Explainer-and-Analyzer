import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Code2, 
  LayoutDashboard, 
  History, 
  Settings, 
  Sun, 
  Moon, 
  Menu, 
  X,
  Sparkles,
  Plus
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { SettingsModal } from '../settings/SettingsModal';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/analyzer', label: 'Analyzer', icon: Code2 },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/history', label: 'History', icon: History },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-extrabold text-lg tracking-tight text-foreground">
                <span>CodeLens</span>
                <span className="text-primary font-mono text-sm px-1.5 py-0.5 rounded-md bg-primary/10">AI</span>
              </div>
              <p className="text-[10px] text-muted-foreground hidden sm:block -mt-1">
                Understand. Analyze. Improve.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Quick New Analysis CTA */}
            <Link
              to="/analyzer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-indigo-500/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>New Analysis</span>
            </Link>

            {/* Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                className="p-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-label="Toggle theme"
                whileTap={{ scale: 0.9, rotate: 12 }}
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
              </motion.button>

            {/* Settings Trigger */}
            <motion.button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Settings"
              aria-label="Open settings"
              whileTap={{ scale: 0.9 }}
            >
              <Settings className="w-4 h-4" />
            </motion.button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence initial={false}>
          {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="md:hidden border-b border-border bg-card px-4 py-3 space-y-1 overflow-hidden"
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium ${
                    isActive
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <div className="pt-2">
              <Link
                to="/analyzer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
              >
                <Plus className="w-4 h-4" /> New Analysis
              </Link>
            </div>
          </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
};
