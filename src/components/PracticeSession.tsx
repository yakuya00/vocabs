import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Loading } from "./Loading";
import { SessionFinished } from "./session/SessionFinished";
import { ProgressBar } from "./session/ProgressBar";
import { PracticeCardPrompt } from "./session/PracticeCardPrompt";
import { usePracticeSession } from "../hooks/usePracticeSession";
import { PracticeOptionsStage } from "./session/PracticeOptionsStage";
import { PracticeTypingStage } from "./session/PracticeTypingStage";
import { useDictionaryContext } from "../context/DictionaryContext";

interface PracticeSessionProps {
  sessionLimit: number;
  onExit: () => void;
}

export function PracticeSession({
  sessionLimit,
  onExit,
}: PracticeSessionProps) {
  const { playAudio } = useDictionaryContext();
  const {
    currentCard,
    currentStage,
    progressPercent,
    loading,
    isFinished,
    handleAnswer,
    restartSession,
  } = usePracticeSession(sessionLimit);

  const [typedAnswer, setTypedAnswer] = useState("");

  const submitTyped = () => {
    if (!currentCard) return;
    const isCorrect =
      typedAnswer.trim().toLowerCase() ===
      currentCard.word.trim().toLowerCase();
    handleAnswer(isCorrect);
    setTypedAnswer("");
  };

  if (loading) {
    return <Loading text="Preparing practice session..." variant="card" />;
  }

  if (isFinished || !currentCard) {
    return <SessionFinished onRestart={restartSession} onExit={onExit} />;
  }

  return (
    <div className="w-full max-w-2xl mx-auto min-h-[560px] flex flex-col justify-between p-4 md:p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl relative">
      {/* 1. Верхний чистый прогресс-бар */}
      <ProgressBar
        box={currentCard.box}
        stage={currentStage}
        progressPercent={progressPercent}
        onExit={onExit}
      />

      {/* 2. Центральная область карточки */}
      <PracticeCardPrompt
        card={currentCard}
        stage={currentStage}
        onPlayAudio={playAudio}
      />

      {/* 3. Варианты выполнения */}
      <div className="w-full">
        {currentStage === "typing" ? (
          <PracticeTypingStage
            value={typedAnswer}
            onChange={setTypedAnswer}
            onSubmit={submitTyped}
            onSkip={() => handleAnswer(false)}
          />
        ) : (
          <PracticeOptionsStage
            options={
              currentStage === "ru_to_en"
                ? currentCard.enOptions
                : currentCard.ruOptions
            }
            onSelect={handleAnswer}
          />
        )}
      </div>

      {/* 4. Футер */}
      <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <Sparkles size={13} className="text-indigo-400" />
          <span>Interleaved Spaced Practice</span>
        </div>
      </div>
    </div>
  );
}
