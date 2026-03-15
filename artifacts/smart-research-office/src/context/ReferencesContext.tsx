import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { saveReferences, loadReferences } from '../services/storage/localStorageService';

export type FileStatus = 'queued' | 'processing' | 'extracted' | 'failed' | 'في الانتظار';

export interface ReferenceFile {
  id: string;
  referenceId: string;
  fileName: string;
  fileType: 'pdf' | 'image';
  pageNumber: number;
  extractionMethod: 'نص مباشر' | 'OCR' | '';
  agentName: string;
  status: FileStatus;
  extractedText: string;
  fileSize: string;
}

export interface Reference {
  id: string;
  name: string;
  author: string;
  year: number;
  totalPages: number;
  files: ReferenceFile[];
  createdAt: Date;
}

interface ReferencesContextValue {
  references: Reference[];
  selectedRefId: string;
  selectedFileId: string;
  setSelectedRefId: (id: string) => void;
  setSelectedFileId: (id: string) => void;
  addReference: (ref: Reference) => void;
  deleteReference: (id: string) => void;
  updateFileStatus: (fileId: string, status: FileStatus) => void;
  updateFileText: (fileId: string, text: string, method: string, agent: string) => void;
  autoSelectFirstExtracted: (referenceId: string) => void;
}

const ReferencesContext = createContext<ReferencesContextValue | null>(null);

export function ReferencesProvider({ children }: { children: React.ReactNode }) {
  const [references, setReferences] = useState<Reference[]>(() => loadReferences());
  const [selectedRefId, setSelectedRefIdState] = useState<string>('');
  const [selectedFileId, setSelectedFileId] = useState<string>('');
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);

    saveTimer.current = setTimeout(() => {
      saveReferences(references);
    }, 300);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [references]);

  const addReference = useCallback((ref: Reference) => {
    setReferences((prev) => [...prev, ref]);
    setSelectedRefIdState(ref.id);
    setSelectedFileId(ref.files[0]?.id ?? '');
  }, []);

  const deleteReference = useCallback((id: string) => {
    setReferences((prev) => {
      const remaining = prev.filter((r) => r.id !== id);

      if (id === selectedRefId) {
        if (remaining.length > 0) {
          setSelectedRefIdState(remaining[0].id);
          setSelectedFileId(remaining[0].files[0]?.id ?? '');
        } else {
          setSelectedRefIdState('');
          setSelectedFileId('');
        }
      }

      return remaining;
    });
  }, [selectedRefId]);

  const setSelectedRefId = useCallback((id: string) => {
    setSelectedRefIdState(id);

    const ref = references.find((r) => r.id === id);
    if (ref && ref.files.length > 0) {
      const firstExtracted = ref.files.find((f) => f.status === 'extracted');
      setSelectedFileId(firstExtracted?.id ?? ref.files[0].id);
    } else {
      setSelectedFileId('');
    }
  }, [references]);

  const updateFileStatus = useCallback((fileId: string, status: FileStatus) => {
    setReferences((prev) =>
      prev.map((ref) => ({
        ...ref,
        files: ref.files.map((f) => (f.id === fileId ? { ...f, status } : f)),
      }))
    );
  }, []);

  const updateFileText = useCallback((fileId: string, text: string, method: string, agent: string) => {
    setReferences((prev) =>
      prev.map((ref) => ({
        ...ref,
        files: ref.files.map((f) =>
          f.id === fileId
            ? {
                ...f,
                extractedText: text,
                extractionMethod: method as 'نص مباشر' | 'OCR' | '',
                agentName: agent,
                status: 'extracted',
              }
            : f
        ),
      }))
    );
  }, []);

  const autoSelectFirstExtracted = useCallback((referenceId: string) => {
    setReferences((prev) => {
      const ref = prev.find((r) => r.id === referenceId);
      if (!ref) return prev;

      const updatedRef = prev.find((r) => r.id === referenceId);
      const firstExtracted = updatedRef?.files.find((f) => f.status === 'extracted');

      if (firstExtracted) {
        setSelectedRefIdState(referenceId);
        setSelectedFileId(firstExtracted.id);
      }

      return prev;
    });
  }, []);

  return (
    <ReferencesContext.Provider
      value={{
        references,
        selectedRefId,
        selectedFileId,
        setSelectedRefId,
        setSelectedFileId,
        addReference,
        deleteReference,
        updateFileStatus,
        updateFileText,
        autoSelectFirstExtracted,
      }}
    >
      {children}
    </ReferencesContext.Provider>
  );
}

export function useReferences(): ReferencesContextValue {
  const ctx = useContext(ReferencesContext);
  if (!ctx) {
    throw new Error('useReferences must be used within ReferencesProvider');
  }
  return ctx;
}
