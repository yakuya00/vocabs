import { useState } from "react";
import { PracticeDashboardHeader } from "./practiceDashboard/PracticeDashboardHeader";
import { usePracticeDashboard } from "../hooks/usePracticeDashboard";
import { PracticeLauncer } from "./practiceDashboard/PracticeLauncher";
import { ReviewedWordsTable } from "./practiceDashboard/ReviewedWordsTable";
import { PracticeActivityChart } from "./practiceDashboard/PracticeActivityChart";
import { PracticeSession } from "./PracticeSession";

export function PracticeDashboard() {
  const {
    dueCount,
    reviewed,
    reviewedCount,
    loading,
    setLimit,
    limit,
    reloadPractice,
  } = usePracticeDashboard();

  const [isPracticing, setIsPracticing] = useState(false);
  if (isPracticing) {
    return (
      <PracticeSession
        sessionLimit={limit}
        onExit={() => {
          setIsPracticing(false);
          reloadPractice();
        }}
      />
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-10 py-4 font-sans text-slate-100">
      {/* 1. Заголовок и поздравление */}
      <PracticeDashboardHeader reviewedCount={reviewedCount} />

      {/* 2. Блок старта тренировки и настроек */}
      <PracticeLauncer
        limit={limit}
        dueCount={dueCount}
        onStart={() => {
          setIsPracticing(true);
        }}
        onChangeLimit={setLimit}
      />

      <PracticeActivityChart />

      {/* 3. Блок ежедневного графика активности */}
      {/* <div className="space-y-4">
        <h3 className="text-center text-lg font-bold text-white flex items-center justify-center gap-2">
          <Calendar size={18} className="text-indigo-400" /> Practice Every Day
        </h3>
      </div> */}

      {/* 4. Таблица выученных сегодня слов */}
      <ReviewedWordsTable reviewed={reviewed} />
    </div>
  );
}
