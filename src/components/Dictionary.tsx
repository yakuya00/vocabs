import { useDictionaryPage } from "../hooks/useDictionaryPage";
import { Sidebar } from "./dict/Sidebar";
import { DictionaryToolbar } from "./dict/DictionaryToolbar";
import { Pagination } from "./dict/Pagination";
import { WordList } from "./dict/WordList";
import { AddWordModal } from "./dict/AddWordModal";

export function Dictionary() {
  const page = useDictionaryPage();

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 items-start">
      <Sidebar />

      <div className="flex-1 w-full space-y-4">
        <DictionaryToolbar
          searchQuery={page.searchQuery}
          setSearchQuery={page.setSearchQuery}
          onOpenAddModal={() => page.setIsAddOpen(true)}
          onImportClick={() => page.fileInputRef.current?.click()}
          fileInputRef={page.fileInputRef}
          onFileChange={page.handleFileImport}
          isImporting={page.isImporting}
        />

        <Pagination
          currentPage={page.currentPage}
          itemsPerPage={page.itemsPerPage}
          totalFiltered={page.filteredCards.length}
          totalCards={page.totalCardsCount}
          onPageChange={page.setCurrentPage}
        />

        <WordList
          cards={page.paginatedCards}
          onDeleteCard={page.handleDelete}
          onOpenAddModal={() => page.setIsAddOpen(true)}
        />
      </div>

      {page.isAddOpen && (
        <AddWordModal onClose={() => page.setIsAddOpen(false)} />
      )}
    </div>
  );
}
