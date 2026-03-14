import React, { useState } from 'react';
import { Trash2, Copy, FileDown, BookOpen, AlertCircle } from 'lucide-react';
import { PageTitle } from '../components/PageTitle';
import { SectionCard } from '../components/SectionCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { EmptyState } from '../components/EmptyState';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { MetadataRow } from '../components/MetadataRow';
import { useReferences, ReferenceFile } from '../context/ReferencesContext';

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

  console.log('[ExtractedPage] references:', references.length, '| selectedRef:', selectedRefId, '| selectedFile:', selectedFileId);

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
        action={
          references.length > 0 ? (
            <PrimaryButton size="sm" icon={<FileDown className="w-4 h-4" />}>
              حفظ جميع النصوص لهذا المرجع
            </PrimaryButton>
          ) : undefined
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
                {references.map((ref) => (
                  <div key={ref.id} className="group">
                    <div
                      onClick={() => setSelectedRefId(ref.id)}
                      className={`flex items-start gap-2 p-3 rounded-xl cursor-pointer transition-all duration-150 ${
                        selectedRefId === ref.id
                          ? 'bg-violet-50 border border-violet-200'
                          : 'hover:bg-violet-50/50 border border-transparent'
                      }`}
                    >
                      <BookOpen
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          selectedRefId === ref.id ? 'text-violet-600' : 'text-[#8C84A8]'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold leading-tight ${selectedRefId === ref.id ? 'text-violet-800' : 'text-[#231942]'}`}>
                          {ref.name}
                        </p>
                        <p className="text-[10px] text-[#8C84A8] mt-0.5 truncate">{ref.author}</p>
                        <p className="text-[10px] text-violet-400 mt-1">{ref.files.length} ملف</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget(ref.id);
                        }}
                        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-red-50"
                        title="حذف المرجع"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    </div>

                    {selectedRefId === ref.id && ref.files.length > 0 && (
                      <div className="mt-1 pr-2 space-y-1">
                        {ref.files.map((file) => (
                          <button
                            key={file.id}
                            onClick={() => setSelectedFileId(file.id)}
                            className={`w-full text-right px-3 py-2 rounded-lg text-xs transition-all ${
                              selectedFileId === file.id
                                ? 'bg-violet-100 text-violet-700 font-semibold'
                                : 'text-[#6B628A] hover:bg-violet-50'
                            }`}
                          >
                            <span className="truncate block">
                              ص {file.pageNumber} — {file.fileName.length > 20 ? file.fileName.slice(0, 20) + '...' : file.fileName}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          <div className="lg:col-span-3 space-y-4">
            {!selectedRef ? (
              <EmptyState
                title="اختر مرجعًا من القائمة"
                description="اضغط على أي مرجع في القائمة على اليمين لعرض ملفاته"
                icon="file"
              />
            ) : selectedFile && selectedFile.extractedText ? (
              <>
                <div className="flex items-center gap-2 justify-end flex-wrap">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-2 bg-white border border-violet-200 rounded-xl text-xs font-medium text-violet-700 hover:bg-violet-50 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copied ? 'تم النسخ!' : 'نسخ النص'}
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 bg-white border border-violet-200 rounded-xl text-xs font-medium text-violet-700 hover:bg-violet-50 transition-colors">
                    <FileDown className="w-3.5 h-3.5" />
                    حفظ كملف وورد
                  </button>
                </div>

                <SectionCard title="معلومات الملف">
                  <div className="grid grid-cols-2 gap-x-6">
                    <MetadataRow label="اسم الملف" value={selectedFile.fileName} />
                    <MetadataRow label="المرجع" value={selectedRef.name} />
                    <MetadataRow label="رقم الصفحة" value={`ص ${selectedFile.pageNumber}`} />
                    <MetadataRow label="طريقة الاستخراج" value={selectedFile.extractionMethod} />
                    <MetadataRow label="الوكيل المنفذ" value={selectedFile.agentName} />
                    <MetadataRow label="الحالة" value={selectedFile.status} />
                  </div>
                </SectionCard>

                <SectionCard title="النص الأصلي">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-4 rounded-full bg-violet-600" />
                    <span className="text-xs font-semibold text-violet-700">النص الأصلي — غير قابل للتعديل</span>
                    <span className="text-[10px] text-[#8C84A8] bg-violet-50 px-2 py-0.5 rounded-full border border-violet-100">
                      محفوظ كما ورد في المصدر
                    </span>
                  </div>
                  <div
                    className="bg-[#FCFAFF] rounded-xl border border-violet-100 p-5 text-sm text-[#231942] leading-8 font-medium"
                    style={{ userSelect: 'text', cursor: 'default', direction: 'rtl' }}
                  >
                    {selectedFile.extractedText}
                  </div>
                </SectionCard>

                <SectionCard title="تحليل منفصل عن النص الأصلي">
                  <div className="flex items-start gap-3 p-4 bg-amber-50/60 rounded-xl border border-amber-100">
                    <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-amber-700 mb-1">لا يتم تعديل النص الأصلي</p>
                      <p className="text-xs text-[#8C84A8] leading-5">
                        انتقل إلى صفحة تحليل السؤال لبدء التحليل الذكي على هذا المرجع.
                      </p>
                    </div>
                  </div>
                </SectionCard>
              </>
            ) : (
              <div className="bg-white rounded-2xl border border-violet-100 card-shadow">
                <div className="p-5 border-b border-violet-50">
                  <p className="text-sm font-semibold text-[#231942]">{selectedRef.name}</p>
                  <p className="text-xs text-[#6B628A] mt-0.5">{selectedRef.author}</p>
                </div>
                <div className="p-5 space-y-3">
                  {selectedRef.files.map((file) => (
                    <div key={file.id} className="flex items-center gap-3 p-3 bg-violet-50/40 rounded-xl border border-violet-100">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[#231942] truncate">{file.fileName}</p>
                        <p className="text-[10px] text-[#8C84A8] mt-0.5">
                          {file.extractionMethod} • {file.agentName}
                        </p>
                      </div>
                      <StatusBadge status={file.status} size="sm" />
                    </div>
                  ))}
                  <div className="flex items-start gap-3 p-3 bg-amber-50/60 rounded-xl border border-amber-100 mt-3">
                    <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700 leading-5">
                      لا يوجد نص مستخرج لهذا المرجع بعد. الوكلاء يعالجون الملفات في الخلفية.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="حذف المرجع"
        message="هل تريد حذف هذا المرجع من القائمة؟ سيتم حذف جميع الملفات التابعة له من العرض الحالي."
        confirmLabel="حذف المرجع"
        cancelLabel="إلغاء"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        danger
      />
    </div>
  );
}
