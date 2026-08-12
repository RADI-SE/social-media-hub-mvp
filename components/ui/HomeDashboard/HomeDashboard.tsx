"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, CalendarClock, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { useQueries, useQuery } from "convex/react";
import PageHeader from "@/components/hub/PageHeader";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { DashboardStats, type DashboardTotals } from "./DashboardStats";
import { RecentPosts } from "./RecentPosts";

export function HomeDashboard() {
  const user = useQuery(api.users.current);
  const published = useQuery(api.posts.getPublishedPostsForUser, user ? { userId: user._id } : "skip");
  const scheduled = useQuery(api.posts.getScheduledItemsForUser, user ? { userId: user._id } : "skip");
  const tasks = useQuery(api.followUpTasks.getTasksForUser, user ? { userId: user._id } : "skip");
  const accounts = useQuery(api.socialAccounts.getAccountsForUser, user ? { userId: user.clerkUserId } : "skip");

  const loading = user === undefined || Boolean(user && [published, scheduled, tasks, accounts].some((value) => value === undefined));

  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title="From content to follow-up."
        description="Your functional overview of publishing, mock performance, classified conversations, and follow-up work."
        action={<Link href="/create/post" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173b9a] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/15 hover:-translate-y-0.5 hover:bg-[#0f2e7d]">Create post <ArrowRight size={16} /></Link>}
      />

      {loading ? (
        <div className="glass-card flex min-h-64 items-center justify-center rounded-3xl text-sm text-slate-500"><Loader2 size={18} className="mr-2 animate-spin" />Loading workspace…</div>
      ) : !user ? (
        <div className="glass-card rounded-3xl p-8 text-center text-sm text-slate-500">Sign in again to load your workspace.</div>
      ) : (
        <DashboardContent published={published ?? []} scheduled={scheduled ?? []} tasks={tasks ?? []} accounts={accounts ?? []} />
      )}
    </>
  );
}

function DashboardContent({
  published,
  scheduled,
  tasks,
  accounts,
}: {
  published: Doc<"posts">[];
  scheduled: Doc<"posts">[];
  tasks: Doc<"followUpTasks">[];
  accounts: Doc<"socialAccounts">[];
}) {
  const analyticsQueries = useMemo(
    () => Object.fromEntries(published.map((post) => [post._id, { query: api.analytics.getAnalyticsForPost, args: { postId: post._id } }])),
    [published],
  );
  const analyticsResults = useQueries(analyticsQueries);
  const analyticsLoading = published.some((post) => analyticsResults[post._id] === undefined);
  const totals = published.reduce<DashboardTotals>((sum, post) => {
    const result = analyticsResults[post._id];
    if (!Array.isArray(result) || !result[0]) return sum;
    const latest = result[0] as Doc<"analytics">;
    return {
      impressions: sum.impressions + latest.impressions,
      likes: sum.likes + latest.likes,
      comments: sum.comments + latest.comments,
      leads: sum.leads + latest.leads,
    };
  }, { impressions: 0, likes: 0, comments: 0, leads: 0 });
  const allPosts = [...published, ...scheduled].sort((a, b) => b.updatedAt - a.updatedAt);
  const nextPost = [...scheduled]
    .filter((post) => post.scheduledAt !== undefined)
    .sort((a, b) => (a.scheduledAt ?? 0) - (b.scheduledAt ?? 0))[0];
  const accountFor = (post: Doc<"posts">) => accounts.find((account) => account._id === post.socialAccountId);

  return (
    <>
      <DashboardStats totals={totals} isLoading={analyticsLoading} />
      <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <RecentPosts posts={allPosts.slice(0, 5)} accounts={accounts} />
        <div className="space-y-6">
          <article className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#153790] via-[#3155dc] to-[#637df7] p-6 text-white shadow-2xl shadow-blue-900/20">
            <div className="flex items-start justify-between"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15"><CalendarClock size={20} /></span><span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.13em]">Next up</span></div>
            <p className="mt-8 text-xs font-semibold text-blue-100">{nextPost ? accountFor(nextPost)?.platform ?? "Connected account" : "No scheduled post"}</p>
            <p className="mt-2 text-lg font-semibold leading-7">{nextPost?.content ?? "Schedule a post to see it here."}</p>
            <p className="mt-5 text-xs text-blue-100">{nextPost?.scheduledAt ? new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(nextPost.scheduledAt)) : "Nothing scheduled"}</p>
          </article>
          <article className="glass-card rounded-3xl p-6">
            <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#dff9ee] text-emerald-700"><Sparkles size={18} /></span><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Lead-to-task</p><h2 className="text-lg font-semibold">Workflow health</h2></div></div>
            <div className="mt-5 flex items-center justify-between rounded-2xl bg-white/70 p-4"><div><p className="text-2xl font-semibold">{tasks.length}</p><p className="text-xs text-slate-500">Follow-up tasks</p></div><CheckCircle2 className="text-emerald-500" size={26} /></div>
          </article>
        </div>
      </section>
    </>
  );
}
