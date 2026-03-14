import React from 'react';
import { BookOpen, FileText } from 'lucide-react';
import { SearchResult } from '../data/mockData';

interface ResultCardProps {
  result: SearchResult;
  rank: number;
}

export function ResultCard({ result, rank }: ResultCardProps) {
  const relevanceColor =
    result.relevanceScore >= 90
      ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
      : result.relevanceScore >= 70
      ? 'text-blue-600 bg-blue-50 border-blue-200'
      : 'text-amber-600 bg-amber-50 border-amber-200';

  return (
    <div className="bg-white rounded-2xl border border-violet-100 card-shadow overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 bg-violet-50/50 border-b border-violet-100">
        <div className="w-8 h-8 rounded-lg primary-gradient flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {rank}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-[#231942] text-sm truncate">{result.topic}</h4>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${relevanceColor}`}>
          {result.relevanceScore}% صلة
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4 rounded-full bg-violet-600" />
          <span className="text-xs font-semibold text-violet-700 uppercase tracking-wide">النص الأصلي</span>
          <span className="text-[10px] text-[#8C84A8] bg-violet-50 px-2 py-0.5 rounded-full border border-violet-100">محفوظ كما ورد في المصدر</span>
        </div>
        <blockquote className="text-sm text-[#231942] leading-7 bg-[#FCFAFF] rounded-xl p-4 border border-violet-50 font-medium">
          {result.originalText}
        </blockquote>

        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-[#6B628A]">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{result.referenceName}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#6B628A]">
            <FileText className="w-3.5 h-3.5" />
            <span>ص {result.pageNumber}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t-2 border-dashed border-violet-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-4 rounded-full bg-amber-400" />
            <span className="text-xs font-semibold text-amber-700">التحليل المنفصل</span>
          </div>
          <p className="text-xs text-[#6B628A] leading-6 bg-amber-50/50 rounded-xl p-3 border border-amber-100">
            {result.analysis}
          </p>
        </div>
      </div>
    </div>
  );
}
