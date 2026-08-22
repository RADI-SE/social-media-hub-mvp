"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { fetchPostAnalytics } from "@/lib/api";
import { useTranslations } from "next-intl";

const REFRESH_COOLDOWN_MS = 60 * 60 * 1000;

const cooldownKey = (postId: Id<"posts">) =>
  `spiders-ai:analytics-refresh:${postId}`;

export function usePostAnalytics(postId: Id<"posts">, userId: string) {
  const t = useTranslations("analytics");
  const { getToken } = useAuth();
  const analytics = useQuery(api.analytics.getLatestForPost, { postId });
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cached, setCached] = useState(false);
  const [nextRefreshAt, setNextRefreshAt] = useState(0);
  const [cooldownLoaded, setCooldownLoaded] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const stored = Number(localStorage.getItem(cooldownKey(postId)) ?? 0);
      setNextRefreshAt(Number.isFinite(stored) ? stored : 0);
      setCooldownLoaded(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [postId]);

  const analyticsNextRefreshAt = analytics
    ? analytics.scrapedAt + REFRESH_COOLDOWN_MS
    : 0;
  const effectiveNextRefreshAt = Math.max(
    nextRefreshAt,
    analyticsNextRefreshAt,
  );

  useEffect(() => {
    if (effectiveNextRefreshAt <= now) return;
    const interval = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(interval);
  }, [effectiveNextRefreshAt, now]);

  const cooldownRemaining = Math.max(0, effectiveNextRefreshAt - now);
  const canRefresh = cooldownLoaded && !refreshing && cooldownRemaining === 0;

  const refresh = async () => {
    if (!postId || !userId || !canRefresh) return;

    setRefreshing(true);
    setError(null);
    try {
      const token = (await getToken()) ?? undefined;
      const result = await fetchPostAnalytics(postId, userId, token);
      if (!result.success) {
        throw new Error(result.error || t("refreshFailed"));
      }

      const nextAllowedAt = Date.now() + REFRESH_COOLDOWN_MS;
      localStorage.setItem(cooldownKey(postId), String(nextAllowedAt));
      setNextRefreshAt(nextAllowedAt);
      setNow(Date.now());
      setCached(Boolean(result.cached));
    } catch (refreshError) {
      setError(
        refreshError instanceof Error
          ? refreshError.message
          : t("refreshFailed"),
      );
    } finally {
      setRefreshing(false);
    }
  };

  return {
    analytics: analytics ?? null,
    isInitialLoading: analytics === undefined,
    refreshing,
    error,
    cached,
    refresh,
    canRefresh,
    cooldownRemaining,
  };
}
