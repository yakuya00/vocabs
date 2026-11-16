import { useState } from "react";
import { Toaster } from "sonner";
import { useAuth } from "./context/AuthContext";
import { AuthCard } from "./components/auth/AuthCard";
import { Dictionary } from "./components/Dictionary";
import { LogOut, BookOpen } from "lucide-react";
import { PracticeDashboard } from "./components/PracticeDashboard";

export default function App() {
  const { user, loading, error, signIn, signUp, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<"dictionary" | "training">(
    "dictionary",
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Toaster position="bottom-right" richColors />
        <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
          <AuthCard
            onLogin={signIn}
            onRegister={signUp}
            error={error}
            loading={loading}
          />
        </main>
      </>
    );
  }

  return (
    <>
      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          classNames: {
            toast: "text-base px-5 py-4 rounded-2xl shadow-xl min-w-[360px]",
            title: "font-semibold text-base",
            description: "text-sm opacity-90",
            actionButton: "px-3.5 py-2 text-sm font-semibold rounded-lg",
            cancelButton: "px-3.5 py-2 text-sm rounded-lg",
          },
        }}
      />
      <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 flex flex-col items-center font-sans">
        <div className="w-full max-w-4xl space-y-6">
          {/* Шапка */}
          <header className="flex justify-between items-center border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <BookOpen className="text-indigo-400" size={24} />
              <div>
                <h1 className="text-lg font-bold text-white">Vocabs</h1>
                <span className="text-xs text-slate-400">{user.email}</span>
              </div>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 transition-colors px-3 py-1.5 rounded-lg border border-slate-800 hover:border-rose-500/30 cursor-pointer"
            >
              <LogOut size={14} /> Sing out
            </button>
          </header>

          {/* Переключатель вкладок (Табы) */}
          <nav className="flex p-1 bg-slate-900 border border-slate-800 rounded-2xl gap-1">
            <button
              onClick={() => setActiveTab("dictionary")}
              className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-all cursor-pointer ${
                activeTab === "dictionary"
                  ? "bg-slate-800 text-white shadow-sm border border-slate-700/50"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              My Dictionary
            </button>
            <button
              onClick={() => setActiveTab("training")}
              className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-all cursor-pointer ${
                activeTab === "training"
                  ? "bg-slate-800 text-white shadow-sm border border-slate-700/50"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Training
            </button>
          </nav>

          {/* Экран 1: Мой словарь (по умолчанию) */}
          {activeTab === "dictionary" && <Dictionary />}

          {/* Экран 2: Тренировка */}
          {activeTab === "training" && <PracticeDashboard />}
        </div>
      </div>
    </>
  );
}
