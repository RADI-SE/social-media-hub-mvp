"use client";

import Link from "next/link";
import { ArrowUpRight, LockKeyhole, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import PageHeader from "@/components/hub/PageHeader";
import type { DashboardRole } from "@/types/dashboard";

export function RoleDashboardShell({
  role,
  children,
}: {
  role: DashboardRole;
  children: React.ReactNode;
}) {
  const t = useTranslations(`growth.roleDashboards.${role}`);
  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />
      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-blue-900">
        <LockKeyhole className="mt-0.5 shrink-0" size={17} />
        <div>
          <p className="text-sm font-semibold">{t("accessLevel")}</p>
          <p className="mt-1 text-xs leading-5 text-blue-700">
            {t("accessDescription")}
          </p>
        </div>
      </div>
      {children}
    </>
  );
}

export function DashboardCard({
  icon: Icon,
  title,
  description,
  href,
  value,
  isLoading,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
  value?: string;
  isLoading?: boolean;
}) {
  const content = (
    <>
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-blue-50 text-[#3156dc] transition-transform group-hover:scale-105">
        <Icon size={20} />
      </span>
      <span className="min-w-0 flex-1">
        {isLoading ? (
          <span className="mb-2 block h-7 w-20 animate-pulse rounded-full bg-slate-100" />
        ) : (
          value && (
            <span className="mb-2 block text-2xl font-semibold text-[#071e55]">
              {value}
            </span>
          )
        )}
        <span className="block text-sm font-semibold text-[#071e55]">
          {title}
        </span>
        <span className="mt-1 block text-xs leading-5 text-slate-500">
          {description}
        </span>
      </span>
      {href && (
        <ArrowUpRight
          size={15}
          className="text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      )}
    </>
  );
  const className =
    "glass-card group flex items-start gap-4 rounded-2xl p-5 transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg";
  return href ? (
    <Link href={href} className={className}>
      {content}
    </Link>
  ) : (
    <article className={className}>{content}</article>
  );
}

// Ordinal progression (Visitor -> Customer) drawn from a single blue ramp so the
// stage order reads as magnitude, not an arbitrary category; Churned breaks out
// of the ramp entirely since it's an exit state, not a step further along it.
export const STAGE_ORDER = ["Visitor", "Lead", "MQL", "Customer", "Churned"] as const;

export const STAGE_COLORS: Record<string, string> = {
  Visitor: "#86b6ef",
  Lead: "#3987e5",
  MQL: "#1c5cab",
  Customer: "#0d366b",
  Churned: "#d03b3b",
};

export function StageBadge({ stage }: { stage: string }) {
  const color = STAGE_COLORS[stage] ?? "#898781";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{ backgroundColor: `${color}1f`, color }}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
      {stage}
    </span>
  );
}

export function StageFunnel({ counts }: { counts: Record<string, number> }) {
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
  const max = Math.max(1, ...Object.values(counts));
  const stages = STAGE_ORDER.filter((stage) => counts[stage] !== undefined);

  if (total === 0) return null;

  return (
    <div className="space-y-3">
      {stages.map((stage) => {
        const count = counts[stage] ?? 0;
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
        return (
          <div key={stage} className="flex items-center gap-3" title={`${stage}: ${count} (${pct}%)`}>
            <span className="w-20 shrink-0 text-xs font-semibold text-slate-500">{stage}</span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full transition-[width] duration-500 ease-out"
                style={{
                  width: `${Math.max(4, (count / max) * 100)}%`,
                  backgroundColor: STAGE_COLORS[stage] ?? "#898781",
                }}
              />
            </div>
            <span className="w-10 shrink-0 text-right text-xs font-semibold text-[#071e55]">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function AccessDenied() {
  const t = useTranslations("growth.roleDashboards.accessDenied");
  return (
    <div className="glass-card mx-auto max-w-xl rounded-3xl p-10 text-center">
      <LockKeyhole className="mx-auto text-slate-400" size={30} />
      <h1 className="mt-5 text-2xl font-semibold text-[#071e55]">
        {t("title")}
      </h1>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        {t("description")}
      </p>
    </div>
  );
}
