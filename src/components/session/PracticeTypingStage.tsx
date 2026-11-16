import { ArrowRight, HelpCircle } from "lucide-react";

interface PracticeTypingStageProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  onSkip: () => void;
}

export function PracticeTypingStage({
  value,
  onChange,
  onSubmit,
  onSkip,
}: PracticeTypingStageProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit();
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        autoFocus
        placeholder="Type the word in English..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-950 border-2 border-slate-800 focus:border-indigo-500 rounded-2xl px-5 py-4 text-lg text-white font-medium outline-none transition-all placeholder-slate-600 text-center shadow-inner"
      />

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onSkip}
          className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors cursor-pointer"
        >
          <HelpCircle size={15} /> Don't know (Reset to start)
        </button>

        <button
          type="submit"
          disabled={!value.trim()}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/30 active:scale-95"
        >
          <span>Check</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </form>
  );
}
