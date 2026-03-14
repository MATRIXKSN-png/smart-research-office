/**
 * DEV-ONLY mock data — هذا الملف للتطوير فقط.
 * لا يتم استيراده في أي صفحة أو مكون من التطبيق الفعلي.
 * التطبيق يبدأ دائمًا فارغًا ويعتمد على ReferencesContext.
 */

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'نشط الآن' | 'في وضع الانتظار' | 'غير متصل';
  icon: string;
  tasksCompleted: number;
}

export interface SearchResult {
  id: string;
  topic: string;
  originalText: string;
  referenceName: string;
  pageNumber: number;
  relevanceScore: number;
  analysis: string;
}

export interface AppSettings {
  ocrEnabled: boolean;
  strictMode: boolean;
  defaultResultsCount: number;
  llmEnabled: boolean;
  paragraphComments: boolean;
  generalComments: boolean;
  finalConclusions: boolean;
  alwaysShowReference: boolean;
}

export const mockAgents: Agent[] = [
  {
    id: 'agent-1',
    name: 'مدير المكتب',
    role: 'استقبال الملفات وتوزيع المهام',
    status: 'نشط الآن',
    icon: 'briefcase',
    tasksCompleted: 42,
  },
  {
    id: 'agent-2',
    name: 'موظف استخراج النصوص',
    role: 'استخراج النصوص من ملفات PDF',
    status: 'نشط الآن',
    icon: 'file-text',
    tasksCompleted: 38,
  },
  {
    id: 'agent-3',
    name: 'موظف OCR',
    role: 'معالجة الصور واستخراج النصوص',
    status: 'نشط الآن',
    icon: 'scan',
    tasksCompleted: 15,
  },
  {
    id: 'agent-4',
    name: 'موظف التحليل',
    role: 'تحليل النصوص وتصنيفها',
    status: 'في وضع الانتظار',
    icon: 'brain',
    tasksCompleted: 0,
  },
  {
    id: 'agent-5',
    name: 'موظف البحث',
    role: 'البحث داخل النصوص الأصلية',
    status: 'نشط الآن',
    icon: 'search',
    tasksCompleted: 27,
  },
  {
    id: 'agent-6',
    name: 'موظف التنظيم',
    role: 'تنظيم وترتيب النتائج',
    status: 'نشط الآن',
    icon: 'layers',
    tasksCompleted: 31,
  },
];

export const mockSearchResults: SearchResult[] = [
  {
    id: 'result-1',
    topic: 'تعريف البحث العلمي ومراحله',
    originalText:
      'يُعدّ البحث العلمي من أهم الأدوات التي يعتمد عليها الإنسان في فهم الظواهر الطبيعية والاجتماعية، إذ يقوم على منهجية دقيقة ومنظمة تهدف إلى الوصول إلى الحقائق الموضوعية.',
    referenceName: 'المرجع الأول',
    pageNumber: 1,
    relevanceScore: 97,
    analysis:
      'الفقرة ذات صلة مباشرة بالسؤال، إذ تشمل تعريف البحث العلمي ومراحله الأساسية.',
  },
  {
    id: 'result-2',
    topic: 'أنواع مناهج البحث العلمي',
    originalText:
      'تُصنَّف مناهج البحث العلمي إلى عدة أنواع رئيسية: المنهج الوصفي، والمنهج التجريبي، والمنهج التاريخي.',
    referenceName: 'المرجع الثاني',
    pageNumber: 45,
    relevanceScore: 89,
    analysis:
      'تتناول هذه الفقرة تصنيفات مناهج البحث العلمي بصورة مباشرة.',
  },
  {
    id: 'result-3',
    topic: 'الإحصاء في البحث العلمي',
    originalText:
      'يُعدّ الإحصاء من أقوى الأدوات المستخدمة في تحليل البيانات الاجتماعية والإنسانية.',
    referenceName: 'المرجع الثالث',
    pageNumber: 1,
    relevanceScore: 74,
    analysis:
      'تذكر الفقرة دور الإحصاء في دعم أدوات البحث العلمي وتحليل البيانات.',
  },
];

export const defaultSettings: AppSettings = {
  ocrEnabled: true,
  strictMode: true,
  defaultResultsCount: 5,
  llmEnabled: false,
  paragraphComments: true,
  generalComments: true,
  finalConclusions: true,
  alwaysShowReference: true,
};
