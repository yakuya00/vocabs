import { Plus, Upload, Loader2 } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { useDictionaryContext } from "../../context/DictionaryContext";

interface DictionaryToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenAddModal: () => void;
  onImportClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isImporting: boolean;
}

export function DictionaryToolbar({
  searchQuery,
  setSearchQuery,
  onOpenAddModal,
  onImportClick,
  fileInputRef,
  onFileChange,
  isImporting,
}: DictionaryToolbarProps) {
  const { activeDict } = useDictionaryContext();
  const hasActiveDict = Boolean(activeDict);

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-900 border border-slate-800 p-3 rounded-2xl">
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileChange}
          accept=".csv,.txt"
          className="hidden"
        />

        <button
          onClick={onImportClick}
          disabled={isImporting || !hasActiveDict}
          title="Import from CSV / TXT"
          className="flex-1 sm:flex-initial bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
        >
          {isImporting ? (
            <Loader2 className="animate-spin text-indigo-400" size={16} />
          ) : (
            <Upload size={16} />
          )}
          <span>{isImporting ? "Importing..." : "Import"}</span>
        </button>

        <button
          onClick={onOpenAddModal}
          className="flex-1 sm:flex-initial bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/20"
        >
          <Plus size={16} /> Add word
        </button>
      </div>
    </div>
  );
}
