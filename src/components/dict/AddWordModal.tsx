import { Sparkles, Loader2 } from "lucide-react";
import { useAddWordModal } from "../../hooks/useAddWordModal";
import { useDictionaryContext } from "../../context/DictionaryContext";

interface AddWordModalProps {
  onClose: () => void;
}

export function AddWordModal({ onClose }: AddWordModalProps) {
  const { activeDict } = useDictionaryContext();
  const {
    newWord,
    isSearchingApi,
    newTranslation,
    newContext,
    isSaving,
    setNewContext,
    setNewTranslation,
    setNewWord,
    handleSaveWord,
    handleAutoTranslate,
  } = useAddWordModal(onClose);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Add new word</h3>
          <button
            onClick={() => onClose()}
            className="text-slate-500 hover:text-white text-lg font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSaveWord} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-semibold uppercase">
              Word / Phrase ({activeDict?.source_lang.toUpperCase() || "EN"})
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                autoFocus
                placeholder="e.g. deliberate"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white outline-none focus:border-indigo-500 text-sm"
              />
              <button
                type="button"
                onClick={handleAutoTranslate}
                disabled={isSearchingApi || !newWord.trim()}
                className="bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600/50 px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <Sparkles size={14} /> {isSearchingApi ? "..." : "Translate"}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-semibold uppercase">
              Translation ({activeDict?.target_lang.toUpperCase() || "RU"})
            </label>
            <input
              type="text"
              required
              placeholder="намеренный, осознанный"
              value={newTranslation}
              onChange={(e) => setNewTranslation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white outline-none focus:border-indigo-500 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-semibold uppercase">
              Context sentence (with ____)
            </label>
            <input
              type="text"
              placeholder="It was a ______ choice"
              value={newContext}
              onChange={(e) => setNewContext(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white outline-none focus:border-indigo-500 text-sm"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => onClose()}
              className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-sm font-medium cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving && <Loader2 className="animate-spin" size={14} />}
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
