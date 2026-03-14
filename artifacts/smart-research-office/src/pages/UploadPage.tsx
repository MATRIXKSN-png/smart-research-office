import React, { useState } from 'react';
import { Link2, Files, Image, FileType, ArrowLeft, CheckCircle2, BookOpen } from 'lucide-react';
import { PageTitle } from '../components/PageTitle';
import { SectionCard } from '../components/SectionCard';
import { StatCard } from '../components/StatCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { UploadDropzone } from '../components/UploadDropzone';
import { EmptyState } from '../components/EmptyState';
import { StatusBadge } from '../components/StatusBadge';
import { useReferences, Reference, ReferenceFile } from '../context/ReferencesContext';

type Page = 'upload' | 'extracted' | 'analysis' | 'settings';

interface UploadedFile {
  id: string;
  name: string;
  type: 'pdf' | 'image';
  size: string;
}

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

export function UploadPage({ onNavigate }: UploadPageProps) {
  const { addReference, references } = useReferences();

  const [bookName, setBookName] = useState('');
  const [author, setAuthor] = useState('');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [linked, setLinked] = useState(false);
  const [lastLinkedName, setLastLinkedName] = useState('');

  const pdfCount = files.filter((f) => f.type === 'pdf').length;
  const imageCount = files.filter((f) => f.type === 'image').length;

  const handleLink = () => {
    if (!bookName.trim() || files.length === 0) return;

    const refId = `ref-${Date.now()}`;

    const refFiles: ReferenceFile[] = files.map((f, index) => ({
      id: `${refId}-file-${index}`,
      referenceId: refId,
      fileName: f.name,
      fileType: f.type,
      pageNumber: index + 1,
      extractionMethod: f.type === 'image' ? 'OCR' : 'نص مباشر',
      agentName: f.type === 'image' ? 'موظف OCR' : 'موظف استخراج النصوص',
      status: 'في الانتظار',
      extractedText: '',
      fileSize: f.size,
    }));

    const newRef: Reference = {
      id: refId,
      name: bookName.trim(),
      author: author.trim() || 'غير محدد',
      year: new Date().getFullYear(),
      totalPages: files.length,
      files: refFiles,
      createdAt: new Date(),
    };

    console.log('[UploadPage] Creating reference:', newRef.name, '| Files:', newRef.files.length);
    addReference(newRef);

    setLastLinkedName(bookName.trim());
    setLinked(true);
    setBookName('');
    setAuthor('');
    setFiles([]);
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
        badge={<StatusBadge status="نشط الآن" size="sm" />}
      />

      <div className="mb-6 bg-white rounded-2xl border border-violet-100 card-shadow p-4">
        <p className="text-xs font-bold text-[#6B628A] mb-3 uppercase tracking-wide">مسار معالجة الملف</p>
        <div className="flex items-center flex-wrap gap-1">
          {agentPipeline.map((step, i) => (
            <React.Fragment key={step.short}>
              <div className={`px-3 py-1.5 rounded-lg text-xs font-medium ${i === 0 ? 'primary-gradient text-white' : 'bg-violet-50 text-violet-600 border border-violet-100'}`}>
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
                <label className="block text-xs font-semibold text-[#231942] mb-1.5">
                  اسم الكتاب / المرجع <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={bookName}
                  onChange={(e) => setBookName(e.target.value)}
                  placeholder="مثال: مناهج البحث العلمي وطرق التوثيق"
                  className="w-full rounded-xl border border-violet-200 bg-violet-50/30 px-4 py-2.5 text-sm text-[#231942] placeholder-[#8C84A8] focus:outline-none focus:ring-2 focus:ring-violet-300 transition-all"
                  style={{ direction: 'rtl' }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#231942] mb-1.5">اسم المؤلف</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="مثال: د. عبدالرحمن الحسن"
                  className="w-full rounded-xl border border-violet-200 bg-violet-50/30 px-4 py-2.5 text-sm text-[#231942] placeholder-[#8C84A8] focus:outline-none focus:ring-2 focus:ring-violet-300 transition-all"
                  style={{ direction: 'rtl' }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#231942] mb-1.5">الملفات</label>
                <UploadDropzone files={files} onFilesChange={setFiles} />
              </div>
              <div className="flex gap-3 pt-2">
                <PrimaryButton
                  onClick={handleLink}
                  disabled={!bookName.trim() || files.length === 0}
                  icon={<Link2 className="w-4 h-4" />}
                >
                  ربط الملفات
                </PrimaryButton>
                <SecondaryButton onClick={handleReset}>
                  إعادة تعيين
                </SecondaryButton>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="الملفات المختارة حاليًا">
            {files.length === 0 ? (
              <EmptyState
                title="لا توجد ملفات مختارة"
                description="قم بإضافة ملفات PDF أو صور JPG/PNG من منطقة الرفع أعلاه"
                icon="file"
              />
            ) : (
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={file.id} className="flex items-center gap-3 p-3 bg-violet-50/50 rounded-xl border border-violet-100">
                    <span className="text-xs font-bold text-violet-400 w-5 text-center">{index + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#231942] truncate">{file.name}</p>
                      <p className="text-[10px] text-[#8C84A8]">{file.size}</p>
                    </div>
                    <StatusBadge status="في الانتظار" size="sm" />
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {linked && (
            <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-emerald-700">
                  تم ربط الملفات بمرجع «{lastLinkedName}» بنجاح
                </p>
                <p className="text-xs text-emerald-600 mt-1">
                  يمكنك عرض النصوص المستخرجة من صفحة{' '}
                  <button
                    onClick={() => onNavigate('extracted')}
                    className="underline font-semibold hover:text-emerald-800 transition-colors"
                  >
                    النصوص المستخرجة
                  </button>
                </p>
              </div>
            </div>
          )}

          {references.length > 0 && (
            <SectionCard title={`المراجع المرفوعة (${references.length})`}>
              <div className="space-y-2">
                {references.map((ref) => (
                  <div key={ref.id} className="flex items-center gap-3 p-3 bg-violet-50/50 rounded-xl border border-violet-100">
                    <BookOpen className="w-4 h-4 text-violet-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#231942] truncate">{ref.name}</p>
                      <p className="text-[10px] text-[#8C84A8]">{ref.author} • {ref.files.length} ملف</p>
                    </div>
                    <StatusBadge status="في الانتظار" size="sm" />
                  </div>
                ))}
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
                <p className="text-xs font-semibold text-[#231942]">
                  {references.length} مرجع في النظام
                </p>
                <p className="text-xs text-[#6B628A] leading-5">
                  يقوم مدير المكتب بتوزيع الملفات على الوكلاء المختصين للمعالجة.
                </p>
                <p className="text-xs text-violet-500 font-medium mt-2">
                  إجمالي الملفات: {references.reduce((sum, r) => sum + r.files.length, 0)}
                </p>
              </div>
            ) : (
              <p className="text-xs text-[#8C84A8] leading-6">
                بعد رفع الملفات سيظهر هنا ملخص حالة معالجة المرجع وتوزيع الملفات على الوكلاء الذكيين.
              </p>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
