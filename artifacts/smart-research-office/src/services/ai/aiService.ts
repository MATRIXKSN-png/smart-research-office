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

const SYSTEM_PROMPT_GUARD = `
أنت مساعد بحثي دقيق. قواعد صارمة يجب الالتزام بها:
1. لا تُعيد كتابة النصوص الأصلية أو تعيد صياغتها أو تختصرها بأي شكل.
2. دورك تحليلي فقط: تحديد الفقرات ذات الصلة، وكتابة تعقيب منفصل.
3. التعقيب يجب أن يكون منفصلًا بوضوح عن النص الأصلي.
4. لا تقترح تعديلات على النص الأصلي.
5. اكتب إجاباتك باللغة العربية الفصحى.
`.trim();

const isOnline = (): boolean => {
  if (typeof navigator === 'undefined') return true;
  return navigator.onLine;
};

const createAbortSignal = (timeoutMs: number): AbortSignal | undefined => {
  if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') {
    return AbortSignal.timeout(timeoutMs);
  }
  return undefined;
};

async function callOpenAI(apiKey: string, prompt: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    signal: createAbortSignal(15000),
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT_GUARD },
        { role: 'user', content: prompt },
      ],
      max_tokens: 1200,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? `HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? '';
}

async function callOpenRouter(apiKey: string, prompt: string): Promise<string> {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    signal: createAbortSignal(15000),
    body: JSON.stringify({
      model: 'mistralai/mistral-7b-instruct',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT_GUARD },
        { role: 'user', content: prompt },
      ],
      max_tokens: 1200,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? `HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? '';
}

function buildPrompt(req: AIAnalysisRequest): string {
  const textsSection = req.extractedTexts
    .slice(0, 5)
    .map((t, i) => `[نص ${i + 1} — ${t.referenceName} — ص${t.pageNumber}]:\n${t.text.slice(0, 400)}`)
    .join('\n\n');

  return `السؤال البحثي: ${req.question}

النصوص المستخرجة من المراجع:
${textsSection}

المطلوب:
1. اذكر أي النصوص أكثر صلة بالسؤال وسبب ذلك (بدون إعادة كتابة النص).
${req.paragraphComments ? '2. أضف تعقيبًا قصيرًا لكل نص ذي صلة.' : ''}
${req.generalComments ? '3. أضف تعقيبًا كليًا شاملًا.' : ''}
${req.finalConclusions ? '4. اكتب استنتاجًا نهائيًا مختصرًا.' : ''}

تذكير: لا تُعيد صياغة النصوص الأصلية أبدًا.`;
}

function localFallbackAnalysis(req: AIAnalysisRequest): AIAnalysisResult {
  const questionWords = req.question
    .replace(/[^\u0621-\u064A\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .slice(0, 6);

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
    settings.apiKey.trim().length > 10 &&
    isOnline();

  if (!canUseAI) {
    return localFallbackAnalysis(req);
  }

  try {
    const prompt = buildPrompt(req);
    let text = '';
    let providerName = '';

    if (settings.aiProvider === 'openai') {
      text = await callOpenAI(settings.apiKey, prompt);
      providerName = 'OpenAI GPT-4o mini';
    } else if (settings.aiProvider === 'openrouter') {
      text = await callOpenRouter(settings.apiKey, prompt);
      providerName = 'OpenRouter (Mistral)';
    } else {
      return {
        ...localFallbackAnalysis(req),
        error: 'هذا المزود غير مدعوم حاليًا — تم التحويل للوضع المحلي',
      };
    }

    return {
      mode: 'ai',
      providerName,
      analysisText: text,
      keywords: [],
    };
  } catch (err: any) {
    let errorMsg = 'تعذر الوصول إلى خدمة الذكاء الاصطناعي، تم التحويل إلى المعالجة المحلية.';

    if (err?.message?.includes('401')) {
      errorMsg = 'مفتاح API غير صالح — تم التحويل إلى الوضع المحلي.';
    } else if (err?.message?.includes('429')) {
      errorMsg = 'تم تجاوز حد الاستخدام — تم التحويل إلى الوضع المحلي.';
    } else if (
      err?.message?.toLowerCase?.().includes('timeout') ||
      err?.name === 'TimeoutError'
    ) {
      errorMsg = 'انتهت مهلة الاتصال — تم التحويل إلى الوضع المحلي.';
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

  if (!settings.apiKey.trim()) {
    return { success: false, message: 'يرجى إدخال مفتاح API أولًا.' };
  }

  try {
    if (settings.aiProvider === 'openai') {
      await callOpenAI(settings.apiKey, 'قل "متصل" فقط.');
    } else if (settings.aiProvider === 'openrouter') {
      await callOpenRouter(settings.apiKey, 'قل "متصل" فقط.');
    } else {
      return { success: false, message: 'المزود غير مدعوم بعد.' };
    }

    return {
      success: true,
      message: `تم الاتصال بنجاح بخدمة الذكاء الاصطناعي (${settings.aiProvider}).`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `فشل الاتصال — ${err?.message ?? 'خطأ غير معروف'}. سيتم استخدام الوضع المحلي.`,
    };
  }
}

