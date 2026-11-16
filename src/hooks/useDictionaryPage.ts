import { useState, useMemo, useRef } from "react";
import { toast } from "sonner";
import { cardsApi } from "../api/cards";
import { useAuth } from "../context/AuthContext";
import { useDictionaryContext } from "../context/DictionaryContext";
import { parseReadlangFile } from "../utils/readlangParser";

const ITEMS_PER_PAGE = 20;

export type DictionaryFilter = "all" | "learning" | "learned";

export function useDictionaryPage() {
  const { user } = useAuth();
  const { cards, reloadCards, deleteCard, activeDict } = useDictionaryContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<DictionaryFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredCards = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return cards.filter((card) => {
      const matchesSearch =
        !q ||
        card.word.toLowerCase().includes(q) ||
        card.translation.toLowerCase().includes(q) ||
        (card.context && card.context.toLowerCase().includes(q));

      if (!matchesSearch) return false;
      if (selectedFilter === "learning") return card.box < 4;
      if (selectedFilter === "learned") return card.box >= 4;
      return true;
    });
  }, [cards, searchQuery, selectedFilter]);

  const paginatedCards = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCards.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCards, currentPage]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filter: DictionaryFilter) => {
    setSelectedFilter(filter);
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    toast("Delete this word from the dictionary?", {
      action: {
        label: "Delete",
        onClick: async () => {
          const ok = await deleteCard(id);
          if (ok) {
            toast.success("Word deleted");
          } else {
            toast.error("Failed to delete word");
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeDict?.id || !user?.id) return;

    setIsImporting(true);
    const reader = new FileReader();

    reader.onerror = () => {
      toast.error("Failed to read file");
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    };

    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseReadlangFile(text);

        if (parsed.length === 0) {
          toast.info("No matching lines found in file");
          return;
        }

        const nowIso = new Date().toISOString();
        const payload = parsed.map((item) => ({
          ...item,
          dictionary_id: activeDict.id,
          user_id: user.id,
          box: 1,
          next_review_at: nowIso,
          last_reviewed_at: null,
        }));

        await cardsApi.createMany(payload);

        toast.success(`Imported words: ${payload.length}`);
        await reloadCards();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        toast.error(`Import error: ${message}`);
      } finally {
        setIsImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };

    reader.readAsText(file);
  };

  return {
    cards,
    totalCardsCount: cards.length,
    filteredCards,
    paginatedCards,
    currentPage,
    itemsPerPage: ITEMS_PER_PAGE,
    searchQuery,
    selectedFilter,
    isAddOpen,
    isImporting,
    fileInputRef,

    setCurrentPage,
    setSearchQuery: handleSearchChange,
    setSelectedFilter: handleFilterChange,
    setIsAddOpen,
    handleDelete,
    handleFileImport,
  };
}
