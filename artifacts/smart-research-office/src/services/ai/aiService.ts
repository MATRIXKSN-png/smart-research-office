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

const isOnline = (): boolean => {
  if (typeof navigator === 'undefined') return true;
  return navigator.onLine;
};

function localFallbackAnalysis(req: AIAnalysisRequest): AIAnalysisResult {
  const questionWords = req.question
    .replace(/[^\u0621-\u064A\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .slice(0, 12);

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

function getBackendBaseUrl(): string {
  return (import.meta.env.VITE_AI_BACKEND_URL as string | undefined)?.trim() || 'http://localhost:8787';
}

export async function analyzeQuestion(
  req: AIAnalysisRequest,
  settings: AISettings
): Promise<AIAnalysisResult> {
  const canUseAI =
    settings.aiEnabled &&
    settings.aiProvider !== 'gemini' &&
    settings.aiProvider !== 'claude' &&
    isOnline();

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
    let errorMsg = 'تعذر الوصول إلى خدمة الذكاء الاصطناعي، تم التحويل إلى المعالجة المحلية.';

    if (err?.message?.includes('401')) {
      errorMsg = 'فشل التوثيق مع خدمة الذكاء الاصطناعي — تم التحويل إلى الوضع المحلي.';
    } else if (err?.message?.includes('429')) {
      errorMsg = 'تم تجاوز حد الاستخدام — تم التحويل إلى الوضع المحلي.';
    } else if (err?.message?.toLowerCase?.().includes('timeout')) {
      errorMsg = 'انتهت مهلة الاتصال — تم التحويل إلى الوضع المحلي.';
    } else if (err?.message?.toLowerCase?.().includes('missing')) {
      errorMsg = 'مفاتيح الذكاء الاصطناعي غير مضبوطة في الخادم — تم التحويل إلى الوضع المحلي.';
    }

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

  if (!settings.aiEnabled) {
    return { success: false, message: 'الذكاء الاصطناعي معطل من الإعدادات.' };
  }

  if (settings.aiProvider === 'gemini' || settings.aiProvider === 'claude') {
    return { success: false, message: 'المزود غير مدعوم بعد.' };
  }

  try {
    const response = await fetch(`${getBackendBaseUrl()}/api/ai/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider: settings.aiProvider }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || !data) {
      throw new Error(`HTTP ${response.status}`);
    }

    return {
      success: Boolean(data.success),
      message: data.message || 'تم تنفيذ اختبار الاتصال.',
    };
  } catch (err: any) {
    return {
      success: false,
      message: `فشل الاتصال — ${err?.message ?? 'خطأ غير معروف'}. سيتم استخدام الوضع المحلي.`,
    };
  }
}
