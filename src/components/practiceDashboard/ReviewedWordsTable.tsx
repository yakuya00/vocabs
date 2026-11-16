import { CheckCircle2, BookOpen } from "lucide-react";
import type { ReviewedWord } from "../../types";

interface ReviewedWordsTableProps {
  reviewed: ReviewedWord[];
}

export function ReviewedWordsTable({ reviewed }: ReviewedWordsTableProps) {
  const reviewedCount = reviewed.length;

  return (
    <div className="space-y-4">
      {/* Заголовок со счетчиком */}
      <h3 className="text-center text-lg font-bold text-white flex items-center justify-center gap-2">
        <CheckCircle2 size={18} className="text-emerald-400" /> Reviewed{" "}
        {reviewedCount} Words Today
      </h3>

      {/* Таблица или пустое состояние */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {reviewedCount > 0 ? (
          <table className="w-full text-left text-xs md:text-sm">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-5">Word</th>
                <th className="py-3 px-5">Translation</th>
                <th className="py-3 px-5 text-right">Next Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {reviewed.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-5 font-semibold text-white whitespace-nowrap">
                    {item.word}
                  </td>
                  <td className="py-3.5 px-5 text-slate-300">
                    {item.translation}
                  </td>
                  <td className="py-3.5 px-5 text-right text-indigo-400 font-medium whitespace-nowrap">
                    {item.nextDue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-slate-500 space-y-2">
            <BookOpen size={24} className="mx-auto text-slate-600 mb-1" />
            <p className="text-sm">No words reviewed today yet</p>
            <p className="text-xs text-slate-600">
              Click "Start Practice" to start practicing
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
