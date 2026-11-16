import { Search } from "lucide-react";
interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  return (
    <div className="relative w-full sm:w-80">
      <Search className="absolute left-3.5 top-3 text-slate-500" size={16} />
      <input
        type="text"
        placeholder="Search word, phrase, or context..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors"
      />
    </div>
  );
}
