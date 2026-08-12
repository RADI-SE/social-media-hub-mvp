import type { AnalyticsRow } from "./AnalyticsOverview";

export default function Chart({ rows }: { rows: AnalyticsRow[] }) {
  const max = Math.max(0, ...rows.map((row) => row.analytics?.impressions ?? 0));

  return (
    <section className="glass-card mt-6 rounded-3xl p-6 sm:p-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#3556d9]">Post comparison</p>
        <h2 className="mt-1 text-xl font-semibold">Impressions by post</h2>
      </div>
      <div className="mt-8 space-y-7">
        {rows.map(({ post, analytics }) => {
          const impressions = analytics?.impressions ?? 0;
          const width = max ? Math.max((impressions / max) * 100, impressions ? 4 : 0) : 0;
          return (
            <div key={post._id} className="grid gap-3 sm:grid-cols-[10rem_1fr_5rem] sm:items-center">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-700">{post.content}</p>
                <p className="text-xs text-slate-400">{new Date(post.publishedAt ?? post.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-blue-50"><div className="h-full rounded-full bg-gradient-to-r from-[#173b9a] to-[#6b84ff]" style={{ width: `${width}%` }} /></div>
              <p className="text-right text-sm font-semibold">{impressions.toLocaleString()}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
