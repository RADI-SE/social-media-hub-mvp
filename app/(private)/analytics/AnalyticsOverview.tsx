"use client";

import { useMemo } from "react";
import { Eye, Heart, Loader2, MessageCircleMore, TrendingUp, Users } from "lucide-react";
import { useQueries, useQuery } from "convex/react";
import PageHeader from "@/components/hub/PageHeader";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import Chart from "./Chart";
import PostAnalytics from "./PostAnalytics";

export type AnalyticsRow = {
  post: Doc<"posts">;
  analytics: Doc<"analytics"> | null;
};

const emptyTotals = { impressions: 0, likes: 0, comments: 0, leads: 0 };

export default function AnalyticsOverview() {
  const user = useQuery(api.users.current);
  const posts = useQuery(
    api.posts.getPublishedPostsForUser,
    user ? { userId: user._id } : "skip",
  );

  return (
    <>
      <PageHeader
        eyebrow="Performance"
        title="Analytics"
        description="Mock performance metrics connected to your published posts."
      />
      <div className="mb-5 flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-xs font-medium text-amber-800">
        <TrendingUp size={16} />
        Demo data only · No live social platform ingestion
      </div>

      {user === undefined || (user && posts === undefined) ? (
        <LoadingState />
      ) : !user ? (
        <MessageState title="Account data is unavailable" description="Sign in again to load your analytics." />
      ) : !posts?.length ? (
        <MessageState title="No published posts yet" description="Analytics will appear after a post is published and metrics are recorded." />
      ) : (
        <AnalyticsContent posts={posts} />
      )}
    </>
  );
}

function AnalyticsContent({ posts }: { posts: Doc<"posts">[] }) {
  const analyticsQueries = useMemo(
    () => Object.fromEntries(
      posts.map((post) => [
        post._id,
        { query: api.analytics.getAnalyticsForPost, args: { postId: post._id } },
      ]),
    ),
    [posts],
  );
  const results = useQueries(analyticsQueries);

  const isLoading = posts.some((post) => results[post._id] === undefined);
  const queryError = posts.find((post) => results[post._id] instanceof Error);

  if (isLoading) return <LoadingState />;
  if (queryError) {
    return <MessageState title="Could not load analytics" description="Refresh the page and try again." error />;
  }

  const rows: AnalyticsRow[] = posts.map((post) => {
    const records = results[post._id] as Doc<"analytics">[];
    return { post, analytics: records[0] ?? null };
  });
  const totals = rows.reduce((sum, row) => {
    if (!row.analytics) return sum;
    return {
      impressions: sum.impressions + row.analytics.impressions,
      likes: sum.likes + row.analytics.likes,
      comments: sum.comments + row.analytics.comments,
      leads: sum.leads + row.analytics.leads,
    };
  }, emptyTotals);
  const metrics = [
    { label: "Impressions", value: totals.impressions, icon: Eye, color: "text-blue-700 bg-blue-50" },
    { label: "Likes", value: totals.likes, icon: Heart, color: "text-rose-600 bg-rose-50" },
    { label: "Comments", value: totals.comments, icon: MessageCircleMore, color: "text-cyan-700 bg-cyan-50" },
    { label: "Leads", value: totals.leads, icon: Users, color: "text-violet-700 bg-violet-50" },
  ];

  return (
    <>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, icon: Icon, color }) => (
          <article key={label} className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <span className={`grid h-10 w-10 place-items-center rounded-xl ${color}`}><Icon size={18} /></span>
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.15em] text-slate-400">Total</p>
            </div>
            <p className="mt-5 text-3xl font-semibold tracking-[-0.04em]">{value.toLocaleString()}</p>
            <p className="mt-1 text-sm text-slate-500">{label}</p>
          </article>
        ))}
      </section>
      <Chart rows={rows} />
      <PostAnalytics rows={rows} />
    </>
  );
}

function LoadingState() {
  return <div className="glass-card flex min-h-64 items-center justify-center rounded-3xl text-sm text-slate-500"><Loader2 size={18} className="mr-2 animate-spin" />Loading analytics…</div>;
}

function MessageState({ title, description, error = false }: { title: string; description: string; error?: boolean }) {
  return <div className="glass-card flex min-h-64 flex-col items-center justify-center rounded-3xl px-6 text-center"><TrendingUp size={24} className={error ? "text-rose-500" : "text-[#3556d9]"} /><h2 className="mt-4 font-semibold text-[#071e55]">{title}</h2><p className="mt-2 max-w-md text-sm leading-6 text-slate-500">{description}</p></div>;
}
