import React, { useState } from 'react';
import { Link2, Files, Image, FileType, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { PageTitle } from '../components/PageTitle';
import { SectionCard } from '../components/SectionCard';
import { StatCard } from '../components/StatCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { UploadDropzone } from '../components/UploadDropzone';
import { EmptyState } from '../components/EmptyState';
import { StatusBadge } from '../components/StatusBadge';

interface UploadedFile {
  id: string;
  name: string;
  type: 'pdf' | 'image';
  size: string;
}

const agentPipeline = [
  { label: 'مدير المكتب', short: 'مدير' },
  { label: 'استخراج', short: 'استخراج' },
  { label: 'OCR', short: 'OCR' },
  { label: 'تحليل', short: 'تحليل' },
  { label: 'بحث', short: 'بحث' },
  { label: 'تنظيم', short: 'تنظيم' },
];

export function UploadPage() {
  const [bookName, setBookName] = useState('');
  const [author, setAuthor] = useState('');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [linked, setLinked] = useState(false);

  const pdfCount = files.filter((f) => f.type === 'pdf').length;
  const imageCount = files.filter((f) => f.type === 'image').length;

  const handleLink = () => {
    if (!bookName.trim() || files.length === 0) return;
    setLinked(true);
  };

  const handleReset = () => {
    setBookName('');
    setAuthor('');
    setFiles([]);
    setLinked(false);
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
        <div className="flex items-center gap-0 flex-wrap">
          {agentPipeline.map((step, i) => (
            <React.Fragment key={step.label}>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${i === 0 ? 'primary-gradient text-white' : 'bg-violet-50 text-violet-600 border border-violet-100'}`}>
                {step.short}
              </div>
              {i < agentPipeline.length - 1 && (
                <ArrowLeft className="w-3.5 h-3.5 text-violet-300 mx-0.5" />
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
                <label className="block text-xs font-semibold text-[#231942] mb-1.5">اسم الكتاب / المرجع *</label>
                <input
                  type="text"
                  value={bookName}
                  onChange={(e) => setBookName(e.target.value)}
                  placeholder="مثال: مناهج البحث العلمي وطرق التوثيق"
                  className="w-full rounded-xl border border-violet-200 bg-violet-50/30 px-4 py-2.5 text-sm text-[#231942] placeholder-[#8C84A8] focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 transition-all"
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
                  className="w-full rounded-xl border border-violet-200 bg-violet-50/30 px-4 py-2.5 text-sm text-[#231942] placeholder-[#8C84A8] focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 transition-all"
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

          <SectionCard title="الملفات المختارة">
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
            <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <p className="text-sm font-medium text-emerald-700">
                تم ربط {files.length} ملف بمرجع «{bookName}» بنجاح. تم توزيع المهام على الوكلاء.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <StatCard
              label="إجمالي الملفات"
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
            {linked ? (
              <div className="space-y-3">
                <p className="text-xs text-[#231942] font-semibold">المرجع: {bookName}</p>
                {author && <p className="text-xs text-[#6B628A]">المؤلف: {author}</p>}
                <p className="text-xs text-[#6B628A] leading-5">
                  تم ربط الملفات بالمرجع بنجاح. يقوم مدير المكتب بتوزيع الملفات على الوكلاء المختصين للمعالجة.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {files.map((f) => (
                    <span key={f.id} className="text-[10px] bg-violet-100 text-violet-700 px-2 py-1 rounded-lg">
                      {f.name.length > 15 ? f.name.slice(0, 15) + '...' : f.name}
                    </span>
                  ))}
                </div>
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
