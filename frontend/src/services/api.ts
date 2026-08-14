import { 
  AnalysisResponse, 
  AnalysisListItem, 
  DashboardStats, 
  ChatMessage,
  AnalysisResult 
} from '../types';

const API_BASE = '/api';

export async function fetchHealth(): Promise<{ status: string; ai_engine_configured: boolean }> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

export async function analyzeCode(
  language: string, 
  code: string, 
  title?: string, 
  detail_level?: string
): Promise<AnalysisResponse> {
  const res = await fetch(`${API_BASE}/analyses/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ language, code, title, detail_level }),
  });

  const data = await res.json();
  if (!res.ok) {
    const errorMsg = data?.message || data?.detail?.message || data?.detail || 'Failed to analyze code';
    throw new Error(errorMsg);
  }
  return data;
}

export async function uploadSourceFile(file: File): Promise<{ filename: string; language: string; code: string; size_bytes: number }> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/analyses/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    const errorMsg = data?.message || data?.detail?.message || data?.detail || 'File upload failed';
    throw new Error(errorMsg);
  }
  return data;
}

export async function listAnalyses(params?: {
  search?: string;
  language?: string;
  min_quality?: number;
  has_security_issues?: boolean;
}): Promise<AnalysisListItem[]> {
  const query = new URLSearchParams();
  if (params?.search) query.append('search', params.search);
  if (params?.language) query.append('language', params.language);
  if (params?.min_quality !== undefined) query.append('min_quality', params.min_quality.toString());
  if (params?.has_security_issues !== undefined) query.append('has_security_issues', params.has_security_issues.toString());

  const res = await fetch(`${API_BASE}/analyses?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch analyses list');
  return res.json();
}

export async function getAnalysisById(id: number): Promise<AnalysisResponse> {
  const res = await fetch(`${API_BASE}/analyses/${id}`);
  if (!res.ok) throw new Error(`Analysis #${id} not found`);
  return res.json();
}

export async function updateAnalysisTitle(id: number, title: string): Promise<AnalysisListItem> {
  const res = await fetch(`${API_BASE}/analyses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error('Failed to update analysis title');
  return res.json();
}

export async function deleteAnalysis(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/analyses/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete analysis');
}

export async function fetchDashboard(): Promise<DashboardStats> {
  const res = await fetch(`${API_BASE}/dashboard`);
  if (!res.ok) throw new Error('Failed to fetch dashboard metrics');
  return res.json();
}

export async function refactorCode(language: string, code: string, focus: string = 'clean_and_efficient'): Promise<{
  refactored_code: string;
  changes_made: string[];
  improvements: string;
}> {
  const res = await fetch(`${API_BASE}/refactor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ language, code, focus }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.detail?.message || data?.message || 'Refactoring failed');
  }
  return data;
}

export async function generateDocumentation(language: string, code: string): Promise<{ documentation: string }> {
  const res = await fetch(`${API_BASE}/document`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ language, code }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.detail?.message || data?.message || 'Documentation generation failed');
  }
  return data;
}

export async function sendChatMessage(
  code: string, 
  language: string, 
  question: string, 
  analysisContext?: string, 
  chatHistory?: ChatMessage[]
): Promise<{ reply: string }> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code,
      language,
      question,
      analysis_context: analysisContext,
      chat_history: chatHistory || []
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.detail?.message || data?.message || 'Chat response failed');
  }
  return data;
}

export function getExportPdfUrl(id: number): string {
  return `${API_BASE}/analyses/${id}/pdf`;
}

export function getExportMarkdownUrl(id: number): string {
  return `${API_BASE}/analyses/${id}/markdown`;
}
