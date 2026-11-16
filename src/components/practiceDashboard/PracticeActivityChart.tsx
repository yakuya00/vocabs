import { useState, useEffect, useMemo } from "react";
import { Flame, Layers, TrendingUp, CalendarCheck } from "lucide-react";
import { reviewsApi } from "../../api/reviews";
import { useAuth } from "../../context/AuthContext";
import { useDictionaryContext } from "../../context/DictionaryContext";
import {
  calculateActivityStats,
  type ReviewLog,
} from "../../utils/activityStats";

export function PracticeActivityChart() {
  const { user } = useAuth();
  const { cards } = useDictionaryContext();
  const [reviews, setReviews] = useState<ReviewLog[]>([]);

  const boxColors = [
    "bg-rose-500", // Box 1
    "bg-amber-500", // Box 2
    "bg-yellow-500", // Box 3
    "bg-blue-500", // Box 4
    "bg-emerald-500", // Box 5
  ];

  const stats = useMemo(
    () => calculateActivityStats(cards, reviews),
    [cards, reviews],
  );

  // Общее число карточек (защита от деления на 0)
  const totalCards = useMemo(() => Math.max(cards.length, 1), [cards.length]);

  // Максимум для шкалы высоты колонок (минимум 5 для адекватных пропорций)
  const maxCount = useMemo(() => {
    const counts = stats.last7Days.map((d) => d.count);
    return Math.max(...counts, 5);
  }, [stats.last7Days]);

  useEffect(() => {
    async function loadReviews() {
      if (!user?.id) return;

      try {
        const data = await reviewsApi.getRecent(user.id, 60);
        setReviews(data);
      } catch (error) {
        console.error("Ошибка загрузки reviews:", error);
        setReviews([]);
      }
    }

    loadReviews();
  }, [user?.id]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      {/* 1. Верхняя плашка: Стрик и Общая статистика */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Flame
              size={22}
              className={stats.streak > 0 ? "animate-pulse" : "opacity-60"}
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-white text-base">
              <span>{stats.streak}</span>
              <span>{stats.streak === 1 ? "day" : "days"}</span>
            </div>
            <div className="text-[11px] text-slate-400">Current streak</div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <CalendarCheck size={16} className="text-indigo-400" />
            <div>
              <span className="font-semibold text-slate-200">
                {stats.totalReviewed}
              </span>
              <span className="text-slate-500 ml-1">reviews</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Layers size={16} className="text-emerald-400" />
            <div>
              <span className="font-semibold text-slate-200">
                {cards.length}
              </span>
              <span className="text-slate-500 ml-1">total words</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. График активности за 7 дней */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-semibold text-slate-300">
            <TrendingUp size={14} className="text-indigo-400" />
            Weekly activity
          </span>
          <span className="text-[11px] text-slate-500">Words per day</span>
        </div>

        <div className="h-28 flex items-end justify-between gap-2 pt-2 px-1">
          {stats.last7Days.map((day) => {
            const heightPercent = Math.round((day.count / maxCount) * 100);

            return (
              <div
                key={day.dateStr}
                className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
              >
                <span className="text-[10px] font-bold text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity">
                  {day.count}
                </span>

                <div className="w-full max-w-[36px] bg-slate-950 rounded-lg p-0.5 h-full flex items-end">
                  <div
                    style={{ height: `${Math.max(heightPercent, 6)}%` }}
                    className={`w-full rounded-md transition-all duration-500 ${
                      day.isToday
                        ? "bg-indigo-500 shadow-lg shadow-indigo-500/30"
                        : day.count > 0
                          ? "bg-slate-700 group-hover:bg-indigo-400/80"
                          : "bg-slate-800/40"
                    }`}
                  />
                </div>

                <span
                  className={`text-[11px] font-medium ${
                    day.isToday ? "text-indigo-400 font-bold" : "text-slate-500"
                  }`}
                >
                  {day.dayLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Распределение по коробкам Лейтнера */}
      <div className="space-y-2 pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-slate-300">
            Learning stages (Leitner Boxes)
          </span>
          <span className="text-[11px] text-slate-500">
            {stats.boxCounts[5]} learned
          </span>
        </div>

        <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden flex gap-0.5 p-0.5 border border-slate-800">
          {[1, 2, 3, 4, 5].map((box) => {
            const count = stats.boxCounts[box] || 0;
            const pct = (count / totalCards) * 100;
            if (pct === 0) return null;

            return (
              <div
                key={box}
                style={{ width: `${pct}%` }}
                title={`Box ${box}: ${count} words`}
                className={`${boxColors[box - 1]} h-full rounded-xs transition-all duration-300`}
              />
            );
          })}
        </div>

        <div className="grid grid-cols-5 gap-1 pt-1 text-[10px] text-center text-slate-500">
          <div>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500 mr-1" />
            Box 1: {stats.boxCounts[1]}
          </div>
          <div>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 mr-1" />
            Box 2: {stats.boxCounts[2]}
          </div>
          <div>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-yellow-500 mr-1" />
            Box 3: {stats.boxCounts[3]}
          </div>
          <div>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mr-1" />
            Box 4: {stats.boxCounts[4]}
          </div>
          <div>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1" />
            Box 5: {stats.boxCounts[5]}
          </div>
        </div>
      </div>
    </div>
  );
}
