import { Eye, Heart, MessageCircleMore, Users } from "lucide-react";
import type { AnalyticsMetrics } from "@/lib/mockAnalytics";
import { useFormatter, useTranslations } from "next-intl";

export function DashboardStats({
  analytics,
}: {
  analytics: AnalyticsMetrics[];
}) {
  const t = useTranslations("analytics");
  const dashboard = useTranslations("dashboard");
  const format = useFormatter();
  const totals = analytics.reduce(
    (sum, item) => ({
      impressions: sum.impressions + item.impressions,
      likes: sum.likes + item.likes,
      comments: sum.comments + item.comments,
      leads: sum.leads + item.leads,
    }),
    { impressions: 0, likes: 0, comments: 0, leads: 0 },
  );
  const cards = [
    {
      label: t("impressions"),
      value: totals.impressions,
      icon: Eye,
      tint: "bg-blue-50 text-blue-700",
    },
    {
      label: t("likes"),
      value: totals.likes,
      icon: Heart,
      tint: "bg-rose-50 text-rose-600",
    },
    {
      label: t("comments"),
      value: totals.comments,
      icon: MessageCircleMore,
      tint: "bg-cyan-50 text-cyan-700",
    },
    {
      label: t("leads"),
      value: totals.leads,
      icon: Users,
      tint: "bg-violet-50 text-violet-700",
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ label, value, icon: Icon, tint }) => (
        <article key={label} className="glass-card rounded-2xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                {label}
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#071e55]">
                {format.number(value)}
              </p>
            </div>
            <span
              className={`grid h-10 w-10 place-items-center rounded-xl ${tint}`}
            >
              <Icon size={18} />
            </span>
          </div>
          <p className="mt-4 text-xs text-slate-400">
            {dashboard("mock")} · MVP
          </p>
        </article>
      ))}
    </section>
  );
}
