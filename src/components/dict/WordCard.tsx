import { Volume2, Trash2 } from "lucide-react";
import type { Card } from "../../types";
import { useDictionaryContext } from "../../context/DictionaryContext";

interface WordCardProps {
  card: Card;
  onDelete: (id: string) => void;
}

export function WordCard({ card, onDelete }: WordCardProps) {
  const { playAudio } = useDictionaryContext();

  return (
    <div className="flex items-center gap-4 p-4 hover:bg-slate-800/40 transition-colors group">
      {/* Кнопки аудио и звездочки */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => playAudio(card.word)}
          title="Listen to pronunciation"
          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Volume2 size={16} />
        </button>
      </div>

      {/* Контекст со словом */}
      <div className="flex-1 min-w-0 pr-4">
        {card.context ? (
          <p className="text-sm text-slate-300 leading-relaxed font-sans">
            {card.context.split("______").map((part, idx, arr) => (
              <span key={idx}>
                {part}
                {idx < arr.length - 1 && (
                  <strong className="font-bold bg-indigo-500/10 px-1 py-0.5 rounded text-indigo-300">
                    {card.word}
                  </strong>
                )}
              </span>
            ))}
          </p>
        ) : (
          <span className="text-base font-bold text-white tracking-wide">
            {card.word}
          </span>
        )}
        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
          <span>Box {card.box}</span>
          <span>•</span>
          <span>{new Date(card.created_at).toLocaleDateString("ru-RU")}</span>
        </div>
      </div>

      {/* Перевод */}
      <div className="w-1/3 min-w-[140px] text-right font-medium text-slate-300 text-sm">
        {card.translation}
      </div>

      {/* Кнопка удаления */}
      <button
        onClick={() => onDelete(card.id)}
        title="Delete word"
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-all cursor-pointer"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
