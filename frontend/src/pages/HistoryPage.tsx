import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  listAnalyses, 
  deleteAnalysis, 
  updateAnalysisTitle, 
  getExportPdfUrl, 
  getExportMarkdownUrl 
} from '../services/api';
import { AnalysisListItem } from '../types';
import { 
  History, 
  Search, 
  Download, 
  FileText, 
  Trash2, 
  Edit3, 
  ArrowRight, 
  Loader2, 
  Plus, 
  Calendar 
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { SUPPORTED_LANGUAGES } from '../utils/languages';

export const HistoryPage: React.FC = () => {
  const [items, setItems] = useState<AnalysisListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

  // Rename modal state
  const [renameItem, setRenameItem] = useState<AnalysisListItem | null>(null);
  const [newTitle, setNewTitle] = useState<string>('');
  const [renaming, setRenaming] = useState<boolean>(false);

  const { toast } = useToast();

  useEffect(() => {
    fetchHistory();
  }, [selectedLanguage]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await listAnalyses({
        search: search || undefined,
        language: selectedLanguage || undefined,
      });
      setItems(data);
    } catch (err: any) {
      toast({
        title: 'Error Loading History',
        message: 'Could not fetch saved analyses.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHistory();
  };

  const handleDelete = async (id: number, title: string) => {
    if (!window.confirm(`Are you sure you want to delete analysis #${id} ("${title}")?`)) {
      return;
    }

    try {
      await deleteAnalysis(id);
      toast({
        title: 'Analysis Deleted',
        message: `Removed analysis #${id}.`,
        type: 'success'
      });
      fetchHistory();
    } catch (err: any) {
      toast({
        title: 'Delete Failed',
        message: err.message || 'Could not delete analysis.',
        type: 'error'
      });
    }
  };

  const handleOpenRename = (item: AnalysisListItem) => {
    setRenameItem(item);
    setNewTitle(item.title);
  };

  const handleRenameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameItem || !newTitle.trim()) return;

    try {
      setRenaming(true);
      await updateAnalysisTitle(renameItem.id, newTitle.trim());
      toast({
        title: 'Renamed Successfully',
        message: 'Analysis title updated.',
        type: 'success'
      });
      setRenameItem(null);
      fetchHistory();
    } catch (err: any) {
      toast({
        title: 'Rename Failed',
        message: err.message || 'Could not rename analysis.',
        type: 'error'
      });
    } finally {
      setRenaming(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-border/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Analysis History
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Search, filter, manage, and export past source code audits
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

      {/* Filter / Search Bar */}
      <div className="p-4 rounded-2xl bg-card border border-border shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="flex-1 min-w-[200px] flex items-center gap-2 px-3.5 py-2 rounded-xl bg-muted border border-border">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or language..."
              className="bg-transparent text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none w-full"
            />
          </div>

          {/* Language Selector Filter */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-card border border-border text-xs font-semibold text-foreground focus:outline-none"
          >
            <option value="">All Languages</option>
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>

          {/* Submit */}
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-colors shadow-sm"
          >
            Search
          </button>
        </form>
      </div>

      {/* History Items List */}
      <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex items-center justify-center gap-3 text-muted-foreground text-sm">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span>Loading history...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground text-sm">
            No analyses found matching your query.
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/40 transition-colors"
              >
                {/* Info */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-primary">#{item.id}</span>
                    <h4 className="font-semibold text-sm sm:text-base text-foreground">{item.title}</h4>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground uppercase">
                      {item.language}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{new Date(item.created_at).toLocaleString()}</span>
                    <span>•</span>
                    <span>Quality Score: {Math.round(item.quality_score)}/100</span>
                    <span>•</span>
                    <span>
                      {item.security_issue_count > 0 ? (
                        <span className="text-red-500 font-semibold">{item.security_issue_count} Security Issues</span>
                      ) : (
                        <span className="text-emerald-500">0 Security Issues</span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    to={`/analyzer?id=${item.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 shadow-sm transition-all"
                  >
                    <span>Open</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <a
                    href={getExportPdfUrl(item.id)}
                    download
                    className="p-2 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    title="Export PDF"
                  >
                    <Download className="w-4 h-4" />
                  </a>

                  <a
                    href={getExportMarkdownUrl(item.id)}
                    download
                    className="p-2 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    title="Export Markdown"
                  >
                    <FileText className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => handleOpenRename(item)}
                    className="p-2 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    title="Rename analysis"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="p-2 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-red-500 transition-colors"
                    title="Delete analysis"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rename Modal */}
      <Modal
        isOpen={!!renameItem}
        onClose={() => setRenameItem(null)}
        title="Rename Analysis"
      >
        <form onSubmit={handleRenameSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">
              New Title:
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-muted border border-border text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setRenameItem(null)}
              className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={renaming || !newTitle.trim()}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 disabled:opacity-50"
            >
              {renaming ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
