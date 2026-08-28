"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import BrandMark from "@/components/hub/BrandMark";
import SidebarFooter from "./SidebarFooter";
import SidebarHeader from "./SidebarHeader";
import { useTranslations } from "next-intl";
import { useDashboardRole } from "@/lib/dashboard-access"; // ✅ import role hook

export default function Sidebar() {
  const t = useTranslations("sidebar");
  const common = useTranslations("common");
  const { user } = useUser();
  const userId = user?.id;
  const role = useDashboardRole(); // 🧠 get current role

  // Fetch accounts only if we have a userId (hook will still run, but we can conditionally use it)
  const accounts = useQuery(api.socialAccounts.getAccountsForUser, { userId });

  // ⏳ Optional: show a loading state for the whole sidebar while role is resolving
  if (role === null) {
    return (
      <aside className="sticky top-0 z-30 hidden h-screen w-[17.5rem] shrink-0 flex-col border-e border-white/70 bg-[#eaf8f7]/85 px-5 py-6 backdrop-blur-2xl md:flex">
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
        </div>
      </aside>
    );
  }

  // Determine if we should show the accounts section
  const showAccounts = role === "social_media_user";

  return (
    <aside className="sticky top-0 z-30 hidden h-screen w-[17.5rem] shrink-0 flex-col border-e border-white/70 bg-[#eaf8f7]/85 px-5 py-6 backdrop-blur-2xl md:flex">
      <BrandMark />
      <SidebarHeader />

      {/* 🔒 Accounts section – hidden for non-social-media users */}
      {showAccounts && (
        <section className="mt-8 rounded-2xl border border-white bg-white/55 p-3.5">
          <div className="flex items-center justify-between">
            <p className="text-[0.63rem] font-bold uppercase tracking-[0.17em] text-slate-400">
              {t("accounts")}
            </p>
            <Link
              href="/connect/social-accounts"
              className="text-[0.62rem] font-bold text-[#2854dc] hover:text-[#173b9a]"
            >
              {common("connect")}
            </Link>
          </div>
          <div className="mt-3 space-y-2.5">
            {accounts === undefined ? (
              <p className="text-xs text-slate-400">{t("loadingAccounts")}</p>
            ) : accounts.length === 0 ? (
              <p className="text-xs text-slate-400">{t("noAccounts")}</p>
            ) : (
              accounts.map((account) => (
                <div key={account._id} className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_3px_rgba(52,211,153,0.14)]" />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-slate-700">
                      {account.accountName}
                    </p>
                    <p className="text-[0.62rem] text-slate-400">
                      {account.platform}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* ✅ Footer – always visible for all roles */}
      <SidebarFooter />
    </aside>
  );
}