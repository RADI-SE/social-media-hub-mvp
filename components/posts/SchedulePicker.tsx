import { CalendarClock } from "lucide-react";

export default function SchedulePicker({ value, disabled, required, onChange }: { value: string; disabled: boolean; required: boolean; onChange: (value: string) => void }) {
  return <div><label className="block text-sm font-semibold text-slate-700" htmlFor="scheduledAt">Scheduled at</label><div className="relative mt-2"><CalendarClock className="pointer-events-none absolute left-3 top-3.5 text-slate-400" size={16} /><input id="scheduledAt" type="datetime-local" value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled} required={required} className="w-full rounded-xl border border-slate-200 bg-white/80 py-3 pl-10 pr-3 text-sm disabled:bg-slate-100 disabled:text-slate-400" /></div></div>;
}

