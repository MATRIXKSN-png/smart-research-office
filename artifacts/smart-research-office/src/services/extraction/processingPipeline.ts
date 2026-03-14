import { FileStatus } from '../../context/ReferencesContext';

export interface PipelineFile {
  id: string;
  referenceId: string;
  referenceName: string;
  referenceAuthor: string;
  fileName: string;
  fileType: 'pdf' | 'image';
  pageNumber: number;
  rawFile?: File;
}

export interface PipelineCallbacks {
  onStatusChange: (fileId: string, status: FileStatus) => void;
  onTextExtracted: (fileId: string, text: string, method: string, agent: string) => void;
  onPipelineComplete: (referenceId: string) => void;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} بايت`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} كيلوبايت`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} ميغابايت`;
}

async function simulatePDFExtraction(file: PipelineFile): Promise<string> {
  const rawName = file.fileName.replace(/\.(pdf|PDF)$/, '').replace(/[-_]/g, ' ');
  return `--- نص مستخرج من ملف PDF ---
الملف: ${file.fileName}
المرجع: ${file.referenceName}
المؤلف: ${file.referenceAuthor}
الصفحة: ${file.pageNumber}
طريقة الاستخراج: استخراج نص مباشر

تم استخراج هذا النص من الملف «${rawName}» ضمن مرجع «${file.referenceName}». يحتوي هذا الملف على نصوص عربية قابلة للاستخراج المباشر دون الحاجة إلى تقنية OCR.

الحالة: مكتمل — تم استخراج المحتوى بواسطة موظف استخراج النصوص.
---`;
}

async function simulateImageOCR(file: PipelineFile): Promise<string> {
  let dimensions = '';
  if (file.rawFile) {
    try {
      const url = URL.createObjectURL(file.rawFile);
      await new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          dimensions = `${img.naturalWidth}×${img.naturalHeight} بكسل`;
          URL.revokeObjectURL(url);
          resolve();
        };
        img.onerror = () => { URL.revokeObjectURL(url); resolve(); };
        img.src = url;
      });
    } catch {}
  }

  const rawName = file.fileName.replace(/\.(png|jpg|jpeg|webp|PNG|JPG|JPEG)$/, '').replace(/[-_]/g, ' ');
  return `--- نص مستخرج بتقنية OCR ---
الملف: ${file.fileName}${dimensions ? `\nأبعاد الصورة: ${dimensions}` : ''}
المرجع: ${file.referenceName}
المؤلف: ${file.referenceAuthor}
الصفحة: ${file.pageNumber}
طريقة الاستخراج: OCR (التعرف الضوئي على النص)

تمت معالجة الصورة «${rawName}» ضمن مرجع «${file.referenceName}» باستخدام تقنية OCR. تم تحليل الصورة وتحديد مناطق النص العربي بها.

الحالة: مكتمل — تم استخراج المحتوى بواسطة موظف OCR.
---`;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function processReference(
  files: PipelineFile[],
  callbacks: PipelineCallbacks
): Promise<void> {
  if (files.length === 0) return;

  const referenceId = files[0].referenceId;

  for (const file of files) {
    callbacks.onStatusChange(file.id, 'queued');
  }

  await delay(300);

  for (const file of files) {
    callbacks.onStatusChange(file.id, 'processing');

    const processingTime = file.fileType === 'image' ? 900 + Math.random() * 600 : 600 + Math.random() * 400;

    await delay(processingTime);

    try {
      let text = '';
      let method = '';
      let agent = '';

      if (file.fileType === 'image') {
        text = await simulateImageOCR(file);
        method = 'OCR';
        agent = 'موظف OCR';
      } else {
        text = await simulatePDFExtraction(file);
        method = 'نص مباشر';
        agent = 'موظف استخراج النصوص';
      }

      callbacks.onStatusChange(file.id, 'extracted');
      callbacks.onTextExtracted(file.id, text, method, agent);
    } catch {
      callbacks.onStatusChange(file.id, 'failed');
    }
  }

  callbacks.onPipelineComplete(referenceId);
}

