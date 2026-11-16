import { useState, useEffect, useCallback } from "react";
import { useDictionaryContext } from "../context/DictionaryContext";

import { cardsApi } from "../api/cards";
import type { ReviewedWord } from "../types";

export function usePracticeDashboard() {
  const { activeDict } = useDictionaryContext();

  const [loading, setLoading] = useState(false);
  const [reviewed, setReviewed] = useState<ReviewedWord[]>([]);
  const [dueCount, setDueCount] = useState<number>(0);
  const [limit, setLimit] = useState<number>(15);

  // 1. Загрузка слов, повторенных за сегодня
  const loadTodaysReviewed = useCallback(async () => {
    if (!activeDict?.id) return;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    try {
      const data = await cardsApi.getTodayReviewedCards(
        activeDict?.id,
        startOfToday,
      );
      const formattedData: ReviewedWord[] = (data || []).map((card) => ({
        id: card.id,
        word: card.word,
        translation: card.translation,
        nextDue: card.next_review_at
          ? new Date(card.next_review_at).toLocaleDateString("ru-RU")
          : "Today",
      }));

      setReviewed(formattedData);
    } catch (error) {
      console.error("Error loading reviewed words:", error);
      return;
    }
  }, [activeDict?.id]);

  // 2. Подсчет количества слов, готовых к повторению прямо сейчас
  const loadDueCardsCount = useCallback(async () => {
    if (!activeDict?.id) return;
    try {
      const count = await cardsApi.getDueCount(activeDict?.id);
      setDueCount(count);
    } catch (error) {
      console.error("Error counting words to review:", error);
      return;
    }
  }, [activeDict?.id]);

  // Общий метод загрузки всех данных дашборда
  const reloadPractice = useCallback(async () => {
    setLoading(true);
    await Promise.all([loadTodaysReviewed(), loadDueCardsCount()]);
    setLoading(false);
  }, [loadTodaysReviewed, loadDueCardsCount]);

  useEffect(() => {
    reloadPractice();
  }, [reloadPractice]);

  return {
    reviewed,
    limit,
    reviewedCount: reviewed.length,
    dueCount, // число слов, готовых к тренировке прямо сейчас
    loading,
    setLimit,
    reloadPractice,
  };
}
