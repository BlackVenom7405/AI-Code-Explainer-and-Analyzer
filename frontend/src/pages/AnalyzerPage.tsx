import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { MonacoCodeEditor } from '../components/editor/MonacoCodeEditor';
import { EditorToolbar } from '../components/editor/EditorToolbar';
import { AnalysisTabs, TabId } from '../components/analysis/AnalysisTabs';
import { OverviewTab } from '../components/analysis/OverviewTab';
import { ExplanationTab } from '../components/analysis/ExplanationTab';
import { BugsTab } from '../components/analysis/BugsTab';
import { SecurityTab } from '../components/analysis/SecurityTab';
import { ComplexityTab } from '../components/analysis/ComplexityTab';
import { QualityTab } from '../components/analysis/QualityTab';
import { OptimizationTab } from '../components/analysis/OptimizationTab';
import { RefactorTab } from '../components/analysis/RefactorTab';
import { DocumentationPanel } from '../components/analysis/DocumentationPanel';
import { ChatPanel } from '../components/analysis/ChatPanel';
import { LoadingProgress } from '../components/ui/LoadingProgress';
import { analyzeCode, getAnalysisById, getExportPdfUrl, getExportMarkdownUrl } from '../services/api';
import { AnalysisResponse, AnalysisResult } from '../types';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../components/ui/Toast';
import { SUPPORTED_LANGUAGES, getLanguageById } from '../utils/languages';
import { Download, FileText, Maximize2, Minimize2, Sparkles, Code2 } from 'lucide-react';

export const AnalyzerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { settings } = useSettings();
  const { toast } = useToast();

  const [language, setLanguage] = useState<string>('python');
  const [code, setCode] = useState<string>(() => {
    const defaultLang = getLanguageById('python');
    return defaultLang.sampleCode;
  });
  const [title, setTitle] = useState<string>('Untitled Analysis');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisData, setAnalysisData] = useState<AnalysisResponse | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  // Load existing analysis if query param 'id' is present
  useEffect(() => {
    const analysisId = searchParams.get('id');
    if (analysisId) {
      loadSavedAnalysis(Number(analysisId));
    }
  }, [searchParams]);

  const loadSavedAnalysis = async (id: number) => {
    try {
      setIsAnalyzing(true);
      const record = await getAnalysisById(id);
      setAnalysisData(record);
      setCode(record.source_code);
      setLanguage(record.language);
      setTitle(record.title);
      toast({
        title: 'Analysis Loaded',
        message: `Loaded analysis #${record.id} into workspace.`,
        type: 'success'
      });
    } catch (err: any) {
      toast({
        title: 'Load Failed',
        message: err.message || 'Could not load analysis',
        type: 'error'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    // Load default sample code if current editor is empty
    if (!code.trim()) {
      const langConfig = getLanguageById(newLang);
      setCode(langConfig.sampleCode);
    }
  };

  const handleFileLoaded = (fileCode: string, fileLang: string, fileName: string) => {
    setCode(fileCode);
    setLanguage(fileLang);
    setTitle(fileName);
  };

  const handleAnalyze = async () => {
    if (!code.trim()) {
      toast({
        title: 'No Code Provided',
        message: 'Please paste or upload code in the editor before analyzing.',
        type: 'error'
      });
      return;
    }

    try {
      setIsAnalyzing(true);
      const result = await analyzeCode(
        language,
        code,
        title || `${language.toUpperCase()} Analysis`,
        settings.detailLevel
      );

      setAnalysisData(result);
      setActiveTab('overview');
      toast({
        title: 'Analysis Completed',
        message: `Successfully analyzed ${result.language.toUpperCase()} code.`,
        type: 'success'
      });
    } catch (err: any) {
      toast({
        title: 'Analysis Failed',
        message: err.message || 'An error occurred during analysis.',
        type: 'error'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const parsedAnalysisResult: AnalysisResult | null = analysisData?.analysis || null;

  return (
    <div className={`min-h-[calc(100vh-4rem)] p-4 sm:p-6 transition-all ${
      isFullScreen ? 'fixed inset-0 z-50 bg-background overflow-auto p-6' : 'max-w-7xl mx-auto'
    }`}>
      {/* Top Workspace Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-border/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-foreground">
                Code Workspace
              </h2>
              {analysisData && (
                <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  #{analysisData.id}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {code.split('\n').length} lines | {code.length} characters | Mode: {settings.detailLevel}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {analysisData && analysisData.id && (
            <>
              {/* PDF Export */}
              <a
                href={getExportPdfUrl(analysisData.id)}
                download
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-all shadow-sm"
                title="Export PDF Report"
              >
                <Download className="w-3.5 h-3.5 text-primary" />
                <span>PDF Report</span>
              </a>

              {/* Markdown Export */}
              <a
                href={getExportMarkdownUrl(analysisData.id)}
                download
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-all shadow-sm"
                title="Export Markdown Document"
              >
                <FileText className="w-3.5 h-3.5 text-primary" />
                <span>Markdown</span>
              </a>
            </>
          )}

          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title={isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Split-Screen Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Monaco Editor Panel */}
        <div className="lg:col-span-6 flex flex-col rounded-2xl bg-card border border-border shadow-sm overflow-hidden min-h-[620px] h-[calc(100vh-210px)] min-h-[500px]">
          <EditorToolbar
            language={language}
            onLanguageChange={handleLanguageChange}
            code={code}
            onCodeChange={setCode}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
            onFileLoaded={handleFileLoaded}
          />
          <div className="flex-1 w-full p-2 bg-card">
            <MonacoCodeEditor
              value={code}
              onChange={setCode}
              language={language}
              height="100%"
            />
          </div>
        </div>

        {/* Right Side: AI Analysis Insights Panel */}
        <div className="lg:col-span-6 flex flex-col rounded-2xl bg-card border border-border shadow-sm min-h-[620px] h-[calc(100vh-210px)] overflow-hidden">
          {isAnalyzing ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <LoadingProgress isLoading={true} />
            </div>
          ) : parsedAnalysisResult ? (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <AnalysisTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                analysis={parsedAnalysisResult}
              />

              <div className="flex-1 p-5 overflow-y-auto">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                  >
                    {activeTab === 'overview' && <OverviewTab analysis={parsedAnalysisResult} language={language} />}
                    {activeTab === 'explanation' && <ExplanationTab analysis={parsedAnalysisResult} />}
                    {activeTab === 'bugs' && <BugsTab analysis={parsedAnalysisResult} />}
                    {activeTab === 'security' && <SecurityTab analysis={parsedAnalysisResult} />}
                    {activeTab === 'complexity' && <ComplexityTab complexity={parsedAnalysisResult.complexity} />}
                    {activeTab === 'quality' && <QualityTab quality={parsedAnalysisResult.quality} />}
                    {activeTab === 'optimization' && <OptimizationTab analysis={parsedAnalysisResult} />}
                    {activeTab === 'refactor' && <RefactorTab analysis={parsedAnalysisResult} originalCode={code} language={language} />}
                    {activeTab === 'documentation' && <DocumentationPanel initialDocumentation={parsedAnalysisResult.documentation || ''} code={code} language={language} />}
                    {activeTab === 'chat' && <ChatPanel code={code} language={language} analysisContext={JSON.stringify(parsedAnalysisResult.summary)} />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-base text-foreground">
                  Ready to Analyze
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-sm">
                  Click <span className="font-semibold text-primary">Analyze Code</span> above to trigger full AI explanation, bug audit, and Big-O derivation.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
