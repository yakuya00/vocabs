import { CheckCircle2 } from "lucide-react";

interface SessionFinishedProps {
  onRestart: () => void;
  onExit: () => void;
}

export function SessionFinished({ onRestart, onExit }: SessionFinishedProps) {
  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-6">
      <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
        <CheckCircle2 size={32} />
      </div>
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold text-white">Session complete!</h2>
        <p className="text-sm text-slate-400">
          All words have been successfully reviewed and learned.
        </p>
      </div>
      <div className="flex justify-center gap-3 pt-2">
        <button
          onClick={onRestart}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-medium text-slate-200 transition-colors cursor-pointer"
        >
          Practice again
        </button>
        <button
          onClick={onExit}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white transition-colors cursor-pointer"
        >
          Back to dashboard
        </button>
      </div>
    </div>
  );
}
