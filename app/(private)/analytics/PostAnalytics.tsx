import { analytics } from "@/components/hub/data";

export default function PostAnalytics() {
  return <section className="mt-6 overflow-hidden rounded-3xl border border-white/80 bg-white/55"><div className="grid grid-cols-5 border-b border-slate-100 px-6 py-4 text-[0.62rem] font-bold uppercase tracking-[0.13em] text-slate-400"><span>Post</span><span>Impressions</span><span>Likes</span><span>Comments</span><span>Leads</span></div>{analytics.map((item) => <div key={item.id} className="grid grid-cols-5 px-6 py-4 text-sm text-slate-600 odd:bg-white/35"><span className="font-semibold text-[#173b9a]">{item.postId}</span><span>{item.impressions.toLocaleString()}</span><span>{item.likes.toLocaleString()}</span><span>{item.comments.toLocaleString()}</span><span>{item.leads.toLocaleString()}</span></div>)}</section>;
}

