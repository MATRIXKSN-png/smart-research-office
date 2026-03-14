import React, { useState } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import { PageTitle } from '../components/PageTitle';
import { SectionCard } from '../components/SectionCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { ToggleSwitch } from '../components/ToggleSwitch';
import { EmptyState } from '../components/EmptyState';
import { ResultCard } from '../components/ResultCard';
import { useReferences } from '../context/ReferencesContext';
import { mockSearchResults, SearchResult } from '../data/mockData';

export function AnalysisPage() {
  const { references } = useReferences();

  const [question, setQuestion] = useState('');
  const [scope, setScope] = useState('all');
  const [llmEnabled, setLlmEnabled] = useState(false);
  const [strictMode, setStrictMode] = useState(true);
  const [ocrEnabled, setOcrEnabled] = useState(true);
  const [paragraphComments, setParagraphComments] = useState(true);
  const [generalComments, setGeneralComments] = useState(true);
  const [finalConclusions, setFinalConclusions] = useState(true);
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [analyzedQuestion, setAnalyzedQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const hasReferences = references.length > 0;

  const handleAnalyze = () => {
    if (!question.trim() || !hasReferences) return;
    setLoading(true);
    setAnalyzedQuestion(question);
    setTimeout(() => {
      const simulatedResults: SearchResult[] = references.flatMap((ref) =>
        ref.files
          .filter((f) => f.extractedText)
          .map((f, i) => ({
            id: `${ref.id}-${f.id}`,
            topic: `نتيجة من: ${ref.name}`,
            originalText: f.extractedText,
            referenceName: ref.name,
            pageNumber: f.pageNumber,
            relevanceScore: Math.max(60, 95 - i * 8),
            analysis: `هذه الفقرة مستخرجة من المرجع «${ref.name}» وقد تم تحديدها كذات صلة بالسؤال المطروح بواسطة موظف البحث.`,
          }))
      );

      const finalResults = simulatedResults.length > 0 ? simulatedResults : mockSearchResults.slice(0, 2);
      setResults(finalResults.sort((a, b) => b.relevanceScore - a.relevanceScore));
      setLoading(false);
    }, 900);
  };

  return (
    <div style={{ direction: 'rtl' }}>
      <PageTitle
        title="تحليل السؤال"
        description="اكتب سؤالك البحثي ليقوم المكتب الذكي بالبحث داخل النصوص الأصلية وعرض الفقرات الأكثر صلة"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="lg:col-span-1 space-y-4">
          <SectionCard title="سؤالك البحثي">
            <div className="space-y-3">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="اكتب سؤالك البحثي هنا..."
                rows={5}
                className="w-full rounded-xl border border-violet-200 bg-violet-50/30 px-4 py-3 text-sm text-[#231942] placeholder-[#8C84A8] focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none"
                style={{ direction: 'rtl' }}
              />
              <div>
                <label className="block text-xs font-semibold text-[#231942] mb-1.5">نطاق البحث</label>
                <select
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  className="w-full rounded-xl border border-violet-200 bg-white px-3 py-2.5 text-sm text-[#231942] focus:outline-none focus:ring-2 focus:ring-violet-300"
                  style={{ direction: 'rtl' }}
                >
                  <option value="all">جميع المراجع</option>
                  <option value="specific">مرجع محدد</option>
                  <option value="pages">صفحات محددة</option>
                </select>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="تحليل ذكي (LLM)">
            <ToggleSwitch
              enabled={llmEnabled}
              onChange={setLlmEnabled}
              label="تفعيل التحليل الذكي"
              description="تحليل دور الذكاء الاصطناعي — لا يعيد كتابة النص"
            />
          </SectionCard>

          <SectionCard title="إعدادات المطابقة">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#231942] font-medium">عدد النتائج الافتراضي</span>
                <span className="text-xs font-bold text-violet-600 bg-violet-50 px-2.5 py-1 rounded-lg border border-violet-100">5</span>
              </div>
              <div className="space-y-3">
                <ToggleSwitch enabled={strictMode} onChange={setStrictMode} label="الوضع الصارم للنص الأصلي" />
                <ToggleSwitch enabled={ocrEnabled} onChange={setOcrEnabled} label="OCR" />
                <ToggleSwitch enabled={paragraphComments} onChange={setParagraphComments} label="التعقيب الخاص بكل فقرة" />
                <ToggleSwitch enabled={generalComments} onChange={setGeneralComments} label="التعقيب الكلي" />
                <ToggleSwitch enabled={finalConclusions} onChange={setFinalConclusions} label="الاستنتاجات النهائية" />
              </div>
            </div>
          </SectionCard>

          <PrimaryButton
            onClick={handleAnalyze}
            disabled={!question.trim() || !hasReferences || loading}
            fullWidth
            size="lg"
            icon={<Search className="w-5 h-5" />}
          >
            {loading ? 'جارٍ التحليل...' : 'ابدأ تحليل السؤال'}
          </PrimaryButton>

          {!hasReferences && (
            <p className="text-xs text-[#8C84A8] text-center bg-violet-50 rounded-xl px-3 py-2 border border-violet-100">
              ارفع مراجع أولاً لتفعيل التحليل
            </p>
          )}
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center gap-2 px-4 py-3 bg-amber-50/80 rounded-xl border border-amber-100">
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <p className="text-xs font-medium text-amber-700">
              لا يتم تعديل النص الأصلي، ويعرض كما ورد في المصدر
            </p>
          </div>

          {!hasReferences ? (
            <EmptyState
              title="لا توجد مراجع مرفوعة"
              description="قم برفع ملفاتك أولاً من صفحة ربط الملفات بمرجع، ثم ابدأ تحليل أسئلتك البحثية"
              icon="inbox"
            />
          ) : results === null && !loading ? (
            <EmptyState
              title="مساحة النتائج"
              description="أدخل سؤالك البحثي واضغط على زر التحليل لعرض الفقرات الأكثر صلة من مراجعك المرفوعة"
              icon="search"
            />
          ) : loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 rounded-2xl primary-gradient flex items-center justify-center mb-4 animate-pulse">
                <Search className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-semibold text-[#231942]">يجري البحث داخل النصوص الأصلية...</p>
              <p className="text-xs text-[#8C84A8] mt-1">موظف البحث يبحث في {references.length} مرجع</p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-2xl border border-violet-100 card-shadow p-4">
                <p className="text-xs font-bold text-violet-500 uppercase tracking-wide mb-2">السؤال المُحلَّل</p>
                <p className="text-sm font-semibold text-[#231942] leading-6">{analyzedQuestion}</p>
                <div className="flex items-center gap-3 mt-3 flex-wrap">
                  <span className="text-xs text-[#8C84A8] bg-violet-50 px-2.5 py-1 rounded-lg border border-violet-100">
                    النطاق: {scope === 'all' ? 'جميع المراجع' : scope === 'specific' ? 'مرجع محدد' : 'صفحات محددة'}
                  </span>
                  <span className="text-xs text-[#8C84A8] bg-violet-50 px-2.5 py-1 rounded-lg border border-violet-100">
                    {results?.length ?? 0} نتيجة — مرتبة حسب الصلة
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {results?.map((result, index) => (
                  <ResultCard key={result.id} result={result} rank={index + 1} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
