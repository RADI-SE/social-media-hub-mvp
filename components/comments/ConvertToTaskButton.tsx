import { ArrowRight, Check, Loader2 } from "lucide-react";

export default function ConvertToTaskButton({
  converted,
  isLoading,
  onConvert,
}: {
  converted: boolean;
  isLoading: boolean;
  onConvert: () => void;
}) {
  return (
    <button
      type="button"
      disabled={converted || isLoading}
      onClick={onConvert}
      className={`inline-flex min-w-44 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold disabled:cursor-not-allowed ${converted ? "bg-emerald-50 text-emerald-700" : "bg-[#173b9a] text-white hover:bg-[#0f2e7d] disabled:opacity-60"}`}
    >
      {converted ? <><Check size={16} />Task created</> : isLoading ? <><Loader2 size={16} className="animate-spin" />Creating…</> : <>Convert to task<ArrowRight size={16} /></>}
    </button>
  );
}
