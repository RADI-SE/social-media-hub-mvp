"use client";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import CaptionDisplay from "./CaptionDisplay";

type Language = "English" | "Arabic";
const suggestions = {
  English:
    "From conversation to action - plan, monitor, and follow up in one focused workspace.",
  Arabic: "من المحادثة إلى الإنجاز - خطط وراقب وتابع أعمالك في مساحة واحدة.",
};
export default function AICaptionGenerator() {
  const [language, setLanguage] = useState<Language>("English");
  const [caption, setCaption] = useState("");
  return (
    <aside className="glass-card h-fit rounded-3xl p-6 sm:p-8">
      <div className="mb-7 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-violet-700">
          <Sparkles size={18} />
        </span>
        <div>
          <h2 className="font-semibold">AI caption</h2>
          <p className="text-xs text-slate-500">English and Arabic demo</p>
        </div>
      </div>
      <p className="text-sm font-semibold text-slate-700">Language</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {(["English", "Arabic"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setLanguage(item)}
            className={`rounded-xl border px-4 py-3 text-sm font-semibold ${language === item ? "border-[#3556d9] bg-blue-50 text-[#173b9a]" : "border-slate-200 bg-white/70 text-slate-500"}`}
          >
            {item}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setCaption(suggestions[language])}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#173b9a] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0f2e7d]"
      >
        <Sparkles size={16} />
        Generate caption
      </button>
      <CaptionDisplay
        language={language}
        caption={caption}
        onChange={setCaption}
      />
      <p className="mt-3 text-xs leading-5 text-slate-400">
        The caption is stored with the post ID and selected language.
      </p>
    </aside>
  );
}
