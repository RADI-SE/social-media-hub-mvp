export default function CaptionDisplay({ language, caption, onChange }: { language: "English" | "Arabic"; caption: string; onChange: (value: string) => void }) {
  return <><label className="mt-6 block text-sm font-semibold text-slate-700" htmlFor="caption">Caption</label><textarea id="caption" dir={language === "Arabic" ? "rtl" : "ltr"} value={caption} onChange={(event) => onChange(event.target.value)} rows={7} placeholder="Your generated caption will appear here." className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm leading-6 text-slate-700 placeholder:text-slate-400" /></>;
}

