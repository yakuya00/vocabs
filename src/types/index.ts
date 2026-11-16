export interface Profile {
  id: string;
  email: string;
  is_pro: boolean;
  created_at: string;
}

export interface Dictionary {
  id: string;
  user_id: string;
  title: string;
  source_lang: string;
  target_lang: string;
  created_at: string;
}

export interface Card {
  id: string;
  dictionary_id: string;
  user_id: string;
  word: string;
  translation: string;
  context: string | null;
  audio_url: string | null;
  box: number;
  next_review_at: string;
  last_reviewed_at: string | null;
  created_at: string;
}

export interface ReviewedWord {
  id: string;
  word: string;
  translation: string;
  nextDue: string;
}
