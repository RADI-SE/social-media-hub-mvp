"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Loader2,
  Sparkles,
} from "lucide-react";
import PageHeader from "@/components/hub/PageHeader";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { mockAnalyticsForPosts } from "@/lib/mockAnalytics";
import { DashboardStats } from "./DashboardStats";
import { RecentPosts } from "./RecentPosts";

export function HomeDashboard() {
  const { user, isLoaded } = useUser();
  const convexUser = useQuery(api.users.current);
  const posts = useQuery(
    api.posts.getPostsForUser,
    user ? { userId: user.id } : "skip",
  );
  const accounts = useQuery(
    api.socialAccounts.getAccountsForUser,
    user ? { userId: user.id } : "skip",
  );
  const tasks = useQuery(
    api.followUpTasks.getTasksForUser,
    convexUser ? { userId: convexUser._id } : "skip",
  );

  const loading =
    !isLoaded ||
    convexUser === undefined ||
    (user && (posts === undefined || accounts === undefined)) ||
    (convexUser && tasks === undefined);

  if (loading) {
    return (
      <div className="glass-card flex min-h-64 items-center justify-center rounded-3xl text-sm text-slate-500">
        <Loader2 size={18} className="mr-2 animate-spin" />
        Loading workspace…
      </div>
    );
  }
  if (!user || !convexUser) {
    return (
      <div className="glass-card rounded-3xl p-8 text-center text-sm text-slate-500">
        Sign in again to load your workspace.
      </div>
    );
  }

  return (
    <DashboardContent
      posts={posts ?? []}
      accounts={accounts ?? []}
      tasks={tasks ?? []}
    />
  );
}

function DashboardContent({
  posts,
  accounts,
  tasks,
}: {
  posts: Doc<"posts">[];
  accounts: Doc<"socialAccounts">[];
  tasks: Doc<"followUpTasks">[];
}) {
  const published = useMemo(
    () => posts.filter((post) => post.status === "Published"),
    [posts],
  );
  const scheduled = useMemo(
    () =>
      posts
        .filter((post) => post.status === "Scheduled")
        .sort((a, b) => (a.scheduledAt ?? 0) - (b.scheduledAt ?? 0)),
    [posts],
  );
  const mockAnalytics = mockAnalyticsForPosts(published).map(
    (row) => row.analytics,
  );
  const nextPost = scheduled[0];

  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title="From content to follow-up."
        description="A live publishing and follow-up overview with clearly labeled mock performance metrics."
        action={
          <Link
            href="/create/post"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173b9a] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/15 hover:-translate-y-0.5 hover:bg-[#0f2e7d]"
          >
            Create post <ArrowRight size={16} />
          </Link>
        }
      />
      <DashboardStats analytics={mockAnalytics} />
      <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <RecentPosts posts={posts.slice(0, 5)} accounts={accounts} />
        <div className="space-y-6">
          <article className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#153790] via-[#3155dc] to-[#637df7] p-6 text-white shadow-2xl shadow-blue-900/20">
            <div className="flex items-start justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15">
                <CalendarClock size={20} />
              </span>
              <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.13em]">
                Next up
              </span>
            </div>
            <p className="mt-8 text-xs font-semibold text-blue-100">
              {nextPost?.platform ?? "No scheduled platform"}
            </p>
            <p className="mt-2 text-lg font-semibold leading-7">
              {nextPost?.content ?? "No scheduled post"}
            </p>
            <p className="mt-5 text-xs text-blue-100">
              {nextPost?.scheduledAt
                ? new Intl.DateTimeFormat("en", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(nextPost.scheduledAt))
                : "Schedule a post to see it here"}
            </p>
          </article>
          <article className="glass-card rounded-3xl p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#dff9ee] text-emerald-700">
                <Sparkles size={18} />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                  Lead-to-task
                </p>
                <h2 className="text-lg font-semibold">Workflow health</h2>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between rounded-2xl bg-white/70 p-4">
              <div>
                <p className="text-2xl font-semibold">{tasks.length}</p>
                <p className="text-xs text-slate-500">Follow-up tasks</p>
              </div>
              <CheckCircle2 className="text-emerald-500" size={26} />
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
