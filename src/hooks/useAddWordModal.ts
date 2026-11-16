import { useState } from "react";
import { toast } from "sonner";
import { fetchWordData } from "../utils/translator";
import { useDictionaryContext } from "../context/DictionaryContext";

export function useAddWordModal(onClose: () => void) {
  const { addCard, activeDict } = useDictionaryContext();

  const [newWord, setNewWord] = useState("");
  const [newTranslation, setNewTranslation] = useState("");
  const [newContext, setNewContext] = useState("");
  const [isSearchingApi, setIsSearchingApi] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim() || !newTranslation.trim()) return;

    setIsSaving(true);
    try {
      await addCard(newWord.trim(), newTranslation.trim(), newContext.trim());
      setNewWord("");
      setNewTranslation("");
      setNewContext("");
      onClose();
    } catch (err) {
      console.error("Error saving word:", err);
      toast.error("Error saving word.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAutoTranslate = async () => {
    if (!newWord.trim()) return;

    const data = await fetchWordData(
      newWord,
      activeDict?.source_lang,
      activeDict?.target_lang,
    ); // 1. Добавляем await

    if (data) {
      // 2. Проверяем на null
      setNewTranslation(data.translation);
      setNewContext(data.context);
    }
  };

  return {
    isSearchingApi,
    newWord,
    newTranslation,
    newContext,
    isSaving,
    setNewContext,
    setNewTranslation,
    setNewWord,
    handleSaveWord,
    handleAutoTranslate,
  };
}
