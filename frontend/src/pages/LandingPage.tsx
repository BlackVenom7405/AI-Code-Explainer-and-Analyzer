import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Code2, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  FileText, 
  MessageSquareCode, 
  ArrowRight, 
  CheckCircle2, 
  FileCode2,
  Lock,
  ChevronRight
} from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../utils/languages';

export const LandingPage: React.FC = () => {
  const features = [
    {
      icon: Sparkles,
      title: "Line-by-Line Code Breakdown",
      description: "Understand complex algorithms, control flows, and state mutations with fine-grained granular explanations."
    },
    {
      icon: ShieldCheck,
      title: "OWASP Vulnerability Audit",
      description: "Detect SQL injections, authentication bypasses, insecure deserialization, and dangerous pattern risks."
    },
    {
      icon: Cpu,
      title: "Time & Space Complexity",
      description: "Automatic Big-O derivation with mathematical explanations and reference scalability comparisons."
    },
    {
      icon: Zap,
      title: "Optimization & Quality Scoring",
      description: "Composite health scores across readability, maintainability, efficiency, and actionable refactoring."
    },
    {
      icon: FileText,
      title: "Automated Docs & PDF Export",
      description: "Produce technical documentation and export polished PDF or Markdown reports in one click."
    },
    {
      icon: MessageSquareCode,
      title: "Interactive AI Code Chat",
      description: "Ask targeted questions about your current source code and receive instant contextual developer guidance."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 md:pt-32 md:pb-36">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen AI Code Intelligence Platform</span>
          </div>

          {/* Headline */}
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              Understand. Analyze. <br />
              <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500 bg-clip-text text-transparent">
                Improve. Your Code.
              </span>
            </h1>
            <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Instant source code analysis, line-by-line breakdown, security vulnerability auditing, Big-O complexity derivation, and automated refactoring.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/analyzer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-indigo-500/25 transition-all hover:scale-105"
            >
              <span>Analyze Code Now</span>
              <ChevronRight className="w-4 h-4" />
            </Link>

            <Link
              to="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-border bg-card/80 hover:bg-muted font-bold text-sm sm:text-base text-foreground transition-all shadow-sm"
            >
              <span>View Dashboard</span>
            </Link>
          </div>

          {/* Feature Highlights Grid */}
          <div className="pt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto text-left">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-card/80 border border-border hover:border-primary/40 transition-all duration-200 shadow-sm hover:shadow-md space-y-3 backdrop-blur-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-foreground">{feat.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Supported Languages */}
          <div className="pt-16 max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold text-foreground">Supported Languages</h3>
              <p className="text-xs text-muted-foreground">Comprehensive intelligence across modern stacks</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <div
                  key={lang.id}
                  className="p-3 rounded-xl border border-border bg-card text-center hover:border-primary/40 transition-colors shadow-sm"
                >
                  <span className="text-xs font-bold text-foreground block">{lang.name}</span>
                  <span className="text-[11px] font-mono text-muted-foreground">{lang.extension}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security & Direct Access Notice */}
          <div className="pt-12 max-w-3xl mx-auto">
            <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-emerald-500/10 to-violet-500/10 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">Direct Access &amp; Private Analysis</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    No login or registration required. Your source code is analyzed securely in real-time.
                  </p>
                </div>
              </div>

              <Link
                to="/analyzer"
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs whitespace-nowrap hover:bg-primary/90 transition-colors shadow-sm"
              >
                Launch Workspace
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
