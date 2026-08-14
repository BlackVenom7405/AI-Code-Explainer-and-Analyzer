export interface CodeBlockExplanation {
  title: string;
  lines?: string;
  explanation: string;
}

export interface BugFinding {
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | string;
  location?: string;
  description: string;
  recommendation: string;
}

export interface SecurityIssue {
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | string;
  location?: string;
  risk: string;
  explanation: string;
  recommendation: string;
}

export interface ComplexityAnalysis {
  time: string;
  space: string;
  explanation: string;
}

export interface QualityScoreMetrics {
  score: number;
  readability: number;
  maintainability: number;
  efficiency: number;
  security: number;
}

export interface OptimizationSuggestion {
  problem: string;
  current_approach: string;
  recommended_approach: string;
  expected_benefit: string;
}

export interface AnalysisResult {
  summary: string;
  purpose: string;
  key_components: string[];
  explanation: CodeBlockExplanation[];
  bugs: BugFinding[];
  security_issues: SecurityIssue[];
  complexity: ComplexityAnalysis;
  quality: QualityScoreMetrics;
  optimizations: OptimizationSuggestion[];
  refactored_code?: string;
  documentation?: string;
}

export interface AnalysisResponse {
  id?: number;
  title: string;
  language: string;
  source_code: string;
  analysis: AnalysisResult;
  quality_score: number;
  security_issue_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface AnalysisListItem {
  id: number;
  title: string;
  language: string;
  quality_score: number;
  security_issue_count: number;
  created_at: string;
  updated_at: string;
}

export interface LanguageCount {
  language: string;
  count: number;
  percentage: number;
}

export interface QualityTrendPoint {
  id: number;
  title: string;
  date: string;
  score: number;
}

export interface RecentAnalysisCard {
  id: number;
  title: string;
  language: string;
  quality_score: number;
  security_issue_count: number;
  created_at: string;
}

export interface DashboardStats {
  total_analyses: number;
  average_quality_score: number;
  total_security_issues: number;
  languages_analyzed_count: number;
  language_distribution: LanguageCount[];
  quality_trends: QualityTrendPoint[];
  recent_analyses: RecentAnalysisCard[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface SettingsState {
  theme: 'dark' | 'light' | 'system';
  fontSize: number;
  wordWrap: 'on' | 'off';
  minimap: boolean;
  tabSize: number;
  detailLevel: 'concise' | 'balanced' | 'detailed';
}

export interface CodeSample {
  title: string;
  code: string;
}

export interface SupportedLanguage {
  id: string;
  name: string;
  extension: string;
  monacoId: string;
  sampleCode: string;
  samples?: CodeSample[];
}
