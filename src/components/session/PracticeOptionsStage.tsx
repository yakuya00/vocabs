export interface OptionItem {
  id: string | undefined;
  text: string;
  isCorrect: boolean;
}

interface PracticeOptionsStageProps {
  options: OptionItem[];
  onSelect: (isCorrect: boolean) => void;
}
export function PracticeOptionsStage({
  options,
  onSelect,
}: PracticeOptionsStageProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {options.map((opt, index) => (
        <button
          key={opt.id}
          onClick={() => onSelect(opt.isCorrect)}
          className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/50 text-left transition-all cursor-pointer group active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-400 text-xs font-mono flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              {index + 1}
            </span>
            <span className="text-base font-semibold text-slate-200 group-hover:text-white">
              {opt.text}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
