import { Layers } from "lucide-react";
interface PracticeLauncherProps {
  limit: number;
  dueCount: number;
  onStart: () => void;
  onChangeLimit: (newLimit: number) => void;
}
export function PracticeLauncer({
  limit,
  dueCount,
  onStart,
  onChangeLimit,
}: PracticeLauncherProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center gap-6">
      {/* Кнопка старта слева */}
      <button
        type="button"
        onClick={onStart}
        className="w-full md:w-56 h-28 bg-gradient-to-br from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-2xl flex flex-col items-center justify-center gap-2 font-bold text-lg shadow-lg shadow-indigo-600/30 transition-all cursor-pointer active:scale-95 group shrink-0"
      >
        <div className="w-12 h-9 bg-white/15 rounded-lg border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Layers size={22} className="text-white" />
        </div>
        <span>Start Practice</span>
      </button>

      {/* Настройки сессии справа */}
      <div className="w-full space-y-3.5 text-xs">
        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-400 font-semibold shrink-0">Mode:</span>
          <select
            defaultValue="typing"
            className="w-full max-w-[280px] bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="typing">Mastery (with typing)</option>
          </select>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-400 font-semibold shrink-0">Length:</span>
          <select
            defaultValue={limit}
            onChange={(e) => onChangeLimit(Number(e.target.value))}
            className="w-full max-w-[280px] bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="10">10 words</option>
            <option value="15">15 words</option>
            <option value="25">25 words</option>
            <option value="50">50 words</option>
          </select>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-400 font-semibold shrink-0">Source:</span>
          <select
            defaultValue="all"
            className="w-full max-w-[280px] bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All ({dueCount} words ready)</option>
            <option value="starred">Starred words only</option>
            <option value="box1">Difficult (Box 1 only)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
