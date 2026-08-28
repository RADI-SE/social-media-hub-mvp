"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Bell, AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import { DashboardCard } from "@/components/growth/DashboardPrimitives";

export default function AlertsPage() {
  const t = useTranslations("growth.roleDashboards.cmo");
  const accounts = useQuery(api.growth.listAccountsForOwner);

  const highIntentAccounts = accounts?.filter((acc) => (acc.intentScore ?? 0) > 80) ?? [];
  const activeAccounts = accounts?.filter((acc) => acc.stage !== "Churned") ?? [];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t("executiveAlerts")}</h1>
        <p className="text-sm text-slate-500">{t("accessDescription")}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <DashboardCard icon={Bell} title={t("executiveAlerts")} description="" value={String(highIntentAccounts.length)} />
        <DashboardCard icon={AlertTriangle} title="Active accounts" description="" value={String(activeAccounts.length)} />
      </div>
      <div className="glass-card rounded-3xl p-6">
        <h2 className="font-semibold text-[#071e55] mb-4">High intent accounts</h2>
        <ul className="space-y-3">
          {highIntentAccounts.length === 0 ? (
            <li className="text-sm text-slate-500">{t("noAlerts")}</li>
          ) : (
            highIntentAccounts.map((acc) => (
              <li key={acc._id} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white/70 p-4">
                <div>
                  <p className="text-sm font-semibold text-[#071e55]">{acc.name}</p>
                  <p className="mt-1 text-xs text-slate-500">Intent score: {acc.intentScore}</p>
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">High</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}