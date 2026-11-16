import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { cardsApi } from "../api/cards";
import { dictionaryApi } from "../api/dictionaries";
import type { Dictionary, Card } from "../types";
import { playTextToSpeech } from "../utils/ttsPlayer";
import { useAuth } from "./AuthContext";

interface DictionaryContextType {
  // Словари
  dictionaries: Dictionary[];
  activeDict: Dictionary | null;
  setActiveDict: (dict: Dictionary) => void;
  loadingDicts: boolean;
  addDictionary: (
    title: string,
    sourceLang?: string,
    targetLang?: string,
  ) => Promise<void>;
  reloadDictionaries: () => Promise<void>;

  // Карточки активного словаря
  cards: Card[];
  loadingCards: boolean;
  reloadCards: () => Promise<void>;
  addCard: (
    word: string,
    translation: string,
    context?: string,
    audioUrl?: string,
  ) => Promise<void>;
  deleteCard: (cardId: string) => Promise<boolean>;

  // Озвучка
  playAudio: (text: string) => void;
}

const DictionaryContext = createContext<DictionaryContextType | null>(null);

export function DictionaryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // --- Внешние контексты ---
  const { user } = useAuth();

  // --- Стейты ---
  const [dictionaries, setDictionaries] = useState<Dictionary[]>([]);
  const [activeDict, setActiveDict] = useState<Dictionary | null>(null);
  const [loadingDicts, setLoadingDicts] = useState(true);

  const [cards, setCards] = useState<Card[]>([]);
  const [loadingCards, setLoadingCards] = useState(false);

  // --- Методы работы со словарями ---
  const fetchDictionaries = useCallback(async () => {
    if (!user?.id) {
      setDictionaries([]);
      setActiveDict(null);
      setLoadingDicts(false);
      return;
    }

    setLoadingDicts(true);
    try {
      const data = await dictionaryApi.getDictionaries(user.id);

      if (data.length > 0) {
        setDictionaries(data);
        setActiveDict((prev) => {
          if (!prev) return data[0];
          const stillExists = data.find((d) => d.id === prev.id);
          return stillExists || data[0];
        });
      } else {
        const newDict = await dictionaryApi.create({
          user_id: user.id,
          title: "English Core",
          source_lang: "en",
          target_lang: "ru",
        });

        setDictionaries([newDict]);
        setActiveDict(newDict);
      }
    } catch (error) {
      console.error("Error loading or creating dictionary:", error);
    } finally {
      setLoadingDicts(false);
    }
  }, [user?.id]);

  const addDictionary = useCallback(
    async (title: string, sourceLang = "en", targetLang = "ru") => {
      if (!user?.id || !title.trim()) return;

      try {
        const newDict = await dictionaryApi.create({
          user_id: user.id,
          title: title.trim(),
          source_lang: sourceLang,
          target_lang: targetLang,
        });

        setDictionaries((prev) => [...prev, newDict]);
        setActiveDict(newDict);
      } catch (error) {
        console.error("Error creating dictionary:", error);
        throw error;
      }
    },
    [user?.id],
  );

  // --- Методы работы с карточками ---
  const fetchCards = useCallback(async () => {
    if (!activeDict?.id) {
      setCards([]);
      return;
    }

    setLoadingCards(true);
    try {
      const data = await cardsApi.getByDictionary(activeDict.id);
      setCards(data);
    } catch (error) {
      console.error("Error loading cards:", error);
      setCards([]);
    } finally {
      setLoadingCards(false);
    }
  }, [activeDict?.id]);

  const addCard = useCallback(
    async (
      word: string,
      translation: string,
      context?: string,
      audioUrl?: string,
    ) => {
      if (!activeDict?.id || !user?.id || !word.trim() || !translation.trim()) {
        return;
      }

      try {
        await cardsApi.create({
          dictionary_id: activeDict.id,
          user_id: user.id,
          word: word.trim().toLowerCase(),
          translation: translation.trim(),
          context: context?.trim() || null,
          audio_url: audioUrl || null,
          box: 1,
          next_review_at: new Date().toISOString(),
          last_reviewed_at: null,
        });

        await fetchCards();
      } catch (error) {
        console.error("Error creating card:", error);
        throw error;
      }
    },
    [activeDict?.id, user?.id, fetchCards],
  );

  const deleteCard = useCallback(async (cardId: string): Promise<boolean> => {
    try {
      await cardsApi.delete(cardId);
      setCards((prev) => prev.filter((c) => c.id !== cardId));
      return true;
    } catch (error) {
      console.error("Error deleting card:", error);
      return false;
    }
  }, []);

  // --- Озвучка ---
  const playAudio = useCallback(
    (text: string) => {
      playTextToSpeech(text, activeDict?.source_lang);
    },
    [activeDict?.source_lang],
  );

  // --- Эффекты ---
  useEffect(() => {
    fetchDictionaries();
  }, [fetchDictionaries]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  return (
    <DictionaryContext.Provider
      value={{
        dictionaries,
        activeDict,
        setActiveDict,
        loadingDicts,
        addDictionary,
        reloadDictionaries: fetchDictionaries,

        cards,
        loadingCards,
        reloadCards: fetchCards,
        addCard,
        deleteCard,

        playAudio,
      }}
    >
      {children}
    </DictionaryContext.Provider>
  );
}

export function useDictionaryContext() {
  const context = useContext(DictionaryContext);
  if (!context) {
    throw new Error(
      "useDictionaryContext must be used within a DictionaryProvider",
    );
  }
  return context;
}
