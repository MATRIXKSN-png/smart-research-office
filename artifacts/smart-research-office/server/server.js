const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const PORT = Number(process.env.AI_SERVER_PORT || 8787);

app.use(cors());
app.use(express.json({ limit: '25mb' }));

const SYSTEM_PROMPT_GUARD = `
أنت مساعد بحثي دقيق. قواعد صارمة يجب الالتزام بها:
1. لا تُعيد كتابة النصوص الأصلية أو تعيد صياغتها أو تختصرها بأي شكل.
2. دورك تحليلي فقط: تحديد الفقرات ذات الصلة، وكتابة تعقيب منفصل.
3. التعقيب يجب أن يكون منفصلًا بوضوح عن النص الأصلي.
4. لا تقترح تعديلات على النص الأصلي.
5. اكتب إجاباتك باللغة العربية الفصحى.
`.trim();

function buildPrompt(req) {
  const textsSection = (req.extractedTexts || [])
    .slice(0, 5)
    .map(
      (t, i) =>
        `[نص ${i + 1} — ${t.referenceName} — ص${t.pageNumber}]:\n${t.text || ''}`
    )
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

async function callOpenAI(prompt) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is missing');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
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
    throw new Error(err?.error?.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || '';
}

async function callOpenRouter(prompt) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is missing');
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL || 'mistralai/mistral-7b-instruct',
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
    throw new Error(err?.error?.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || '';
}

async function extractPdfText(fileBuffer) {
  const data = await pdfParse(fileBuffer);
  return (data.text || '').trim();
}

async function extractImageText(fileBuffer) {
  const result = await Tesseract.recognize(fileBuffer, 'ara+eng', {
    logger: () => {},
  });
  return (result?.data?.text || '').trim();
}

app.get('/api/ai/health', async (_req, res) => {
  res.json({ ok: true, service: 'smart-research-office-ai-server' });
});

app.post('/api/ai/test', async (req, res) => {
  try {
    const provider = req.body?.provider;

    if (provider === 'openai') {
      await callOpenAI('قل "متصل" فقط.');
      return res.json({ success: true, message: 'تم الاتصال بنجاح بخدمة OpenAI.' });
    }

    if (provider === 'openrouter') {
      await callOpenRouter('قل "متصل" فقط.');
      return res.json({ success: true, message: 'تم الاتصال بنجاح بخدمة OpenRouter.' });
    }

    return res.status(400).json({
      success: false,
      message: 'المزود غير مدعوم بعد.',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `فشل الاتصال — ${err?.message || 'خطأ غير معروف'}.`,
    });
  }
});

app.post('/api/ai/analyze', async (req, res) => {
  try {
    const provider = req.body?.provider;
    const payload = req.body?.payload;

    if (!payload || !payload.question) {
      return res.status(400).json({
        success: false,
        error: 'الطلب ناقص: السؤال البحثي مطلوب.',
      });
    }

    const prompt = buildPrompt(payload);

    let analysisText = '';
    let providerName = '';

    if (provider === 'openai') {
      analysisText = await callOpenAI(prompt);
      providerName = 'OpenAI GPT-4o mini';
    } else if (provider === 'openrouter') {
      analysisText = await callOpenRouter(prompt);
      providerName = 'OpenRouter (Mistral)';
    } else {
      return res.status(400).json({
        success: false,
        error: 'المزود غير مدعوم حاليًا.',
      });
    }

    return res.json({
      success: true,
      result: {
        mode: 'ai',
        providerName,
        analysisText,
        keywords: [],
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'AI server error',
    });
  }
});

app.post('/api/extraction/process', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const fileType = req.body?.fileType;
    const fileName = req.body?.fileName || 'ملف غير معروف';
    const referenceName = req.body?.referenceName || 'مرجع غير معروف';
    const referenceAuthor = req.body?.referenceAuthor || 'مؤلف غير معروف';
    const pageNumber = Number(req.body?.pageNumber || 1);

    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'لم يتم إرسال الملف.',
      });
    }

    let extractedText = '';
    let method = '';
    let agent = '';

    if (fileType === 'pdf') {
      extractedText = await extractPdfText(file.buffer);
      method = 'نص مباشر';
      agent = 'محرك استخراج PDF';
    } else if (fileType === 'image') {
      extractedText = await extractImageText(file.buffer);
      method = 'OCR';
      agent = 'محرك OCR';
    } else {
      return res.status(400).json({
        success: false,
        error: 'نوع الملف غير مدعوم.',
      });
    }

    const finalText = `--- نص مستخرج ${fileType === 'pdf' ? 'من ملف PDF' : 'بتقنية OCR'} ---
الملف: ${fileName}
المرجع: ${referenceName}
المؤلف: ${referenceAuthor}
الصفحة: ${pageNumber}
طريقة الاستخراج: ${method}

${extractedText || 'تعذر استخراج نص واضح من هذا الملف.'}

الحالة: مكتمل — تم استخراج المحتوى بواسطة ${agent}.
---`;

    return res.json({
      success: true,
      text: finalText,
      method,
      agent,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Extraction server error',
    });
  }
});

app.listen(PORT, () => {
  console.log(`AI server running on http://localhost:${PORT}`);
});
