import { accountFor, analytics, posts } from "@/components/hub/data";

export default function Chart() {
  const max = Math.max(...analytics.map((item) => item.impressions));
  return <section className="glass-card mt-6 rounded-3xl p-6 sm:p-8"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#3556d9]">Post comparison</p><h2 className="mt-1 text-xl font-semibold">Impressions by post</h2></div><div className="mt-8 space-y-7">{analytics.map((item) => { const post = posts.find((candidate) => candidate.id === item.postId); const width = max ? Math.max((item.impressions / max) * 100, item.impressions ? 4 : 0) : 0; return <div key={item.id} className="grid gap-3 sm:grid-cols-[10rem_1fr_5rem] sm:items-center"><div><p className="text-sm font-semibold text-slate-700">{post ? accountFor(post)?.platform : item.postId}</p><p className="text-xs text-slate-400">{item.postId}</p></div><div className="h-3 overflow-hidden rounded-full bg-blue-50"><div className="h-full rounded-full bg-gradient-to-r from-[#173b9a] to-[#6b84ff]" style={{ width: `${width}%` }} /></div><p className="text-right text-sm font-semibold">{item.impressions.toLocaleString()}</p></div>; })}</div></section>;
}

