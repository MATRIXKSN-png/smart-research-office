import React, { useState, useRef } from 'react';
import { Link2, Files, Image, FileType, ArrowLeft, CheckCircle2, BookOpen, RefreshCw } from 'lucide-react';
import { PageTitle } from '../components/PageTitle';
import { SectionCard } from '../components/SectionCard';
import { StatCard } from '../components/StatCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { UploadDropzone, UploadedFile } from '../components/UploadDropzone';
import { EmptyState } from '../components/EmptyState';
import { StatusBadge } from '../components/StatusBadge';
import { useReferences, Reference, ReferenceFile, FileStatus } from '../context/ReferencesContext';
import { processReference, PipelineFile } from '../services/extraction/processingPipeline';

type Page = 'upload' | 'extracted' | 'analysis' | 'settings';

const agentPipeline = [
  { short: 'مدير' },
  { short: 'استخراج' },
  { short: 'OCR' },
  { short: 'تحليل' },
  { short: 'بحث' },
  { short: 'تنظيم' },
];

interface UploadPageProps {
  onNavigate: (page: Page) => void;
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

export function UploadPage({ onNavigate }: UploadPageProps) {
  const { addReference, references, updateFileStatus, updateFileText, autoSelectFirstExtracted } = useReferences();

  const [bookName, setBookName] = useState('');
  const [author, setAuthor] = useState('');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [linked, setLinked] = useState(false);
  const [lastLinkedName, setLastLinkedName] = useState('');
  const [processing, setProcessing] = useState(false);
  const processingRef = useRef(false);

  const pdfCount = files.filter((f) => f.type === 'pdf').length;
  const imageCount = files.filter((f) => f.type === 'image').length;

  const handleLink = async () => {
    if (!bookName.trim() || files.length === 0 || processingRef.current) return;

    const refId = `ref-${Date.now()}`;
    const refName = bookName.trim();
    const refAuthor = author.trim() || 'غير محدد';

    const refFiles: ReferenceFile[] = files.map((f, index) => ({
      id: `${refId}-file-${index}`,
      referenceId: refId,
      fileName: f.name,
      fileType: f.type,
      pageNumber: index + 1,
      extractionMethod: '',
      agentName: '',
      status: 'في الانتظار' as FileStatus,
      extractedText: '',
      fileSize: f.size,
    }));

    const newRef: Reference = {
      id: refId,
      name: refName,
      author: refAuthor,
      year: new Date().getFullYear(),
      totalPages: files.length,
      files: refFiles,
      createdAt: new Date(),
    };

    addReference(newRef);
    setLastLinkedName(refName);
    setLinked(true);
    setBookName('');
    setAuthor('');
    setFiles([]);

    const pipelineFiles: PipelineFile[] = refFiles.map((rf, idx) => ({
      id: rf.id,
      referenceId: refId,
      referenceName: refName,
      referenceAuthor: refAuthor,
      fileName: rf.fileName,
      fileType: rf.fileType,
      pageNumber: rf.pageNumber,
      rawFile: files[idx]?.rawFile,
    }));

    processingRef.current = true;
    setProcessing(true);

    await processReference(pipelineFiles, {
      onStatusChange: (fileId, status) => {
        updateFileStatus(fileId, status);
      },
      onTextExtracted: (fileId, text, method, agent) => {
        updateFileText(fileId, text, method, agent);
      },
      onPipelineComplete: (referenceId) => {
        autoSelectFirstExtracted(referenceId);
        processingRef.current = false;
        setProcessing(false);
      },
    });
  };

  const handleReset = () => {
    setBookName('');
    setAuthor('');
    setFiles([]);
    setLinked(false);
    setLastLinkedName('');
  };

  return (
    <div style={{ direction: 'rtl' }}>
      <PageTitle
        title="ربط الملفات بمرجع"
        description="ارفع ملفاتك وربطها بمرجع واحد قبل توزيع المهام على الوكلاء الذكيين"
        badge={
          processing ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-100 border border-violet-200 text-xs font-medium text-violet-700">
              <RefreshCw className="w-3 h-3 animate-spin" />
              جارٍ المعالجة...
            </span>
          ) : (
            <StatusBadge status="نشط الآن" size="sm" />
          )
        }
      />

      <div className="mb-6 bg-surface rounded-2xl border border-border-light card-shadow p-4">
        <p className="text-xs font-bold text-muted mb-3 uppercase tracking-wide">مسار معالجة الملف</p>
        <div className="flex items-center flex-wrap gap-1">
          {agentPipeline.map((step, i) => (
            <React.Fragment key={step.short}>
              <div className={`px-3 py-1.5 rounded-lg text-xs font-medium ${i === 0 ? 'primary-gradient text-white' : 'bg-violet-50 text-violet-600 border border-violet-100 dark-chip'}`}>
                {step.short}
              </div>
              {i < agentPipeline.length - 1 && (
                <ArrowLeft className="w-3 h-3 text-violet-300" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <SectionCard title="رفع الملفات وربطها بالمرجع" description="أدخل معلومات المرجع ثم أضف الملفات">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-main mb-1.5">
                  اسم الكتاب / المرجع <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={bookName}
                  onChange={(e) => setBookName(e.target.value)}
                  placeholder="مثال: مناهج البحث العلمي وطرق التوثيق"
                  className="dark-input w-full rounded-xl border border-violet-200 bg-violet-50/30 px-4 py-2.5 text-sm placeholder-muted focus:outline-none focus:ring-2 focus:ring-violet-300 transition-all"
                  style={{ direction: 'rtl' }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-main mb-1.5">اسم المؤلف</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="مثال: د. عبدالرحمن الحسن"
                  className="dark-input w-full rounded-xl border border-violet-200 bg-violet-50/30 px-4 py-2.5 text-sm placeholder-muted focus:outline-none focus:ring-2 focus:ring-violet-300 transition-all"
                  style={{ direction: 'rtl' }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-main mb-1.5">الملفات</label>
                <UploadDropzone files={files} onFilesChange={setFiles} />
              </div>
              <div className="flex gap-3 pt-2">
                <PrimaryButton
                  onClick={handleLink}
                  disabled={!bookName.trim() || files.length === 0 || processing}
                  icon={<Link2 className="w-4 h-4" />}
                >
                  {processing ? 'جارٍ المعالجة...' : 'ربط الملفات'}
                </PrimaryButton>
                <SecondaryButton onClick={handleReset} disabled={processing}>
                  إعادة تعيين
                </SecondaryButton>
              </div>
            </div>
          </SectionCard>

          {linked && (
            <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-emerald-700">
                  تم ربط الملفات بمرجع «{lastLinkedName}» — بدأت المعالجة تلقائيًا
                </p>
                <p className="text-xs text-emerald-600 mt-1">
                  <button
                    onClick={() => onNavigate('extracted')}
                    className="underline font-semibold hover:text-emerald-800 transition-colors"
                  >
                    عرض النصوص المستخرجة
                  </button>
                  {' '}لمتابعة تقدم المعالجة
                </p>
              </div>
            </div>
          )}

          {references.length > 0 && (
            <SectionCard title={`المراجع المرفوعة (${references.length})`}>
              <div className="space-y-2">
                {references.map((ref) => {
                  const extractedCount = ref.files.filter((f) => f.status === 'extracted').length;
                  const processingCount = ref.files.filter((f) => f.status === 'processing').length;
                  const failedCount = ref.files.filter((f) => f.status === 'failed').length;
                  const allDone = extractedCount + failedCount === ref.files.length;

                  return (
                    <div key={ref.id} className="flex items-center gap-3 p-3 bg-soft rounded-xl border border-border-light">
                      <BookOpen className="w-4 h-4 text-violet-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-main truncate">{ref.name}</p>
                        <p className="text-[10px] text-muted">{ref.author} • {ref.files.length} ملف</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {processingCount > 0 ? (
                          <span className="text-[10px] text-violet-500 font-medium flex items-center gap-1">
                            <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                            {processingCount} جارٍ
                          </span>
                        ) : allDone ? (
                          <span className={`text-[10px] font-medium ${failedCount > 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                            {extractedCount}/{ref.files.length} مكتمل
                          </span>
                        ) : (
                          <StatusBadge status="في الانتظار" size="sm" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </SectionCard>
          )}
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <StatCard
              label="إجمالي الملفات المختارة"
              value={files.length}
              icon={<Files className="w-5 h-5" />}
              color="purple"
            />
            <StatCard
              label="ملفات PDF"
              value={pdfCount}
              icon={<FileType className="w-5 h-5" />}
              color="blue"
            />
            <StatCard
              label="الصور المرفوعة"
              value={imageCount}
              icon={<Image className="w-5 h-5" />}
              color="green"
            />
          </div>

          <SectionCard title="حالة المعالجة">
            {references.length > 0 ? (
              <div className="space-y-2">
                {references.map((ref) => {
                  const total = ref.files.length;
                  const done = ref.files.filter((f) => f.status === 'extracted' || f.status === 'failed').length;
                  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                  return (
                    <div key={ref.id} className="mb-3">
                      <div className="flex justify-between mb-1">
                        <span className="text-[10px] text-muted truncate max-w-[120px]">{ref.name}</span>
                        <span className="text-[10px] font-bold text-violet-600">{pct}%</span>
                      </div>
                      <div className="w-full bg-violet-100 rounded-full h-1.5 dark-progress-bg">
                        <div
                          className="bg-violet-500 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-muted leading-6">
                بعد رفع الملفات سيظهر هنا تقدم معالجة كل مرجع.
              </p>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
