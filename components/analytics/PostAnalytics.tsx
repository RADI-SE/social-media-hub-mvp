"use client";

import {
  BarChart3,
  Clock3,
  Heart,
  Loader2,
  MessageCircleMore,
  RefreshCw,
  Share2,
  Sparkles,
  TriangleAlert,
  MessageSquare,
  Bot,
} from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel";
import { usePostAnalytics } from "@/hooks/usePostAnalytics";
import { usePostComments } from "@/hooks/usePostComments";
import { useFormatter, useTranslations } from "next-intl";

interface PostAnalyticsProps {
  postId: Id<"posts">;
  userId: string;
}

export function PostAnalytics({ postId, userId }: PostAnalyticsProps) {
  const t = useTranslations("analytics");
  const formatter = useFormatter();
  const {
    analytics,
    isInitialLoading,
    refreshing,
    error,
    cached,
    refresh,
    canRefresh,
    cooldownRemaining,
  } = usePostAnalytics(postId, userId);

  const {
    comments,
    loading: commentsLoading,
    error: commentsError,
    fetchComments,
  } = usePostComments(postId, userId);

  if (isInitialLoading) {
    return (
      <div className="glass-card flex min-h-72 items-center justify-center rounded-3xl text-sm text-slate-500">
        <Loader2 className="me-2 animate-spin" size={18} />
        {t("loadingLatest")}
      </div>
    );
  }

  const metrics = analytics
    ? [
        {
          label: t("likes"),
          value: analytics.likes,
          icon: Heart,
          tone: "bg-rose-50 text-rose-600",
        },
        {
          label: t("comments"),
          value: analytics.comments,
          icon: MessageCircleMore,
          tone: "bg-cyan-50 text-cyan-700",
        },
        {
          label: t("shares"),
          value: analytics.shares ?? 0,
          icon: Share2,
          tone: "bg-violet-50 text-violet-700",
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* ── Hero section ── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#102f7e] via-[#3156dc] to-[#7186ff] p-6 text-white shadow-2xl shadow-blue-900/20 sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full border border-white/15 shadow-[0_0_0_40px_rgba(255,255,255,0.05),0_0_0_80px_rgba(196,255,230,0.05)]" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#c4ffe6]">
              <Sparkles size={14} /> {t("liveInsights")}
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
              {t("postTitle")}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">
              {t("detailDescription")}
            </p>
          </div>
          <button
            type="button"
            onClick={refresh}
            disabled={!canRefresh}
            className="inline-flex min-w-44 items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-[#173b9a] shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:translate-y-0 disabled:bg-white/70 disabled:text-slate-500 disabled:shadow-none"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            {refreshing
              ? t("refreshing")
              : cooldownRemaining > 0
                ? cooldownRemaining >= 60 * 60 * 1000
                  ? t("cooldownHour")
                  : t("cooldownMinutes", {
                      count: Math.max(1, Math.ceil(cooldownRemaining / 60_000)),
                    })
                : t("refresh")}
          </button>
        </div>
      </section>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <TriangleAlert className="mt-0.5 flex-none" size={17} />
          <span>{error}</span>
        </div>
      )}

      {!analytics ? (
        <section className="glass-card flex min-h-64 flex-col items-center justify-center rounded-3xl px-6 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-[#3556d9]">
            <BarChart3 size={23} />
          </span>
          <h2 className="mt-4 font-semibold text-[#071e55]">
            {t("noDataTitle")}
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
            {t("noDataDescription")}
          </p>
        </section>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-3">
            {metrics.map(({ label, value, icon: Icon, tone }) => (
              <article key={label} className="glass-card rounded-2xl p-5">
                <span
                  className={`grid h-10 w-10 place-items-center rounded-xl ${tone}`}
                >
                  <Icon size={18} />
                </span>
                <p className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-[#071e55]">
                  {formatter.number(value)}
                </p>
                <p className="mt-1 text-sm text-slate-500">{label}</p>
              </article>
            ))}
          </section>

          <div className="glass-card flex flex-wrap items-center justify-between gap-3 rounded-2xl px-5 py-4 text-xs text-slate-500">
            <span className="inline-flex items-center gap-2">
              <Clock3 size={15} className="text-[#3556d9]" />
              {t("lastCollected", {
                date: formatter.dateTime(analytics.scrapedAt, {
                  dateStyle: "medium",
                  timeStyle: "short",
                }),
              })}
            </span>
            {cached && (
              <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-500">
                {t("cachedResponse")}
              </span>
            )}
          </div>
        </>
      )}

      {/* ── Comments Section ── */}
      <section className="mt-8 border-t border-slate-200 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare size={20} className="text-[#3556d9]" />
            <h2 className="text-xl font-semibold text-[#071e55]">
              {t("commentsTitle")}
            </h2>
            {comments.length > 0 && (
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                {comments.length}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fetchComments(false)}
              disabled={commentsLoading}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#173b9a] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#102f7e] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {commentsLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <MessageCircleMore size={16} />
              )}
              {commentsLoading ? t("fetchingComments") : t("fetchComments")}
            </button>
            {comments.length > 0 && (
              <button
                type="button"
                onClick={() => fetchComments(true)}
                disabled={commentsLoading}
                className="inline-flex items-center gap-1.5 rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-200 disabled:opacity-50"
              >
                <RefreshCw
                  size={14}
                  className={commentsLoading ? "animate-spin" : ""}
                />
                {t("refreshComments")}
              </button>
            )}
          </div>
        </div>

        {commentsError && (
          <div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {commentsError}
          </div>
        )}

        {comments.length === 0 && !commentsLoading && (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
            <MessageSquare className="mx-auto text-slate-300" size={32} />
            <p className="mt-2 text-sm text-slate-500">
              {t("noCommentsFetched")}
            </p>
            <p className="text-xs text-slate-400">
              {t("fetchCommentsHint")}
            </p>
          </div>
        )}

        {commentsLoading && (
          <div className="mt-6 flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-[#3556d9]" size={28} />
            <span className="ml-3 text-sm text-slate-500">
              {t("fetchingComments")}
            </span>
          </div>
        )}

        {comments.length > 0 && !commentsLoading && (
          <div className="mt-4 space-y-3">
            {comments.map((comment: any) => {
              const classification = comment.classification || "Other";
              const badgeColors: Record<string, string> = {
                Lead: "bg-green-100 text-green-800",
                Question: "bg-blue-100 text-blue-800",
                Complaint: "bg-red-100 text-red-800",
                Feedback: "bg-yellow-100 text-yellow-800",
                Engagement: "bg-purple-100 text-purple-800",
                Other: "bg-gray-100 text-gray-800",
              };
              return (
                <div
                  key={comment._id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#071e55]">
                          {comment.authorName || "Unknown"}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeColors[classification] || badgeColors.Other}`}
                        >
                          <Bot size={12} />
                          {classification}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-700 break-words">
                        {comment.content}
                      </p>
                    </div>
                    <span className="flex-none text-xs text-slate-400">
                      {formatter.dateTime(comment.createdAt, {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}