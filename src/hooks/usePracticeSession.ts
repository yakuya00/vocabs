import { useState, useEffect, useCallback, useRef } from "react";
import { cardsApi } from "../api/cards";
import { reviewsApi } from "../api/reviews";
import { useAuth } from "../context/AuthContext";
import { useDictionaryContext } from "../context/DictionaryContext";
import type { Card } from "../types";
import {
  type ExerciseStage,
  getStagesForCard,
  calculateNextReview,
  insertWithSpacing,
} from "../utils/practiceAlgorithm";
import {
  playSuccessSound,
  playErrorSound,
  playSessionCompleteSound,
} from "../utils/soundEffects";

export interface PracticeOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface SessionCard extends Card {
  stages: ExerciseStage[];
  currentStageIndex: number;
  hasFailed: boolean;
  enOptions: PracticeOption[];
  ruOptions: PracticeOption[];
}

const shuffle = <T>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

function generateOptions(
  correctText: string,
  correctId: string,
  candidates: string[],
  prefix: string,
): PracticeOption[] {
  const uniqueWrong = Array.from(
    new Set(candidates.filter((c) => c !== correctText)),
  );
  const wrongOptions = shuffle(uniqueWrong).slice(0, 3);

  return shuffle([
    { id: correctId, text: correctText, isCorrect: true },
    ...wrongOptions.map((text, i) => ({
      id: `${prefix}-${i}`,
      text,
      isCorrect: false,
    })),
  ]);
}

export function usePracticeSession(sessionLimit = 10) {
  const { user } = useAuth();
  const {
    activeDict,
    cards: allDictCards,
    reloadCards,
  } = useDictionaryContext();

  const [queue, setQueue] = useState<SessionCard[]>([]);
  const [totalWordsCount, setTotalWordsCount] = useState(0);
  const [completedWordsCount, setCompletedWordsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  const allDictCardsRef = useRef(allDictCards);
  allDictCardsRef.current = allDictCards;

  const currentCard = queue[0] ?? null;

  const currentStage: ExerciseStage = currentCard
    ? currentCard.stages[currentCard.currentStageIndex] || "typing"
    : "typing";

  const progressPercent =
    totalWordsCount > 0
      ? Math.round((completedWordsCount / totalWordsCount) * 100)
      : 0;

  const initSession = useCallback(async () => {
    if (!activeDict?.id) return;

    setLoading(true);
    setIsFinished(false);

    try {
      const dueCards = await cardsApi.getDueCards(activeDict.id, sessionLimit);

      if (dueCards.length === 0) {
        setQueue([]);
        setTotalWordsCount(0);
        setCompletedWordsCount(0);
        return; // finally сам выставит setLoading(false)
      }

      const currentPool =
        allDictCardsRef.current.length >= 4
          ? allDictCardsRef.current
          : dueCards;

      const allWords = currentPool.map((c) => c.word);
      const allTranslations = currentPool.map((c) => c.translation);

      const prepared: SessionCard[] = dueCards.map((card) => ({
        ...card,
        stages: getStagesForCard(card.box),
        currentStageIndex: 0,
        hasFailed: false,
        enOptions: generateOptions(card.word, card.id, allWords, "w-en"),
        ruOptions: generateOptions(
          card.translation,
          card.id,
          allTranslations,
          "w-ru",
        ),
      }));

      const initialQueue = shuffle(prepared);
      setQueue(initialQueue);
      setTotalWordsCount(initialQueue.length);
      setCompletedWordsCount(0);
    } catch (e) {
      console.error("Session initialization error:", e);
      setQueue([]);
    } finally {
      setLoading(false);
    }
  }, [activeDict?.id, sessionLimit]);

  const handleAnswer = async (isCorrect: boolean) => {
    if (!currentCard) return;

    const remainingQueue = queue.slice(1);

    if (!isCorrect) {
      playErrorSound();
      const failedCard: SessionCard = {
        ...currentCard,
        currentStageIndex: 0,
        hasFailed: true,
      };
      setQueue(insertWithSpacing(remainingQueue, failedCard, 2));
      return;
    }

    const nextStageIndex = currentCard.currentStageIndex + 1;

    if (nextStageIndex < currentCard.stages.length) {
      playSuccessSound();
      const advancedCard: SessionCard = {
        ...currentCard,
        currentStageIndex: nextStageIndex,
      };
      setQueue(insertWithSpacing(remainingQueue, advancedCard, 3));
      return;
    }

    const { nextBox, nextReviewAt } = calculateNextReview(
      currentCard.box,
      currentCard.hasFailed,
    );

    try {
      await Promise.all([
        cardsApi.updateProgress(currentCard.id, nextBox, nextReviewAt),
        reviewsApi.create({
          card_id: currentCard.id,
          user_id: user?.id || currentCard.user_id,
          stage: currentCard.box,
          correct: !currentCard.hasFailed,
        }),
      ]);
    } catch (error) {
      console.error("Error saving card progress:", error);
    }

    setCompletedWordsCount((prev) => prev + 1);
    setQueue(remainingQueue);

    if (remainingQueue.length === 0) {
      playSessionCompleteSound();
      setIsFinished(true);
      await reloadCards();
    } else {
      playSuccessSound();
    }
  };

  useEffect(() => {
    initSession();
  }, [initSession]);

  return {
    currentCard,
    currentStage,
    progressPercent,
    loading,
    isFinished,
    handleAnswer,
    restartSession: initSession,
  };
}
