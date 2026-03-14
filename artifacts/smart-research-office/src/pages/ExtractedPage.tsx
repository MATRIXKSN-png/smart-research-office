import React, { useState } from 'react';
import { Trash2, Copy, FileDown, BookOpen, AlertCircle, RefreshCw, Clock, Loader2 } from 'lucide-react';
import { PageTitle } from '../components/PageTitle';
import { SectionCard } from '../components/SectionCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { EmptyState } from '../components/EmptyState';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { MetadataRow } from '../components/MetadataRow';
import { useReferences, ReferenceFile, FileStatus } from '../context/ReferencesContext';

function FileStatusDisplay({ status }: { status: FileStatus }) {
  if (status === 'queued' || status === 'في الانتظار') {
    return (
      <div className="flex items-center gap-3 p-4 bg-violet-50/60 rounded-xl border border-violet-100 dark-soft-card">
        <Clock className="w-5 h-5 text-violet-400 flex-shrink-0" />
        <p className="text-sm text-violet-600 font-medium">هذه الصفحة في انتظار المعالجة.</p>
      </div>
    );
  }
  if (status === 'processing') {
    return (
      <div className="flex items-center gap-3 p-4 bg-amber-50/60 rounded-xl border border-amber-100">
        <Loader2 className="w-5 h-5 text-amber-500 animate-spin flex-shrink-0" />
        <p className="text-sm text-amber-700 font-medium">جارٍ استخراج النص من هذه الصفحة...</p>
      </div>
    );
  }
  if (status === 'failed') {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50/60 rounded-xl border border-red-100">
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
        <p className="text-sm text-red-700 font-medium">تعذر استخراج النص من هذا الملف في الوقت الحالي.</p>
      </div>
    );
  }
  return null;
}

function statusLabel(status: FileStatus): string {
  switch (status) {
    case 'queued': return 'في الانتظار';
    case 'processing': return 'قيد المعالجة';
    case 'extracted': return 'تم الاستخراج';
    case 'failed': return 'فشل الاستخراج';
    default: return 'في الانتظار';
  }
}

function statusDot(status: FileStatus): string {
  switch (status) {
    case 'extracted': return 'bg-emerald-400';
    case 'processing': return 'bg-amber-400 animate-pulse';
    case 'failed': return 'bg-red-400';
    default: return 'bg-violet-300';
  }
}

