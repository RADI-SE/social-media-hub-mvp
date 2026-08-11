import { currentUser } from "@/components/hub/data";

export default function SidebarFooter() {
  return (
    <footer className="mt-auto border-t border-[#173b9a]/10 pt-5">
      <div className="flex items-center gap-3 rounded-2xl bg-white/65 p-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#c4ffe6] to-[#486bf5] text-xs font-bold text-[#09276b]">
          {currentUser.name
            .split(" ")
            .map((part) => part[0])
            .join("")}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#09276b]">{currentUser.name}</p>
          <p className="truncate text-[0.68rem] text-slate-500">{currentUser.email}</p>
        </div>
      </div>
      <p className="mt-3 text-center text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-slate-400">
        Functional MVP · Demo data
      </p>
    </footer>
  );
}

