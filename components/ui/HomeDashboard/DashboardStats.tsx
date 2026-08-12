import { Eye, Heart, Loader2, MessageCircleMore, Users } from "lucide-react";

export type DashboardTotals = { impressions: number; likes: number; comments: number; leads: number };

export function DashboardStats({ totals, isLoading }: { totals: DashboardTotals; isLoading: boolean }) {
  const cards = [
    { label: "Impressions", value: totals.impressions, icon: Eye, tint: "bg-blue-50 text-blue-700" },
    { label: "Likes", value: totals.likes, icon: Heart, tint: "bg-rose-50 text-rose-600" },
    { label: "Comments", value: totals.comments, icon: MessageCircleMore, tint: "bg-cyan-50 text-cyan-700" },
    { label: "Leads", value: totals.leads, icon: Users, tint: "bg-violet-50 text-violet-700" },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ label, value, icon: Icon, tint }) => (
        <article key={label} className="glass-card rounded-2xl p-5">
          <div className="flex items-start justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</p><p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#071e55]">{isLoading ? <Loader2 size={24} className="animate-spin" /> : value.toLocaleString()}</p></div><span className={`grid h-10 w-10 place-items-center rounded-xl ${tint}`}><Icon size={18} /></span></div>
          <p className="mt-4 text-xs text-slate-400">Mock analytics · MVP demo</p>
        </article>
      ))}
    </section>
  );
}
