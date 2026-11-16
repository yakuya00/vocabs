import { supabase } from "../supabaseClient";
import type { ReviewLog } from "../utils/activityStats";

export interface CreateReviewInput {
  card_id: string;
  user_id: string;
  stage: number;
  correct: boolean;
}

export const reviewsApi = {
  // Записать результат повторения карточки
  async create(payload: CreateReviewInput): Promise<void> {
    const { error } = await supabase.from("reviews").insert(payload);

    if (error) throw error;
  },

  // Получить историю повторений за последние N дней (для графика и стрика)
  async getRecent(userId: string, days = 60): Promise<ReviewLog[]> {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - days);

    const { data, error } = await supabase
      .from("reviews")
      .select("id, card_id, correct, created_at")
      .eq("user_id", userId)
      .gte("created_at", pastDate.toISOString())
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },
};
