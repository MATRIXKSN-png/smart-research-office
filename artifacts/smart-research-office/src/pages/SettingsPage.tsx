import React, { useState } from 'react';
import { Settings, Save, Palette, BrainCircuit, Eye, RotateCcw } from 'lucide-react';
import { PageTitle } from '../components/PageTitle';
import { SectionCard } from '../components/SectionCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { ToggleSwitch } from '../components/ToggleSwitch';
import { defaultSettings, AppSettings } from '../data/mockData';

export function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>({ ...defaultSettings });
  const [saved, setSaved] = useState(false);

  const update = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    setSettings({ ...defaultSettings });
    setSaved(false);
  };

  return (
    <div style={{ direction: 'rtl' }}>
      <PageTitle
        title="الإعدادات"
        description="ضبط إعدادات الاستخراج والتحليل والعرض حسب احتياجاتك البحثية"
        action={
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-[#8C84A8] hover:text-violet-600 transition-colors px-2 py-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            إعادة الضبط
          </button>
        }
      />

      <div className="space-y-5 max-w-2xl">
        <SectionCard
          title="إعدادات الاستخراج والبحث"
          description="التحكم في كيفية استخراج النصوص من الملفات"
        >
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
            <div className="flex items-center justify-between pt-1 border-t border-violet-50">
              <div>
                <p className="text-sm font-medium text-[#231942]">عدد النتائج الافتراضي في البحث</p>
                <p className="text-xs text-[#8C84A8] mt-0.5">عدد الفقرات المعروضة عند التحليل</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => update('defaultResultsCount', Math.max(1, settings.defaultResultsCount - 1))}
                  className="w-8 h-8 rounded-lg bg-violet-50 border border-violet-200 text-violet-600 font-bold text-base hover:bg-violet-100 transition-colors"
                >−</button>
                <span className="w-8 text-center text-sm font-bold text-[#231942]">{settings.defaultResultsCount}</span>
                <button
                  onClick={() => update('defaultResultsCount', Math.min(20, settings.defaultResultsCount + 1))}
                  className="w-8 h-8 rounded-lg bg-violet-50 border border-violet-200 text-violet-600 font-bold text-base hover:bg-violet-100 transition-colors"
                >+</button>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="إعدادات الذكاء الاصطناعي"
          description="التحكم في دور الذكاء الاصطناعي في التحليل"
        >
          <div className="space-y-4">
            <ToggleSwitch
              enabled={settings.llmEnabled}
              onChange={(v) => update('llmEnabled', v)}
              label="تفعيل التحليل الذكي (LLM)"
              description="تفعيل تحليل اللغة الطبيعية — لا يعيد كتابة أو تعديل النص الأصلي"
            />
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100">
              <div className="flex items-start gap-2">
                <BrainCircuit className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 leading-5">
                  دور الذكاء الاصطناعي <strong>تحليلي فقط</strong> — يفهم السؤال ويحدد الفقرات المناسبة، ولا يعيد كتابة أو اختصار أو تعديل النص الأصلي بأي شكل.
                </p>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="إعدادات عرض التعقيبات والاستنتاجات"
          description="التحكم في عناصر العرض المصاحبة للنصوص"
        >
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
          <div className="flex items-center gap-4 p-4 bg-violet-50/60 rounded-xl border border-violet-100">
            <div className="w-12 h-12 rounded-xl primary-gradient flex items-center justify-center flex-shrink-0">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#231942]">الثيم البنفسجي الاحترافي</p>
              <p className="text-xs text-[#6B628A] mt-0.5">ألوان بنفسجية هادئة — خط Cairo — RTL كامل</p>
              <div className="flex gap-2 mt-2">
                {['#2E1065', '#6D28D9', '#8B5CF6', '#DDD6FE', '#F6F3FF'].map((c) => (
                  <span
                    key={c}
                    className="w-5 h-5 rounded-full border-2 border-white shadow"
                    style={{ backgroundColor: c }}
                    title={c}
                  />
                ))}
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="معلومات التطبيق">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs py-1.5">
              <span className="text-[#8C84A8]">اسم التطبيق</span>
              <span className="font-semibold text-[#231942]">المكتب الذكي للبحث العلمي</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1.5 border-t border-violet-50">
              <span className="text-[#8C84A8]">الإصدار</span>
              <span className="font-semibold text-[#231942]">1.0.0</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1.5 border-t border-violet-50">
              <span className="text-[#8C84A8]">حقوق التصميم والبرمجة</span>
              <span className="font-bold text-violet-600">matrixksn</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1.5 border-t border-violet-50">
              <span className="text-[#8C84A8]">الثيم</span>
              <span className="font-semibold text-[#231942]">بنفسجي احترافي</span>
            </div>
          </div>
        </SectionCard>

        <div className="flex gap-3 pt-2">
          <PrimaryButton
            onClick={handleSave}
            size="lg"
            icon={<Save className="w-5 h-5" />}
          >
            {saved ? '✓ تم الحفظ بنجاح' : 'حفظ الإعدادات'}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