export function ExtractedPage() {
  const {
    references,
    selectedRefId,
    selectedFileId,
    setSelectedRefId,
    setSelectedFileId,
    deleteReference,
  } = useReferences();

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const selectedRef = references.find((r) => r.id === selectedRefId);
  const selectedFile: ReferenceFile | undefined = selectedRef?.files.find((f) => f.id === selectedFileId);

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteReference(deleteTarget);
    setDeleteTarget(null);
  };

  const handleCopy = () => {
    const text = selectedFile?.extractedText;
    if (text) {
      navigator.clipboard.writeText(text).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{ direction: 'rtl' }}>
      <PageTitle
        title="النصوص المستخرجة"
        description="يُعرض النص الأصلي كما هو دون إعادة صياغة أو تعديل"
        badge={
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-medium text-amber-700">
            <AlertCircle className="w-3 h-3" />
            النص محفوظ كما ورد في المصدر
          </span>
        }
      />

      {references.length === 0 ? (
        <EmptyState
          title="لا توجد مراجع مرفوعة بعد"
          description="قم برفع ملفات جديدة لبدء العمل من صفحة ربط الملفات بمرجع"
          icon="inbox"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          <div className="lg:col-span-1">
            <SectionCard title="قائمة المراجع">
              <div className="space-y-2">
                {references.map((ref) => {
                  const extractedCount = ref.files.filter((f) => f.status === 'extracted').length;
                  const processingCount = ref.files.filter((f) => f.status === 'processing').length;

                  return (
                    <div key={ref.id} className="group">
                      <div
                        onClick={() => setSelectedRefId(ref.id)}
                        className={`flex items-start gap-2 p-3 rounded-xl cursor-pointer transition-all duration-150 ${
                          selectedRefId === ref.id
                            ? 'bg-violet-50 border border-violet-200 dark-selected-card'
                            : 'hover:bg-violet-50/50 border border-transparent'
                        }`}
                      >
                        <BookOpen className={`w-4 h-4 mt-0.5 flex-shrink-0 ${selectedRefId === ref.id ? 'text-violet-600' : 'text-muted'}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-semibold leading-tight ${selectedRefId === ref.id ? 'text-violet-800' : 'text-main'}`}>
                            {ref.name}
                          </p>
                          <p className="text-[10px] text-muted mt-0.5 truncate">{ref.author}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-emerald-600 font-medium">{extractedCount} مكتمل</span>
                            {processingCount > 0 && (
                              <span className="text-[10px] text-amber-600 font-medium flex items-center gap-0.5">
                                <RefreshCw className="w-2 h-2 animate-spin" />
                                {processingCount}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeleteTarget(ref.id); }}
                          className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        </button>
                      </div>

                      {selectedRefId === ref.id && ref.files.length > 0 && (
                        <div className="mt-1 pr-2 space-y-0.5">
                          {ref.files.map((file) => (
                            <button
                              key={file.id}
                              onClick={() => setSelectedFileId(file.id)}
                              className={`w-full text-right px-3 py-2 rounded-lg text-xs transition-all flex items-center gap-2 ${
                                selectedFileId === file.id
                                  ? 'bg-violet-100 text-violet-700 font-semibold dark-selected-chip'
                                  : 'text-muted hover:bg-violet-50/50'
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDot(file.status)}`} />
                              <span className="truncate flex-1">
                                ص {file.pageNumber} — {file.fileName.length > 18 ? file.fileName.slice(0, 18) + '...' : file.fileName}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </SectionCard>
          </div>

          <div className="lg:col-span-3 space-y-4">
            {!selectedRef ? (
              <EmptyState title="اختر مرجعًا من القائمة" description="اضغط على أي مرجع في القائمة لعرض ملفاته" icon="file" />
            ) : !selectedFile ? (
              <EmptyState title="اختر ملفًا لعرض محتواه" description="اضغط على أحد الملفات في قائمة المرجع" icon="file" />
            ) : (
              <>
                {selectedFile.status === 'extracted' ? (
                  <>
                    <div className="flex items-center gap-2 justify-end flex-wrap">
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-3 py-2 bg-surface border border-border-light rounded-xl text-xs font-medium text-violet-700 hover:bg-violet-50 transition-colors dark-btn"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        {copied ? 'تم النسخ!' : 'نسخ النص'}
                      </button>
                      <button className="flex items-center gap-2 px-3 py-2 bg-surface border border-border-light rounded-xl text-xs font-medium text-violet-700 hover:bg-violet-50 transition-colors dark-btn">
                        <FileDown className="w-3.5 h-3.5" />
                        حفظ كملف
                      </button>
                    </div>

                    <SectionCard title="معلومات الملف">
                      <div className="grid grid-cols-2 gap-x-6">
                        <MetadataRow label="اسم الملف" value={selectedFile.fileName} />
                        <MetadataRow label="المرجع" value={selectedRef.name} />
                        <MetadataRow label="رقم الصفحة" value={`ص ${selectedFile.pageNumber}`} />
                        <MetadataRow label="طريقة الاستخراج" value={selectedFile.extractionMethod || '—'} />
                        <MetadataRow label="الوكيل المنفذ" value={selectedFile.agentName || '—'} />
                        <MetadataRow label="الحالة" value={statusLabel(selectedFile.status)} />
                      </div>
                    </SectionCard>

                    <SectionCard title="النص الأصلي">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-1 h-4 rounded-full bg-violet-600" />
                        <span className="text-xs font-semibold text-violet-700">النص الأصلي — غير قابل للتعديل</span>
                        <span className="text-[10px] text-muted bg-violet-50 px-2 py-0.5 rounded-full border border-violet-100 dark-chip">
                          محفوظ كما ورد في المصدر
                        </span>
                      </div>
                      <div
                        className="bg-soft rounded-xl border border-border-light p-5 text-sm text-main leading-8 font-medium whitespace-pre-wrap"
                        style={{ userSelect: 'text', cursor: 'default', direction: 'rtl' }}
                      >
                        {selectedFile.extractedText}
                      </div>
                    </SectionCard>
                  </>
                ) : (
                  <SectionCard title={`${selectedFile.fileName} — الصفحة ${selectedFile.pageNumber}`}>
                    <FileStatusDisplay status={selectedFile.status} />
                    <div className="mt-4">
                      <SectionCard title="جميع الصفحات">
                        <div className="space-y-2">
                          {selectedRef.files.map((f) => (
                            <div key={f.id} className="flex items-center gap-3 p-3 bg-soft rounded-xl border border-border-light">
                              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusDot(f.status)}`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-main truncate">{f.fileName}</p>
                                <p className="text-[10px] text-muted mt-0.5">ص {f.pageNumber}</p>
                              </div>
                              <StatusBadge status={statusLabel(f.status)} size="sm" />
                            </div>
                          ))}
                        </div>
                      </SectionCard>
                    </div>
                  </SectionCard>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="حذف المرجع"
        message="هل تريد حذف هذا المرجع من القائمة؟ سيتم حذف جميع الصفحات والنصوص التابعة له."
        confirmLabel="حذف المرجع"
        cancelLabel="إلغاء"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        danger
      />
    </div>
  );
}
