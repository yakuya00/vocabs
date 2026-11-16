import { useState } from "react";
import { Plus } from "lucide-react";
import { Filter } from "lucide-react";
import { useDictionaryContext } from "../../context/DictionaryContext";
import { CreateDictionaryModal } from "./CreateDictionaryModal";

export function Sidebar() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { dictionaries, activeDict, cards, setActiveDict } =
    useDictionaryContext();
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "learning" | "learned"
  >("all");

  return (
    <aside className="w-full md:w-56 bg-slate-900 border border-slate-800 rounded-2xl p-4 shrink-0 space-y-6">
      {/* Выбор словаря */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Current dictionary
          </label>
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1 text-[11px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer p-0.5"
            title="Create new dictionary"
          >
            <Plus size={14} />
            <span>New</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={activeDict?.id || ""}
            onChange={(e) => {
              const selected = dictionaries.find(
                (d) => d.id === e.target.value,
              );
              if (selected) setActiveDict(selected);
            }}
            className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2.5 text-white outline-none focus:border-indigo-500 cursor-pointer"
          >
            {dictionaries.map((d) => (
              <option key={d.id} value={d.id}>
                {d.title} ({d.source_lang?.toUpperCase()} →{" "}
                {d.target_lang?.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        <CreateDictionaryModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
        />
      </div>

      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-2 flex items-center gap-2">
          <Filter size={14} /> Filters
        </h3>
        <nav className="space-y-1 text-sm">
          {[
            { id: "all", label: "All words", count: cards.length },
            {
              id: "learning",
              label: "In progress",
              count: cards.filter((c) => c.box < 4).length,
            },
            {
              id: "learned",
              label: "Learned",
              count: cards.filter((c) => c.box >= 4).length,
            },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedFilter(item.id as any)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors text-left cursor-pointer ${
                selectedFilter === item.id
                  ? "bg-indigo-600/20 text-indigo-400 font-semibold border border-indigo-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <span>{item.label}</span>
              <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full text-slate-400 border border-slate-700/50">
                {item.count}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
