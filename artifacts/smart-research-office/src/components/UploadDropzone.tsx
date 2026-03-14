import React, { useState } from 'react';
import { Upload, Image, FileText, Plus } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  type: 'pdf' | 'image';
  size: string;
}

interface UploadDropzoneProps {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
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
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (rawFiles: File[]) => {
    const newFiles: UploadedFile[] = rawFiles.map((f) => ({
      id: `file-${Date.now()}-${Math.random()}`,
      name: f.name,
      type: f.type.startsWith('image') ? 'image' : 'pdf',
      size: `${(f.size / 1024).toFixed(0)} كيلوبايت`,
    }));
    onFilesChange([...files, ...newFiles]);
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
            ? 'border-violet-400 bg-violet-50 scale-[1.01]'
            : 'border-violet-200 bg-violet-50/40 hover:border-violet-300 hover:bg-violet-50'}
        `}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center">
            <Upload className="w-7 h-7 text-violet-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#231942]">اسحب الملفات هنا أو اضغط للاختيار</p>
            <p className="text-xs text-[#8C84A8] mt-1">PDF • JPG • PNG</p>
          </div>
          <label className="cursor-pointer">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-violet-200 rounded-xl text-sm font-medium text-violet-700 hover:bg-violet-50 transition-colors">
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
              className="flex items-center gap-3 p-3 bg-white rounded-xl border border-violet-100"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${file.type === 'pdf' ? 'bg-red-50' : 'bg-blue-50'}`}>
                {file.type === 'pdf' ? (
                  <FileText className="w-4 h-4 text-red-500" />
                ) : (
                  <Image className="w-4 h-4 text-blue-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[#231942] truncate">{file.name}</p>
                <p className="text-[10px] text-[#8C84A8]">{file.size} • {file.type === 'pdf' ? 'PDF' : 'صورة'}</p>
              </div>
              <button
                onClick={() => removeFile(file.id)}
                className="text-[#8C84A8] hover:text-red-500 transition-colors p-1"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
