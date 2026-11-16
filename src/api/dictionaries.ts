import { supabase } from "../supabaseClient";
import type { Dictionary } from "../types";

export type CreateDictionaryInput = {
  user_id: string;
  title: string;
  source_lang: string;
  target_lang: string;
};

export const dictionaryApi = {
  // Получить все словари пользователя
  async getDictionaries(userId: string): Promise<Dictionary[]> {
    const { data, error } = await supabase
      .from("dictionaries")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Создать новый словарь
  async create(payload: CreateDictionaryInput): Promise<Dictionary> {
    const { data, error } = await supabase
      .from("dictionaries")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
