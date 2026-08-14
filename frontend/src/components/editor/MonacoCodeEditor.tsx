import React, { useEffect, useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { useTheme } from '../../context/ThemeContext';
import { useSettings } from '../../context/SettingsContext';

interface MonacoCodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  readOnly?: boolean;
  height?: string;
}

export const MonacoCodeEditor: React.FC<MonacoCodeEditorProps> = ({
  value,
  onChange,
  language,
  readOnly = false,
  height = '100%'
}) => {
  const { isDark } = useTheme();
  const { settings } = useSettings();
  const monacoRef = useRef<any>(null);

  const handleEditorMount: OnMount = (editor, monaco) => {
    monacoRef.current = monaco;

    // Custom dark theme
    monaco.editor.defineTheme('codelens-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '64748b', fontStyle: 'italic' },
        { token: 'keyword', foreground: '818cf8', fontStyle: 'bold' },
        { token: 'string', foreground: '34d399' },
        { token: 'number', foreground: 'f59e0b' },
        { token: 'type', foreground: '38bdf8' },
      ],
      colors: {
        'editor.background': '#0b0f19',
        'editor.foreground': '#f1f5f9',
        'editorLineNumber.foreground': '#475569',
        'editorLineNumber.activeForeground': '#a5b4fc',
        'editor.lineHighlightBackground': '#1e293b40',
        'editorCursor.foreground': '#818cf8',
        'editorIndentGuide.background1': '#1e293b',
        'editorIndentGuide.activeBackground1': '#4338ca',
      }
    });

    // Custom light theme
    monaco.editor.defineTheme('codelens-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '94a3b8', fontStyle: 'italic' },
        { token: 'keyword', foreground: '4f46e5', fontStyle: 'bold' },
        { token: 'string', foreground: '059669' },
        { token: 'number', foreground: 'd97706' },
        { token: 'type', foreground: '0284c7' },
      ],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#0f172a',
        'editorLineNumber.foreground': '#94a3b8',
        'editorLineNumber.activeForeground': '#4f46e5',
        'editor.lineHighlightBackground': '#f1f5f9',
        'editorCursor.foreground': '#4f46e5',
        'editorIndentGuide.background1': '#e2e8f0',
        'editorIndentGuide.activeBackground1': '#6366f1',
      }
    });

    monaco.editor.setTheme(isDark ? 'codelens-dark' : 'codelens-light');
  };

  useEffect(() => {
    if (monacoRef.current) {
      monacoRef.current.editor.setTheme(isDark ? 'codelens-dark' : 'codelens-light');
    }
  }, [isDark]);

  return (
    <div className={`w-full h-full min-h-[400px] rounded-xl overflow-hidden border border-border transition-colors duration-200 ${isDark ? 'bg-[#0b0f19]' : 'bg-white'}`}>
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={(val) => onChange(val || '')}
        theme={isDark ? 'codelens-dark' : 'codelens-light'}
        onMount={handleEditorMount}
        options={{
          fontSize: settings.fontSize,
          fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, Monaco, monospace",
          fontLigatures: true,
          minimap: { enabled: settings.minimap },
          wordWrap: settings.wordWrap,
          tabSize: settings.tabSize,
          readOnly,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          padding: { top: 12, bottom: 12 },
          renderLineHighlight: 'all',
          bracketPairColorization: { enabled: true },
        }}
      />
    </div>
  );
};
