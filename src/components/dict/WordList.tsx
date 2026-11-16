import type { Card } from "../../types";
import { WordCard } from "./WordCard";
import { Loading } from "../Loading";
import { useDictionaryContext } from "../../context/DictionaryContext";

interface WordListProps {
  cards: Card[];
  onDeleteCard: (id: string) => void;
  onOpenAddModal: () => void;
}

export function WordList({
  cards,
  onDeleteCard,
  onOpenAddModal,
}: WordListProps) {
  const { loadingCards } = useDictionaryContext();
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/80">
      {loadingCards ? (
        <Loading text="Loading words..." />
      ) : cards.length > 0 ? (
        cards.map((card) => (
          <WordCard key={card.id} card={card} onDelete={onDeleteCard} />
        ))
      ) : (
        <div className="p-12 text-center text-slate-500 space-y-2">
          <p>No words found</p>
          <button
            onClick={onOpenAddModal}
            className="text-indigo-400 hover:underline text-sm font-medium cursor-pointer"
          >
            + Add your first word
          </button>
        </div>
      )}
    </div>
  );
}
