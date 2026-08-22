import type { AnalyticsRow } from "./AnalyticsOverview";

export default function PostAnalytics({ rows }: { rows: AnalyticsRow[] }) {
  return (
    <section className="mt-6 overflow-x-auto rounded-3xl border border-white/80 bg-white/55">
      <div className="min-w-[680px]">
        <div className="grid grid-cols-[2fr_repeat(4,1fr)] border-b border-slate-100 px-6 py-4 text-[0.62rem] font-bold uppercase tracking-[0.13em] text-slate-400">
          <span>Published post</span>
          <span>Impressions</span>
          <span>Likes</span>
          <span>Comments</span>
          <span>Leads</span>
        </div>
        {rows.map(({ post, analytics }) => (
          <div
            key={post._id}
            className="grid grid-cols-[2fr_repeat(4,1fr)] px-6 py-4 text-sm text-slate-600 odd:bg-white/35"
          >
            <span className="truncate pr-5 font-semibold text-[#173b9a]">
              {post.content}
            </span>
            <span>{(analytics?.impressions ?? 0).toLocaleString()}</span>
            <span>{(analytics?.likes ?? 0).toLocaleString()}</span>
            <span>{(analytics?.comments ?? 0).toLocaleString()}</span>
            <span>{(analytics?.leads ?? 0).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
