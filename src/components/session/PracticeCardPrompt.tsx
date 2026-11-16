import { Volume2 } from "lucide-react";
import type { Card } from "../../types";

interface PracticeCardPromptProps {
  card: Pick<Card, "word" | "translation" | "context">;
  stage: "ru_to_en" | "en_to_ru" | "typing";
  onPlayAudio: (text: string) => void;
}

export function PracticeCardPrompt({
  card,
  stage,
  onPlayAudio,
}: PracticeCardPromptProps) {
  const isEnToRu = stage === "en_to_ru";

  return (
    <div className="my-8 space-y-5 text-center">
      {/* Кнопка озвучки */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => onPlayAudio(card.word)}
          className="w-12 h-12 rounded-2xl bg-slate-800/80 hover:bg-indigo-600/20 text-slate-300 hover:text-indigo-400 border border-slate-700/60 flex items-center justify-center transition-all cursor-pointer shadow-md group"
          title="Listen"
        >
          <Volume2
            size={22}
            className="group-hover:scale-110 transition-transform"
          />
        </button>
      </div>

      {/* Заголовок этапа и слово */}
      <div className="space-y-1.5">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {isEnToRu ? "Select the correct translation" : "Translate to English"}
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          {isEnToRu ? card.word : card.translation}
        </h2>
      </div>

      {/* Контекст предложения с пропуском */}
      {!isEnToRu && card.context && (
        <div className="max-w-lg mx-auto bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 text-slate-300 text-sm leading-relaxed">
          <p>
            {card.context.split("______").map((part, idx, arr) => (
              <span key={idx}>
                {part}
                {idx < arr.length - 1 && (
                  <span className="border-b-2 border-dashed border-indigo-400 font-mono text-indigo-300 px-1 font-bold">
                    ______
                  </span>
                )}
              </span>
            ))}
          </p>
        </div>
      )}
    </div>
  );
}
