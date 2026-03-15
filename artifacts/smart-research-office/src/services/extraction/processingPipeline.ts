import { FileStatus } from '../../context/ReferencesContext';

export interface PipelineFile {
  id: string;
  referenceId: string;
  referenceName: string;
  referenceAuthor: string;
  fileName: string;
  fileType: 'pdf' | 'image';
  pageNumber: number;
  rawFile?: File;
}

export interface PipelineCallbacks {
  onStatusChange: (fileId: string, status: FileStatus) => void;
  onTextExtracted: (fileId: string, text: string, method: string, agent: string) => void;
  onPipelineComplete: (referenceId: string) => void;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getBackendBaseUrl(): string {
  return (import.meta.env.VITE_AI_BACKEND_URL as string | undefined)?.trim() || 'http://localhost:8787';
}

async function extractFileReal(file: PipelineFile): Promise<{ text: string; method: string; agent: string }> {
  if (!file.rawFile) {
    throw new Error('الملف الأصلي غير موجود.');
  }

  const formData = new FormData();
  formData.append('file', file.rawFile);
  formData.append('fileType', file.fileType);
  formData.append('fileName', file.fileName);
  formData.append('referenceName', file.referenceName);
  formData.append('referenceAuthor', file.referenceAuthor);
  formData.append('pageNumber', String(file.pageNumber));

  const response = await fetch(`${getBackendBaseUrl()}/api/extraction/process`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.success) {
    throw new Error(data?.error || `HTTP ${response.status}`);
  }

  return {
    text: data.text,
    method: data.method,
    agent: data.agent,
  };
}

export async function processReference(
  files: PipelineFile[],
  callbacks: PipelineCallbacks
): Promise<void> {
  if (files.length === 0) return;

  const referenceId = files[0].referenceId;

  for (const file of files) {
    callbacks.onStatusChange(file.id, 'queued');
  }

  await delay(300);

  for (const file of files) {
    callbacks.onStatusChange(file.id, 'processing');

    try {
      const { text, method, agent } = await extractFileReal(file);

      callbacks.onStatusChange(file.id, 'extracted');
      callbacks.onTextExtracted(file.id, text, method, agent);
    } catch {
      callbacks.onStatusChange(file.id, 'failed');
    }
  }

  callbacks.onPipelineComplete(referenceId);
}
