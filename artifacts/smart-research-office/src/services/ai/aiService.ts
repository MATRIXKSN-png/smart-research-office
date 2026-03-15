// artifacts/smart-research-office/src/services/ai/aiService.ts

import { AISettings } from '../storage/localStorageService';

export interface AIAnalysisRequest {
  question: string;
  extractedTexts: { referenceId: string; referenceName: string; pageNumber: number; text: string }[];
  paragraphComments: boolean;
  generalComments: boolean;
  finalConclusions: boolean;
}

export interface AIAnalysisResult {
  mode: 'ai' | 'local';
  providerName?: string;
  analysisText: string;
  keywords: string[];
  conclusions?: string;
  error?: string;
}

function getBackendBaseUrl(): string {
  return (import.meta.env.VITE_AI_BACKEND_URL as string | undefined)?.trim() || 'http://localhost:8787';
}

const isOnline = (): boolean => {
  if (typeof navigator === 'undefined') return true;
  return navigator.onLine;
};

function localFallbackAnalysis(req: AIAnalysisRequest): AIAnalysisResult {
  const questionWords = req.question
    .replace(/[^\u0621-\u064A\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .slice(0, 10);

  const analysisText = `تم تحليل السؤال محليًا: «${req.question}»

الكلمات المفتاحية المستخرجة: ${questionWords.join(' — ') || 'لا توجد كلمات مفتاحية كافية'}

تم البحث في ${req.extractedTexts.length} نص من المراجع المرفوعة. موظف البحث يعمل على مطابقة النصوص الأصلية مع السؤال المطروح دون أي تعديل عليها.`;

  const conclusions = req.finalConclusions
    ? 'الاستنتاج: بناءً على النصوص الأصلية المرفوعة، تم تحديد الفقرات الأكثر صلة بالسؤال البحثي وترتيبها حسب درجة الملاءمة.'
    : undefined;

  return {
    mode: 'local',
    analysisText,
    keywords: questionWords,
    conclusions,
  };
}

export async function analyzeQuestion(
  req: AIAnalysisRequest,
  settings: AISettings
): Promise<AIAnalysisResult> {
  const canUseAI =
    settings.aiEnabled &&
    isOnline() &&
    ['openai', 'openrouter'].includes(settings.aiProvider);

  if (!canUseAI) {
    return localFallbackAnalysis(req);
  }

  try {
    const response = await fetch(`${getBackendBaseUrl()}/api/ai/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: settings.aiProvider,
        payload: req,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.success) {
      throw new Error(data?.error || `HTTP ${response.status}`);
    }

    return data.result as AIAnalysisResult;
  } catch (err: any) {
    const errorMsg =
      err?.message || 'تعذر الوصول إلى خدمة الذكاء الاصطناعي، تم التحويل إلى المعالجة المحلية.';

    if (settings.fallbackToLocal) {
      return { ...localFallbackAnalysis(req), error: errorMsg };
    }

    return {
      mode: 'local',
      analysisText: '',
      keywords: [],
      error: errorMsg,
    };
  }
}

export async function testAIConnection(
  settings: AISettings
): Promise<{ success: boolean; message: string }> {
  if (!isOnline()) {
    return { success: false, message: 'لا يوجد اتصال بالإنترنت.' };
  }

  try {
    const response = await fetch(`${getBackendBaseUrl()}/api/ai/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: settings.aiProvider,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        message: data?.message || data?.error || 'فشل الاتصال بالخادم.',
      };
    }

    return {
      success: Boolean(data?.success),
      message: data?.message || 'تم الاتصال بنجاح.',
    };
  } catch (err: any) {
    return {
      success: false,
      message: `فشل الاتصال — ${err?.message || 'خطأ غير معروف'}. سيتم استخدام الوضع المحلي.`,
    };
  }
}
