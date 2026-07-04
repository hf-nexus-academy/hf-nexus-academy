export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-gold-500 border-t-transparent animate-spin" />
        <p className="text-xs text-ink-300">Loading...</p>
      </div>
    </div>
  );
}
