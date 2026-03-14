import React, { useState, useEffect } from 'react';
import { Settings, Save, Palette, BrainCircuit, RotateCcw, Wifi, WifiOff, KeyRound, Zap, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { PageTitle } from '../components/PageTitle';
import { SectionCard } from '../components/SectionCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { ToggleSwitch } from '../components/ToggleSwitch';
import { defaultSettings, AppSettings } from '../data/mockData';
import {
  loadAISettings,
  saveAISettings,
  AISettings,
  defaultAISettings,
} from '../services/storage/localStorageService';
import { testAIConnection } from '../services/ai/aiService';

export function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const raw = localStorage.getItem('smart-office-app-settings');
      if (raw) return { ...defaultSettings, ...JSON.parse(raw) };
    } catch {}
    return { ...defaultSettings };
  });
  const [saved, setSaved] = useState(false);

  const [aiSettings, setAISettings] = useState<AISettings>(() => loadAISettings());
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [testMessage, setTestMessage] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  const update = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const updateAI = <K extends keyof AISettings>(key: K, value: AISettings[K]) => {
    setAISettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    try {
      localStorage.setItem('smart-office-app-settings', JSON.stringify(settings));
    } catch {}
    saveAISettings(aiSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    setSettings({ ...defaultSettings });
    setAISettings({ ...defaultAISettings });
    setSaved(false);
  };

  const handleTestConnection = async () => {
    setTestStatus('testing');
    setTestMessage('');
    const result = await testAIConnection(aiSettings);
    setTestStatus(result.success ? 'success' : 'failed');
    setTestMessage(result.message);
  };

  return (
    <div style={{ direction: 'rtl' }}>
      <PageTitle
        title="الإعدادات"
        description="ضبط إعدادات الاستخراج والتحليل والتكامل الذكي حسب احتياجاتك البحثية"
        action={
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-muted hover:text-violet-600 transition-colors px-2 py-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            إعادة الضبط
          </button>
        }
      />

      <div className="space-y-5 max-w-2xl">
        <SectionCard title="إعدادات الاستخراج والبحث" description="التحكم في كيفية استخراج النصوص من الملفات">
          <div className="space-y-5">
            <ToggleSwitch
              enabled={settings.ocrEnabled}
              onChange={(v) => update('ocrEnabled', v)}
              label="تقنية OCR لمعالجة الصور"
              description="استخراج النصوص من الصور وملفات المسح الضوئي"
            />
            <ToggleSwitch
              enabled={settings.strictMode}
              onChange={(v) => update('strictMode', v)}
              label="الوضع الصارم للنص الأصلي"
              description="عرض النص الأصلي كما هو دون أي تعديل أو إعادة صياغة"
            />
            <div className="flex items-center justify-between pt-1 border-t border-border-light">
              <div>
                <p className="text-sm font-medium text-main">عدد النتائج الافتراضي في البحث</p>
                <p className="text-xs text-muted mt-0.5">عدد الفقرات المعروضة عند التحليل</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => update('defaultResultsCount', Math.max(1, settings.defaultResultsCount - 1))}
                  className="w-8 h-8 rounded-lg bg-violet-50 border border-violet-200 text-violet-600 font-bold text-base hover:bg-violet-100 transition-colors dark-chip"
                >−</button>
                <span className="w-8 text-center text-sm font-bold text-main">{settings.defaultResultsCount}</span>
                <button
                  onClick={() => update('defaultResultsCount', Math.min(20, settings.defaultResultsCount + 1))}
                  className="w-8 h-8 rounded-lg bg-violet-50 border border-violet-200 text-violet-600 font-bold text-base hover:bg-violet-100 transition-colors dark-chip"
                >+</button>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="إعدادات التكامل الذكي" description="ربط التطبيق بخدمة ذكاء اصطناعي خارجية لتحسين التحليل">
          <div className="space-y-5">
            <ToggleSwitch
              enabled={aiSettings.aiEnabled}
              onChange={(v) => updateAI('aiEnabled', v)}
              label="تفعيل الذكاء الاصطناعي المتصل"
              description="استخدام خدمة AI خارجية لتحسين تحليل الأسئلة البحثية"
            />

            {aiSettings.aiEnabled && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-main mb-1.5">المزود</label>
                  <select
                    value={aiSettings.aiProvider}
                    onChange={(e) => updateAI('aiProvider', e.target.value as AISettings['aiProvider'])}
                    className="dark-input w-full rounded-xl border border-violet-200 bg-surface px-3 py-2.5 text-sm text-main focus:outline-none focus:ring-2 focus:ring-violet-300"
                    style={{ direction: 'rtl' }}
                  >
                    <option value="openai">OpenAI (GPT-4o mini)</option>
                    <option value="openrouter">OpenRouter (Mistral)</option>
                    <option value="gemini">Gemini (قريبًا)</option>
                    <option value="claude">Claude (قريبًا)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-main mb-1.5">
                    <KeyRound className="w-3.5 h-3.5 inline ml-1 text-violet-500" />
                    مفتاح API
                  </label>
                  <div className="relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={aiSettings.apiKey}
                      onChange={(e) => updateAI('apiKey', e.target.value)}
                      placeholder="sk-..."
                      className="dark-input w-full rounded-xl border border-violet-200 bg-surface px-4 py-2.5 text-sm text-main placeholder-muted focus:outline-none focus:ring-2 focus:ring-violet-300 transition-all pr-16"
                      style={{ direction: 'ltr' }}
                    />
                    <button
                      onClick={() => setShowApiKey((p) => !p)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-violet-600 transition-colors"
                    >
                      {showApiKey ? 'إخفاء' : 'إظهار'}
                    </button>
                  </div>
                  <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1">
                    <span>⚠</span>
                    المفتاح يُحفظ محليًا في متصفحك فقط ولا يُرسل لأي خادم خارجي سوى المزود المختار.
                  </p>
                </div>

                <ToggleSwitch
                  enabled={aiSettings.fallbackToLocal}
                  onChange={(v) => updateAI('fallbackToLocal', v)}
                  label="العودة التلقائية للوضع المحلي عند الفشل"
                  description="إذا فشل الاتصال يستمر التطبيق بالمعالجة المحلية"
                />

                <div className="space-y-3">
                  <button
                    onClick={handleTestConnection}
                    disabled={testStatus === 'testing'}
                    className="flex items-center gap-2 px-4 py-2.5 bg-violet-50 border border-violet-200 rounded-xl text-sm font-medium text-violet-700 hover:bg-violet-100 transition-colors disabled:opacity-60 dark-chip"
                  >
                    {testStatus === 'testing' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Zap className="w-4 h-4" />
                    )}
                    {testStatus === 'testing' ? 'جارٍ الاختبار...' : 'اختبار الاتصال'}
                  </button>

                  {testStatus === 'success' && (
                    <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <p className="text-xs text-emerald-700 font-medium">{testMessage}</p>
                    </div>
                  )}
                  {testStatus === 'failed' && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl border border-red-200">
                      <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <p className="text-xs text-red-700 font-medium">{testMessage}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 p-2 rounded-lg">
                    {navigator.onLine ? (
                      <>
                        <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-xs text-emerald-600 font-medium">الشبكة متوفرة</span>
                      </>
                    ) : (
                      <>
                        <WifiOff className="w-3.5 h-3.5 text-red-400" />
                        <span className="text-xs text-red-500 font-medium">لا يوجد اتصال بالإنترنت</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100">
                  <div className="flex items-start gap-2">
                    <BrainCircuit className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700 leading-5">
                      دور الذكاء الاصطناعي <strong>تحليلي فقط</strong> — يفهم السؤال ويحدد الفقرات المناسبة. لا يعيد كتابة أو اختصار أو تعديل النص الأصلي بأي شكل. النص الأصلي محمي دائمًا.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </SectionCard>

        <SectionCard title="إعدادات عرض التعقيبات والاستنتاجات" description="التحكم في عناصر العرض المصاحبة للنصوص">
          <div className="space-y-5">
            <ToggleSwitch
              enabled={settings.paragraphComments}
              onChange={(v) => update('paragraphComments', v)}
              label="التعقيب بين الفقرات المتشابهة"
              description="إظهار تعقيب مختصر عند تقارب فقرتين أو أكثر في المعنى"
            />
            <ToggleSwitch
              enabled={settings.generalComments}
              onChange={(v) => update('generalComments', v)}
              label="التعقيب الكلي عن الفقرات المتشابهة"
              description="تعقيب شامل في نهاية مجموعة الفقرات المتشابهة"
            />
            <ToggleSwitch
              enabled={settings.finalConclusions}
              onChange={(v) => update('finalConclusions', v)}
              label="الاستنتاجات في آخر الفصل"
              description="إضافة خلاصة استنتاجية في نهاية كل فصل أو قسم"
            />
            <ToggleSwitch
              enabled={settings.alwaysShowReference}
              onChange={(v) => update('alwaysShowReference', v)}
              label="إظهار المرجع ورقم الصفحة دائمًا"
              description="عرض اسم المرجع ورقم الصفحة أسفل كل فقرة مستخرجة"
            />
          </div>
        </SectionCard>

        <SectionCard title="الثيمات والمظهر">
          <div className="flex items-center gap-4 p-4 bg-soft rounded-xl border border-border-light">
            <div className="w-12 h-12 rounded-xl primary-gradient flex items-center justify-center flex-shrink-0">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-main">الثيم البنفسجي الاحترافي</p>
              <p className="text-xs text-muted mt-0.5">ألوان بنفسجية هادئة — خط Cairo — RTL كامل — يدعم الوضع الداكن</p>
              <div className="flex gap-2 mt-2">
                {['#2E1065', '#6D28D9', '#8B5CF6', '#DDD6FE', '#F6F3FF'].map((c) => (
                  <span key={c} className="w-5 h-5 rounded-full border-2 border-white shadow" style={{ backgroundColor: c }} title={c} />
                ))}
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="معلومات التطبيق">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs py-1.5">
              <span className="text-muted">اسم التطبيق</span>
              <span className="font-semibold text-main">المكتب الذكي للبحث العلمي</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1.5 border-t border-border-light">
              <span className="text-muted">الإصدار</span>
              <span className="font-semibold text-main">2.0.0</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1.5 border-t border-border-light">
              <span className="text-muted">حقوق التصميم والبرمجة</span>
              <span className="font-bold text-violet-600">matrixksn</span>
            </div>
          </div>
        </SectionCard>

        <div className="flex gap-3 pt-2">
          <PrimaryButton onClick={handleSave} size="lg" icon={<Save className="w-5 h-5" />}>
            {saved ? '✓ تم الحفظ بنجاح' : 'حفظ الإعدادات'}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
