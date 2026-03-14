import React, { useState } from 'react';
import { Search, AlertCircle, Cpu, Zap } from 'lucide-react';
import { PageTitle } from '../components/PageTitle';
import { SectionCard } from '../components/SectionCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { ToggleSwitch } from '../components/ToggleSwitch';
import { EmptyState } from '../components/EmptyState';
import { ResultCard } from '../components/ResultCard';
import { useReferences } from '../context/ReferencesContext';
import { SearchResult } from '../data/mockData';
import { loadAISettings } from '../services/storage/localStorageService';
import { analyzeQuestion, AIAnalysisResult } from '../services/ai/aiService';

function buildSearchResults(references: ReturnType<typeof useReferences>['references']): SearchResult[] {
  const results: SearchResult[] = [];
  references.forEach((ref) => {
    ref.files.forEach((file, idx) => {
      if (file.status === 'extracted' && file.extractedText) {
        results.push({
          id: `${ref.id}-${file.id}`,
          topic: `${ref.name} — الصفحة ${file.pageNumber}`,
          originalText: file.extractedText,
          referenceName: ref.name,
          pageNumber: file.pageNumber,
          relevanceScore: Math.max(55, 95 - idx * 7),
          analysis: '',
        });
      }
    });
  });
  return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

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
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [analyzedQuestion, setAnalyzedQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const hasReferences = references.length > 0;
  const extractedFiles = references.flatMap((r) => r.files.filter((f) => f.status === 'extracted'));
  const hasExtracted = extractedFiles.length > 0;

  const handleAnalyze = async () => {
    if (!question.trim() || !hasReferences) return;
    setLoading(true);
    setAnalyzedQuestion(question);
    setAiResult(null);

    const allResults = buildSearchResults(references);
    const filteredResults = allResults.slice(0, 8);

    setResults(filteredResults);

    if (llmEnabled) {
      const aiSettings = loadAISettings();
      const aiRequest = {
        question,
        extractedTexts: extractedFiles.map((f) => {
          const ref = references.find((r) => r.files.some((rf) => rf.id === f.id));
          return {
            referenceId: ref?.id ?? '',
            referenceName: ref?.name ?? '',
            pageNumber: f.pageNumber,
            text: f.extractedText,
          };
        }),
        paragraphComments,
        generalComments,
        finalConclusions,
      };

      const aiResponse = await analyzeQuestion(aiRequest, { ...aiSettings, aiEnabled: true });
      setAiResult(aiResponse);
    }

    setLoading(false);
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
                className="dark-input w-full rounded-xl border border-violet-200 bg-soft px-4 py-3 text-sm text-main placeholder-muted focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none"
                style={{ direction: 'rtl' }}
              />
              <div>
                <label className="block text-xs font-semibold text-main mb-1.5">نطاق البحث</label>
                <select
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  className="dark-input w-full rounded-xl border border-violet-200 bg-surface px-3 py-2.5 text-sm text-main focus:outline-none focus:ring-2 focus:ring-violet-300"
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
              description="يستخدم AI لتحليل السؤال وكتابة تعقيب منفصل"
            />
          </SectionCard>

          <SectionCard title="إعدادات البحث">
            <div className="space-y-3">
              <ToggleSwitch enabled={strictMode} onChange={setStrictMode} label="الوضع الصارم" />
              <ToggleSwitch enabled={ocrEnabled} onChange={setOcrEnabled} label="OCR" />
              <ToggleSwitch enabled={paragraphComments} onChange={setParagraphComments} label="التعقيب الخاص بكل فقرة" />
              <ToggleSwitch enabled={generalComments} onChange={setGeneralComments} label="التعقيب الكلي" />
              <ToggleSwitch enabled={finalConclusions} onChange={setFinalConclusions} label="الاستنتاجات النهائية" />
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

          {hasReferences && !hasExtracted && (
            <p className="text-xs text-amber-600 text-center bg-amber-50/60 rounded-xl px-3 py-2 border border-amber-100">
              انتظر اكتمال معالجة الملفات أولًا
            </p>
          )}

          {!hasReferences && (
            <p className="text-xs text-muted text-center bg-soft rounded-xl px-3 py-2 border border-border-light">
              ارفع مراجع أولًا لتفعيل التحليل
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
              description="قم برفع ملفاتك أولًا من صفحة ربط الملفات بمرجع"
              icon="inbox"
            />
          ) : results === null && !loading ? (
            <EmptyState
              title="مساحة النتائج"
              description="أدخل سؤالك البحثي واضغط تحليل لعرض الفقرات الأكثر صلة"
              icon="search"
            />
          ) : loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 rounded-2xl primary-gradient flex items-center justify-center mb-4 animate-pulse">
                <Search className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-semibold text-main">يجري البحث داخل النصوص الأصلية...</p>
              {llmEnabled && (
                <p className="text-xs text-muted mt-1 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-violet-400" />
                  والتحليل الذكي جارٍ في الخلفية...
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="bg-surface rounded-2xl border border-border-light card-shadow p-4">
                <p className="text-xs font-bold text-violet-500 uppercase tracking-wide mb-2">السؤال المُحلَّل</p>
                <p className="text-sm font-semibold text-main leading-6">{analyzedQuestion}</p>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <span className="text-xs text-muted bg-soft px-2.5 py-1 rounded-lg border border-border-light">
                    {results?.length ?? 0} نتيجة — مرتبة حسب الصلة
                  </span>
                  {aiResult && (
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
                      aiResult.mode === 'ai'
                        ? 'bg-violet-50 border-violet-200 text-violet-700'
                        : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}>
                      {aiResult.mode === 'ai' ? (
                        <><Zap className="w-3 h-3" /> تم تحسين التحليل عبر {aiResult.providerName}</>
                      ) : (
                        <><Cpu className="w-3 h-3" /> تم التحليل محليًا</>
                      )}
                    </span>
                  )}
                </div>
                {aiResult?.error && (
                  <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {aiResult.error}
                  </p>
                )}
              </div>

              {aiResult && aiResult.analysisText && (
                <SectionCard title={aiResult.mode === 'ai' ? 'التحليل الذكي — منفصل عن النص الأصلي' : 'التحليل المحلي'}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-4 rounded-full bg-violet-500" />
                    <span className="text-xs font-semibold text-violet-600">
                      {aiResult.mode === 'ai' ? 'تحليل AI — لا يُعدّل النص الأصلي' : 'تحليل محلي'}
                    </span>
                  </div>
                  <p className="text-sm text-main leading-7 whitespace-pre-wrap">{aiResult.analysisText}</p>
                  {aiResult.conclusions && (
                    <div className="mt-4 pt-4 border-t border-border-light">
                      <p className="text-xs font-bold text-violet-600 mb-2">الاستنتاج</p>
                      <p className="text-sm text-main leading-7">{aiResult.conclusions}</p>
                    </div>
                  )}
                </SectionCard>
              )}

              {results && results.length > 0 ? (
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <ResultCard key={result.id} result={result} rank={index + 1} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="لا توجد نصوص مستخرجة بعد"
                  description="انتظر اكتمال معالجة الملفات لعرض نتائج البحث"
                  icon="search"
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
