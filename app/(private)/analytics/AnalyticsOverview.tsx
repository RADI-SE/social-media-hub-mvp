import { Eye, Heart, MessageCircleMore, TrendingUp, Users } from "lucide-react";
import PageHeader from "@/components/hub/PageHeader";
import { analytics } from "@/components/hub/data";
import Chart from "./Chart";
import PostAnalytics from "./PostAnalytics";

const total = analytics.reduce((sum, item) => ({ impressions: sum.impressions + item.impressions, likes: sum.likes + item.likes, comments: sum.comments + item.comments, leads: sum.leads + item.leads }), { impressions: 0, likes: 0, comments: 0, leads: 0 });
const metrics = [{ label: "Impressions", value: total.impressions, icon: Eye, color: "text-blue-700 bg-blue-50" }, { label: "Likes", value: total.likes, icon: Heart, color: "text-rose-600 bg-rose-50" }, { label: "Comments", value: total.comments, icon: MessageCircleMore, color: "text-cyan-700 bg-cyan-50" }, { label: "Leads", value: total.leads, icon: Users, color: "text-violet-700 bg-violet-50" }];
export default function AnalyticsOverview() {
  return <><PageHeader eyebrow="Performance" title="Analytics" description="Mock performance metrics for the MVP demo. These values are not real platform analytics." /><div className="mb-5 flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-xs font-medium text-amber-800"><TrendingUp size={16} />Demo data only · No live social platform ingestion</div><section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(({ label, value, icon: Icon, color }) => <article key={label} className="glass-card rounded-2xl p-5"><div className="flex items-center justify-between"><span className={`grid h-10 w-10 place-items-center rounded-xl ${color}`}><Icon size={18} /></span><p className="text-[0.62rem] font-bold uppercase tracking-[0.15em] text-slate-400">Total</p></div><p className="mt-5 text-3xl font-semibold tracking-[-0.04em]">{value.toLocaleString()}</p><p className="mt-1 text-sm text-slate-500">{label}</p></article>)}</section><Chart /><PostAnalytics /></>;
}

