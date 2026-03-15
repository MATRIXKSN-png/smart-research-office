import React, { useState } from 'react';
import { Upload, Image, FileText, Plus, X } from 'lucide-react';

export interface UploadedFile {
  id: string;
  name: string;
  type: 'pdf' | 'image';
  size: string;
  rawFile: File;
}

interface UploadDropzoneProps {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(0)} كيلوبايت`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} ميغابايت`;
}

function normalizeAcceptedFiles(rawFiles: File[]): UploadedFile[] {
  return rawFiles
    .filter((f) => f.type === 'application/pdf' || f.type.startsWith('image/'))
    .map((f) => ({
      id: `file-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: f.name,
      type: f.type.startsWith('image/') ? 'image' : 'pdf',
      size: formatFileSize(f.size),
      rawFile: f,
    }));
}

export function UploadDropzone({ files, onFilesChange }: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  const addFiles = (rawFiles: File[]) => {
    const newFiles = normalizeAcceptedFiles(rawFiles);

    if (newFiles.length === 0) return;

    const existingKeys = new Set(files.map((f) => `${f.name}-${f.size}-${f.type}`));
    const uniqueNewFiles = newFiles.filter((f) => !existingKeys.has(`${f.name}-${f.size}-${f.type}`));

    onFilesChange([...files, ...uniqueNewFiles]);
  };

  const removeFile = (id: string) => {
    onFilesChange(files.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200
          ${isDragging
            ? 'border-violet-400 bg-violet-50 dark-dropzone-active scale-[1.01]'
            : 'border-violet-200 dark-dropzone hover:border-violet-300'}
        `}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center dark-icon-bg">
            <Upload className="w-7 h-7 text-violet-500" />
          </div>

          <div>
            <p className="text-sm font-semibold text-main">اسحب الملفات هنا أو اضغط للاختيار</p>
            <p className="text-xs text-muted mt-1">PDF • JPG • PNG • WEBP</p>
          </div>

          <label className="cursor-pointer">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-surface border border-violet-200 rounded-xl text-sm font-medium text-violet-700 hover:bg-violet-50 transition-colors dark-border">
              <Plus className="w-4 h-4" />
              اختيار الملفات
            </span>
            <input
              type="file"
              className="hidden"
              accept=".pdf,image/*"
              multiple
              onChange={handleFileInput}
            />
          </label>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 p-3 bg-surface rounded-xl border border-border-light dark-card"
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  file.type === 'pdf' ? 'bg-red-50' : 'bg-blue-50'
                }`}
              >
                {file.type === 'pdf' ? (
                  <FileText className="w-4 h-4 text-red-500" />
                ) : (
                  <Image className="w-4 h-4 text-blue-500" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-main truncate">{file.name}</p>
                <p className="text-[10px] text-muted">
                  {file.size} • {file.type === 'pdf' ? 'PDF' : 'صورة'}
                </p>
              </div>

              <button
                onClick={() => removeFile(file.id)}
                className="text-muted hover:text-red-500 transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

