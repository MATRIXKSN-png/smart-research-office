export interface Reference {
  id: string;
  name: string;
  author: string;
  year: number;
  totalPages: number;
  files: ReferenceFile[];
}

export interface ReferenceFile {
  id: string;
  referenceId: string;
  fileName: string;
  fileType: 'pdf' | 'image';
  pageNumber: number;
  extractionMethod: 'نص مباشر' | 'OCR';
  agentName: string;
  status: 'مكتمل' | 'قيد المعالجة' | 'في الانتظار';
  extractedText: string;
}

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

export const mockReferences: Reference[] = [
  {
    id: 'ref-1',
    name: 'مناهج البحث العلمي وطرق التوثيق',
    author: 'د. عبدالرحمن الحسن',
    year: 2019,
    totalPages: 312,
    files: [
      {
        id: 'file-1-1',
        referenceId: 'ref-1',
        fileName: 'البحث_العلمي_الفصل1.pdf',
        fileType: 'pdf',
        pageNumber: 1,
        extractionMethod: 'نص مباشر',
        agentName: 'موظف استخراج النصوص',
        status: 'مكتمل',
        extractedText:
          'يُعدّ البحث العلمي من أهم الأدوات التي يعتمد عليها الإنسان في فهم الظواهر الطبيعية والاجتماعية، إذ يقوم على منهجية دقيقة ومنظمة تهدف إلى الوصول إلى الحقائق الموضوعية. ويمر البحث العلمي بمراحل متتالية ومتكاملة تبدأ بتحديد المشكلة وصياغة الأسئلة البحثية، مرورًا بجمع البيانات وتحليلها، وانتهاءً باستخلاص النتائج وتوثيقها بصورة علمية دقيقة.',
      },
      {
        id: 'file-1-2',
        referenceId: 'ref-1',
        fileName: 'البحث_العلمي_الفصل2.pdf',
        fileType: 'pdf',
        pageNumber: 45,
        extractionMethod: 'نص مباشر',
        agentName: 'موظف استخراج النصوص',
        status: 'مكتمل',
        extractedText:
          'تُصنَّف مناهج البحث العلمي إلى عدة أنواع رئيسية: المنهج الوصفي الذي يهتم برصد الظواهر وتوصيفها كما توجد في الواقع، والمنهج التجريبي الذي يقوم على التحكم في المتغيرات وقياس العلاقات السببية بينها، والمنهج التاريخي الذي يعتمد على دراسة الوثائق والسجلات لفهم الأحداث الماضية.',
      },
      {
        id: 'file-1-3',
        referenceId: 'ref-1',
        fileName: 'البحث_العلمي_الفصل3.png',
        fileType: 'image',
        pageNumber: 98,
        extractionMethod: 'OCR',
        agentName: 'موظف OCR',
        status: 'مكتمل',
        extractedText:
          'التوثيق العلمي هو الركيزة الأساسية لأي بحث أكاديمي موثوق، ويقصد به الإشارة إلى المصادر والمراجع التي استند إليها الباحث في دراسته. وتتعدد أنظمة التوثيق المتبعة في الدراسات الأكاديمية، أبرزها نظام APA ونظام MLA وفيلادلفيا، وتختلف هذه الأنظمة في طريقة ترتيب المعلومات وأسلوب عرض المراجع.',
      },
    ],
  },
  {
    id: 'ref-2',
    name: 'أصول الفقه الإسلامي - دراسة معاصرة',
    author: 'أ. د. محمد عبدالله الزيد',
    year: 2021,
    totalPages: 480,
    files: [
      {
        id: 'file-2-1',
        referenceId: 'ref-2',
        fileName: 'اصول_الفقه_مقدمة.pdf',
        fileType: 'pdf',
        pageNumber: 3,
        extractionMethod: 'نص مباشر',
        agentName: 'موظف استخراج النصوص',
        status: 'مكتمل',
        extractedText:
          'علم أصول الفقه هو العلم الذي يبحث في الأدلة الشرعية الكلية من حيث دلالتها على الأحكام الفقهية الجزئية. وقد نشأ هذا العلم الشريف استجابةً لحاجة الفقهاء إلى وضع قواعد منهجية تضبط عملية الاستنباط الفقهي وتحكم المسائل الخلافية في ضوء الأدلة الشرعية المعتبرة.',
      },
      {
        id: 'file-2-2',
        referenceId: 'ref-2',
        fileName: 'اصول_الفقه_الباب1.pdf',
        fileType: 'pdf',
        pageNumber: 67,
        extractionMethod: 'نص مباشر',
        agentName: 'موظف استخراج النصوص',
        status: 'مكتمل',
        extractedText:
          'الأدلة الشرعية الكلية تنقسم في جملتها إلى قسمين: أدلة متفق عليها وأدلة مختلف فيها. أما الأدلة المتفق عليها عند جمهور الفقهاء فهي: القرآن الكريم، والسنة النبوية المطهرة، والإجماع، والقياس. وقد اعتنى علماء الأصول بالبحث في حجية كل دليل من هذه الأدلة وشروط الاحتجاج به وكيفية التعامل مع تعارضها.',
      },
    ],
  },
  {
    id: 'ref-3',
    name: 'التحليل الإحصائي في العلوم الاجتماعية',
    author: 'د. سارة الأمين',
    year: 2020,
    totalPages: 256,
    files: [
      {
        id: 'file-3-1',
        referenceId: 'ref-3',
        fileName: 'الاحصاء_مقدمة.pdf',
        fileType: 'pdf',
        pageNumber: 1,
        extractionMethod: 'نص مباشر',
        agentName: 'موظف استخراج النصوص',
        status: 'مكتمل',
        extractedText:
          'يُعدّ الإحصاء من أقوى الأدوات المستخدمة في تحليل البيانات الاجتماعية والإنسانية، إذ يُمكّن الباحث من وصف البيانات المجمعة بصورة كمية دقيقة، واستخلاص دلالات موضوعية منها، واختبار الفرضيات البحثية بأساليب علمية رصينة. ويشمل الإحصاء فرعين رئيسيين: الإحصاء الوصفي المعني بتلخيص البيانات وعرضها، والإحصاء الاستدلالي المعني بالتعميم من العينة إلى المجتمع.',
      },
    ],
  },
];

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
      'يُعدّ البحث العلمي من أهم الأدوات التي يعتمد عليها الإنسان في فهم الظواهر الطبيعية والاجتماعية، إذ يقوم على منهجية دقيقة ومنظمة تهدف إلى الوصول إلى الحقائق الموضوعية. ويمر البحث العلمي بمراحل متتالية ومتكاملة تبدأ بتحديد المشكلة وصياغة الأسئلة البحثية، مرورًا بجمع البيانات وتحليلها، وانتهاءً باستخلاص النتائج وتوثيقها بصورة علمية دقيقة.',
    referenceName: 'مناهج البحث العلمي وطرق التوثيق',
    pageNumber: 1,
    relevanceScore: 97,
    analysis:
      'الفقرة ذات صلة مباشرة بالسؤال، إذ تشمل تعريف البحث العلمي ومراحله الأساسية التي تبدأ بتحديد المشكلة وتنتهي بتوثيق النتائج.',
  },
  {
    id: 'result-2',
    topic: 'أنواع مناهج البحث العلمي',
    originalText:
      'تُصنَّف مناهج البحث العلمي إلى عدة أنواع رئيسية: المنهج الوصفي الذي يهتم برصد الظواهر وتوصيفها كما توجد في الواقع، والمنهج التجريبي الذي يقوم على التحكم في المتغيرات وقياس العلاقات السببية بينها، والمنهج التاريخي الذي يعتمد على دراسة الوثائق والسجلات لفهم الأحداث الماضية.',
    referenceName: 'مناهج البحث العلمي وطرق التوثيق',
    pageNumber: 45,
    relevanceScore: 89,
    analysis:
      'تتناول هذه الفقرة تصنيفات مناهج البحث العلمي بصورة مباشرة، مما يجعلها وثيقة الصلة بالسؤال المطروح حول أنواع مناهج البحث.',
  },
  {
    id: 'result-3',
    topic: 'الإحصاء في البحث العلمي',
    originalText:
      'يُعدّ الإحصاء من أقوى الأدوات المستخدمة في تحليل البيانات الاجتماعية والإنسانية، إذ يُمكّن الباحث من وصف البيانات المجمعة بصورة كمية دقيقة، واستخلاص دلالات موضوعية منها، واختبار الفرضيات البحثية بأساليب علمية رصينة.',
    referenceName: 'التحليل الإحصائي في العلوم الاجتماعية',
    pageNumber: 1,
    relevanceScore: 74,
    analysis:
      'تذكر الفقرة دور الإحصاء في دعم أدوات البحث العلمي وتحليل البيانات، وهي ذات صلة جزئية بالسؤال العام عن مناهج البحث.',
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
