import React, { createContext, useContext, useState, useCallback } from 'react';

export interface ReferenceFile {
  id: string;
  referenceId: string;
  fileName: string;
  fileType: 'pdf' | 'image';
  pageNumber: number;
  extractionMethod: 'نص مباشر' | 'OCR';
  agentName: string;
  status: 'مكتمل' | 'قيد المعالجة' | 'في الانتظار';
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
}

const ReferencesContext = createContext<ReferencesContextValue | null>(null);

export function ReferencesProvider({ children }: { children: React.ReactNode }) {
  const [references, setReferences] = useState<Reference[]>([]);
  const [selectedRefId, setSelectedRefId] = useState<string>('');
  const [selectedFileId, setSelectedFileId] = useState<string>('');

  const addReference = useCallback((ref: Reference) => {
    setReferences((prev) => {
      const updated = [...prev, ref];
      return updated;
    });
    setSelectedRefId(ref.id);
    setSelectedFileId(ref.files[0]?.id ?? '');
    console.log('[ReferencesContext] Reference added:', ref.name, '| Total:', references.length + 1);
  }, [references.length]);

  const deleteReference = useCallback((id: string) => {
    setReferences((prev) => {
      const remaining = prev.filter((r) => r.id !== id);
      console.log('[ReferencesContext] Reference deleted:', id, '| Remaining:', remaining.length);

      if (id === selectedRefId) {
        if (remaining.length > 0) {
          setSelectedRefId(remaining[0].id);
          setSelectedFileId(remaining[0].files[0]?.id ?? '');
        } else {
          setSelectedRefId('');
          setSelectedFileId('');
        }
      }

      return remaining;
    });
  }, [selectedRefId]);

  const handleSetSelectedRefId = useCallback((id: string) => {
    setSelectedRefId(id);
    const ref = references.find((r) => r.id === id);
    if (ref && ref.files.length > 0) {
      setSelectedFileId(ref.files[0].id);
    } else {
      setSelectedFileId('');
    }
    console.log('[ReferencesContext] Selected reference:', id);
  }, [references]);

  return (
    <ReferencesContext.Provider
      value={{
        references,
        selectedRefId,
        selectedFileId,
        setSelectedRefId: handleSetSelectedRefId,
        setSelectedFileId,
        addReference,
        deleteReference,
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
