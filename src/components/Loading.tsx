import { Loader2 } from "lucide-react";

interface LoadingProps {
  text?: string;
  variant?: "card" | "inline";
  className?: string;
}

export function Loading({
  text = "Loading...",
  variant = "inline",
  className = "",
}: LoadingProps) {
  if (variant === "card") {
    return (
      <div
        className={`w-full max-w-2xl mx-auto h-96 flex flex-col items-center justify-center gap-3 bg-slate-900 border border-slate-800 rounded-3xl text-slate-400 ${className}`}
      >
        <Loader2 className="animate-spin text-indigo-400" size={28} />
        <span className="text-sm">{text}</span>
      </div>
    );
  }

  return (
    <div
      className={`p-12 text-center text-slate-400 flex items-center justify-center gap-2 text-sm ${className}`}
    >
      <Loader2 className="animate-spin text-indigo-400" size={18} />
      <span>{text}</span>
    </div>
  );
}
