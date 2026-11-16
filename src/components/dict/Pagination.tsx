import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  itemsPerPage: number;
  totalFiltered: number;
  totalCards: number;
  onPageChange: (newPage: number) => void;
}

export function Pagination({
  currentPage,
  itemsPerPage,
  totalFiltered,
  totalCards,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalFiltered / itemsPerPage) || 1;

  // Индексы первого и последнего элемента на текущей странице
  const startItem =
    totalFiltered === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalFiltered);

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className="flex items-center justify-between text-xs text-slate-400 px-2 select-none">
      <span>
        Showing <b className="text-slate-200">{totalFiltered}</b> of{" "}
        {totalCards}
      </span>

      <div className="flex items-center gap-2">
        <span>
          {startItem}-{endItem}
        </span>

        <div className="flex gap-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!canGoPrev}
            className={`p-1 rounded-md bg-slate-900 border border-slate-800 transition-colors ${
              canGoPrev
                ? "text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
                : "text-slate-600 cursor-not-allowed opacity-50"
            }`}
          >
            <ChevronLeft size={14} />
          </button>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!canGoNext}
            className={`p-1 rounded-md bg-slate-900 border border-slate-800 transition-colors ${
              canGoNext
                ? "text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
                : "text-slate-600 cursor-not-allowed opacity-50"
            }`}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
