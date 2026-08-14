import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchDashboard } from '../services/api';
import { DashboardStats } from '../types';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  Code2, 
  ShieldAlert, 
  Sparkles, 
  Layers, 
  Loader2, 
  ArrowRight,
  Plus
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await fetchDashboard();
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-8">
        <div className="flex items-center gap-3 text-muted-foreground text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span>Loading dashboard analytics...</span>
        </div>
      </div>
    );
  }

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6'];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-border/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Analytics &amp; Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Aggregated code health, security vulnerabilities, and compiler distribution
          </p>
        </div>

        <Link
          to="/analyzer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Analysis</span>
        </Link>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl bg-card border border-border space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Analyses</span>
            <Code2 className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-extrabold text-foreground">
            {stats?.total_analyses || 0}
          </div>
          <p className="text-xs text-muted-foreground">Processed sessions</p>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Quality Score</span>
            <Sparkles className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-foreground">
            {stats?.average_quality_score ? `${Math.round(stats.average_quality_score)}/100` : 'N/A'}
          </div>
          <p className="text-xs text-muted-foreground">Composite health score</p>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Security Issues</span>
            <ShieldAlert className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-3xl font-extrabold text-foreground">
            {stats?.total_security_issues || 0}
          </div>
          <p className="text-xs text-muted-foreground">Identified threat vectors</p>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Languages</span>
            <Layers className="w-4 h-4 text-violet-500" />
          </div>
          <div className="text-3xl font-extrabold text-foreground">
            {stats?.languages_analyzed_count || 0}
          </div>
          <p className="text-xs text-muted-foreground">Unique stacks evaluated</p>
        </div>
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quality Trend Area Chart */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-card border border-border space-y-4 shadow-sm">
          <h3 className="font-bold text-sm text-foreground">Quality Score History</h3>
          <div className="h-64">
            {stats?.quality_trends && stats.quality_trends.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.quality_trends}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      borderRadius: '0.75rem',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      fontSize: 12
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#scoreGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                No historical trend data available yet.
              </div>
            )}
          </div>
        </div>

        {/* Language Distribution Pie Chart */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-card border border-border space-y-4 shadow-sm">
          <h3 className="font-bold text-sm text-foreground">Language Distribution</h3>
          <div className="h-64 flex items-center justify-center">
            {stats?.language_distribution && stats.language_distribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.language_distribution}
                    dataKey="count"
                    nameKey="language"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                  >
                    {stats.language_distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      borderRadius: '0.75rem',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      fontSize: 12
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-muted-foreground">No language data recorded.</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Analyses Log */}
      <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border/80 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-foreground">Recent Analyses</h3>
            <p className="text-xs text-muted-foreground">Most recent source code audits</p>
          </div>
          <Link to="/history" className="text-xs font-semibold text-primary hover:underline">
            View All
          </Link>
        </div>

        <div className="divide-y divide-border/60">
          {stats?.recent_analyses && stats.recent_analyses.length > 0 ? (
            stats.recent_analyses.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between hover:bg-muted/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                    #{item.id}
                  </div>
                  <div>
                    <h5 className="font-semibold text-xs sm:text-sm text-foreground">{item.title}</h5>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span className="capitalize">{item.language}</span>
                      <span>•</span>
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={item.quality_score >= 80 ? 'success' : 'high'}>
                    Score: {Math.round(item.quality_score)}
                  </Badge>
                  <Link
                    to={`/analyzer?id=${item.id}`}
                    className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-muted-foreground">
              No recent analyses found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
