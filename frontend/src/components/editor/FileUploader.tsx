import React, { useRef, useState } from 'react';
import { Upload, FileCode, Loader2 } from 'lucide-react';
import { uploadSourceFile } from '../../services/api';
import { useToast } from '../ui/Toast';

interface FileUploaderProps {
  onFileLoaded: (code: string, language: string, filename: string) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileLoaded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      toast({
        title: 'File Too Large',
        message: 'Maximum file upload size is 1MB.',
        type: 'error'
      });
      return;
    }

    try {
      setUploading(true);
      const res = await uploadSourceFile(file);
      onFileLoaded(res.code, res.language, res.filename);
      toast({
        title: 'File Uploaded',
        message: `Successfully loaded ${res.filename} (${res.language}).`,
        type: 'success'
      });
    } catch (err: any) {
      toast({
        title: 'Upload Failed',
        message: err.message || 'Could not parse source file',
        type: 'error'
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".py,.java,.c,.cpp,.cc,.cxx,.h,.hpp,.js,.html,.htm,.css,.sql"
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-all shadow-sm disabled:opacity-50"
        title="Upload source file"
      >
        {uploading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
        ) : (
          <Upload className="w-3.5 h-3.5 text-muted-foreground" />
        )}
        <span>Upload File</span>
      </button>
    </>
  );
};
