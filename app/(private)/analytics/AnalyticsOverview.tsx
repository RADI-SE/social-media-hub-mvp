"use client";

import { useUser } from "@clerk/nextjs";
import {
  Eye,
  Heart,
  Loader2,
  MessageCircleMore,
  TrendingUp,
  Users,
} from "lucide-react";
import { useQuery } from "convex/react";
import PageHeader from "@/components/hub/PageHeader";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import {
  mockAnalyticsForPosts,
  type AnalyticsMetrics,
} from "@/lib/mockAnalytics";
import Chart from "./Chart";
import PostAnalytics from "./PostAnalytics";
import { useFormatter, useTranslations } from "next-intl";

export type AnalyticsRow = {
  post: Doc<"posts">;
  analytics: AnalyticsMetrics;
};

const emptyTotals = { impressions: 0, likes: 0, comments: 0, leads: 0 };

export default function AnalyticsOverview() {
  const t = useTranslations("analytics");
  const { user, isLoaded } = useUser();
  const posts = useQuery(
    api.posts.getPublishedPostsForUser,
    user ? { userId: user.id } : "skip",
  );

  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />
      <div className="mb-5 flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-xs font-medium text-amber-800">
        <TrendingUp size={16} />
        {t("mockNotice")}
      </div>

      {!isLoaded || (user && posts === undefined) ? (
        <LoadingState />
      ) : !user ? (
        <MessageState
          title={t("unavailableTitle")}
          description={t("unavailableDescription")}
        />
      ) : !posts?.length ? (
        <MessageState
          title={t("emptyTitle")}
          description={t("emptyDescription")}
        />
      ) : (
        <AnalyticsContent posts={posts} />
      )}
    </>
  );
}

function AnalyticsContent({ posts }: { posts: Doc<"posts">[] }) {
  const t = useTranslations("analytics");
  const common = useTranslations("common");
  const format = useFormatter();
  const rows: AnalyticsRow[] = mockAnalyticsForPosts(posts);
  const totals = rows.reduce((sum, row) => {
    return {
      impressions: sum.impressions + row.analytics.impressions,
      likes: sum.likes + row.analytics.likes,
      comments: sum.comments + row.analytics.comments,
      leads: sum.leads + row.analytics.leads,
    };
  }, emptyTotals);
  const metrics = [
    {
      label: t("impressions"),
      value: totals.impressions,
      icon: Eye,
      color: "text-blue-700 bg-blue-50",
    },
    {
      label: t("likes"),
      value: totals.likes,
      icon: Heart,
      color: "text-rose-600 bg-rose-50",
    },
    {
      label: t("comments"),
      value: totals.comments,
      icon: MessageCircleMore,
      color: "text-cyan-700 bg-cyan-50",
    },
    {
      label: t("leads"),
      value: totals.leads,
      icon: Users,
      color: "text-violet-700 bg-violet-50",
    },
  ];

  return (
    <>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, icon: Icon, color }) => (
          <article key={label} className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <span
                className={`grid h-10 w-10 place-items-center rounded-xl ${color}`}
              >
                <Icon size={18} />
              </span>
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.15em] text-slate-400">
                {common("total")}
              </p>
            </div>
            <p className="mt-5 text-3xl font-semibold tracking-[-0.04em]">
              {format.number(value)}
            </p>
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
  const t = useTranslations("analytics");
  return (
    <div className="glass-card flex min-h-64 items-center justify-center rounded-3xl text-sm text-slate-500">
      <Loader2 size={18} className="mr-2 animate-spin" />
      {t("loading")}
    </div>
  );
}

function MessageState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="glass-card flex min-h-64 flex-col items-center justify-center rounded-3xl px-6 text-center">
      <TrendingUp size={24} className="text-[#3556d9]" />
      <h2 className="mt-4 font-semibold text-[#071e55]">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}
