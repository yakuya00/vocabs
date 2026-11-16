import { useState } from "react";
import { X, BookPlus, Loader2 } from "lucide-react";
import { useDictionaryContext } from "../../context/DictionaryContext";

interface CreateDictionaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English (EN)" },
  { code: "ru", label: "Русский (RU)" },
  { code: "cs", label: "Čeština (CS)" },
  { code: "de", label: "Deutsch (DE)" },
  { code: "es", label: "Español (ES)" },
  { code: "fr", label: "Français (FR)" },
];

export function CreateDictionaryModal({
  isOpen,
  onClose,
}: CreateDictionaryModalProps) {
  const { addDictionary } = useDictionaryContext();
  const [title, setTitle] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("ru");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setError("Dictionary title is required");
      return;
    }

    if (sourceLang === targetLang) {
      setError("Source and target languages must be different");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await addDictionary(cleanTitle, sourceLang, targetLang);
      setTitle("");
      onClose();
    } catch (err) {
      setError("Failed to create dictionary. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 relative">
        {/* Шапка */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5 text-white font-bold text-lg">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <BookPlus size={20} />
            </div>
            <span>New dictionary</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold block">
              Dictionary title:
            </label>
            <input
              type="text"
              autoFocus
              placeholder="e.g., B2 Phrasal Verbs or IT Vocabulary"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-white outline-none text-sm transition-all placeholder:text-slate-600"
            />
          </div>

          {/* Выбор направления языков */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <label className="text-slate-400 font-medium block">
                Language to learn:
              </label>
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-indigo-500 cursor-pointer text-xs"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400 font-medium block">
                Native language:
              </label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-indigo-500 cursor-pointer text-xs"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/30"
            >
              {isSubmitting && <Loader2 size={15} className="animate-spin" />}
              <span>Create</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
