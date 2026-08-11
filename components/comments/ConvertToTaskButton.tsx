import { ArrowRight, Check } from "lucide-react";

export default function ConvertToTaskButton({ converted, onConvert }: { converted: boolean; onConvert: () => void }) {
  return <button type="button" disabled={converted} onClick={onConvert} className={`inline-flex min-w-44 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ${converted ? "bg-emerald-50 text-emerald-700" : "bg-[#173b9a] text-white hover:bg-[#0f2e7d]"}`}>{converted ? <><Check size={16} />Task created</> : <>Convert to task<ArrowRight size={16} /></>}</button>;
}

