import { supabase } from "../supabaseClient";
import type { Card } from "../types";
export type TodayReviewedCard = Pick<
  Card,
  "id" | "word" | "translation" | "next_review_at"
>;

export type CreateCardPayload = {
  dictionary_id: string;
  user_id: string;
  word: string;
  translation: string;
  context?: string;
  box: number;
  next_review_at: string;
  last_reviewed_at?: string | null;
};

export type CreateCardInput = Omit<
  Card,
  "id" | "created_at" | "last_reviewed_at"
> & {
  last_reviewed_at?: string | null;
};

export const cardsApi = {
  async getDueCards(dictionaryId: string, limit: number): Promise<Card[]> {
    const { data, error } = await supabase
      .from("cards")
      .select("*")
      .eq("dictionary_id", dictionaryId)
      .lte("next_review_at", new Date().toISOString())
      .order("box", { ascending: true })
      .limit(limit);

    if (error) throw error;

    return data || [];
  },

  async getDueCount(dictionaryId: string): Promise<number> {
    const { count, error } = await supabase
      .from("cards")
      .select("*", { count: "exact", head: true })
      .eq("dictionary_id", dictionaryId)
      .lte("next_review_at", new Date().toISOString());

    if (error) throw error;

    return count ?? 0;
  },

  async updateProgress(
    cardId: string,
    nextBox: number,
    nextReviewAt: string,
  ): Promise<void> {
    const { error } = await supabase
      .from("cards")
      .update({
        box: nextBox,
        last_reviewed_at: new Date().toISOString(),
        next_review_at: nextReviewAt,
      })
      .eq("id", cardId);

    if (error) throw error;
  },

  async getTodayReviewedCards(
    dictionaryId: string,
    sinceDate: Date = new Date(new Date().setHours(0, 0, 0, 0)),
  ): Promise<TodayReviewedCard[]> {
    const { data, error } = await supabase
      .from("cards")
      .select("id, word, translation, next_review_at")
      .eq("dictionary_id", dictionaryId)
      .gte("last_reviewed_at", sinceDate.toISOString())
      .order("last_reviewed_at", { ascending: false });

    if (error) throw error;

    return data || [];
  },

  async getByDictionary(dictionaryId: string): Promise<Card[]> {
    const { data, error } = await supabase
      .from("cards")
      .select("*")
      .eq("dictionary_id", dictionaryId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(payload: CreateCardInput): Promise<Card> {
    const { data, error } = await supabase
      .from("cards")
      .insert({
        ...payload,
        last_reviewed_at: payload.last_reviewed_at ?? null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async createMany(cardsData: CreateCardPayload[]): Promise<Card[]> {
    if (cardsData.length === 0) return [];

    const { data, error } = await supabase
      .from("cards")
      .insert(cardsData)
      .select();

    if (error) throw error;
    return data || [];
  },

  async delete(cardId: string): Promise<void> {
    const { error } = await supabase.from("cards").delete().eq("id", cardId);
    if (error) throw error;
  },
};
