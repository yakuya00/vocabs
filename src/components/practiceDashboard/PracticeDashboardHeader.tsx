interface HeaderProps {
  reviewedCount: number;
}
export function PracticeDashboardHeader({ reviewedCount }: HeaderProps) {
  return (
    <div className="text-center space-y-1.5">
      <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
        You've Recalled {reviewedCount} Words Today. Nice Work!
      </h2>
      <p className="text-sm text-slate-400 italic">
        Don't Stop There, Keep Learning...
      </p>
    </div>
  );
}
