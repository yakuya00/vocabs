import { X } from "lucide-react";

interface ProgressBarProps {
  box: number;
  stage: "ru_to_en" | "en_to_ru" | "typing";
  progressPercent: number;
  onExit: () => void;
}

const STAGE_LABELS: Record<string, string> = {
  ru_to_en: "Stage 1: Choice (EN)",
  en_to_ru: "Stage 2: Choice (RU)",
  typing: "Stage 3: Typing",
};

export function ProgressBar({
  box,
  stage,
  progressPercent,
  onExit,
}: ProgressBarProps) {
  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-mono">
            Box {box}
          </span>
          <span className="text-[11px] text-slate-500">
            {STAGE_LABELS[stage]}
          </span>
        </div>

        <button
          onClick={onExit}
          className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          title="Finish session"
        >
          <X size={18} />
        </button>
      </div>

      <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
