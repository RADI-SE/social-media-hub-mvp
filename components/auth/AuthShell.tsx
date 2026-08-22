import type { ReactNode } from "react";
import Link from "next/link";
import {
  BarChart3,
  CalendarCheck2,
  MessageCircleMore,
  Sparkles,
} from "lucide-react";
import BrandMark from "@/components/hub/BrandMark";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import { useTranslations } from "next-intl";

export default function AuthShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  const t = useTranslations("auth");
  const features = [
    { icon: CalendarCheck2, label: t("plan") },
    { icon: Sparkles, label: t("captions") },
    { icon: MessageCircleMore, label: t("classify") },
    { icon: BarChart3, label: t("review") },
  ];
  return (
    <main className="soft-grid min-h-screen p-4 sm:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-7xl overflow-hidden rounded-[2rem] border border-white/85 bg-white/52 shadow-[0_30px_90px_rgba(20,52,120,0.13)] backdrop-blur-2xl sm:min-h-[calc(100vh-3rem)] lg:grid-cols-[0.92fr_1.08fr]">
        <section className="relative hidden overflow-hidden bg-gradient-to-br from-[#102f7e] via-[#3156dc] to-[#6a83fa] p-10 text-white lg:flex lg:flex-col">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/15 shadow-[0_0_0_45px_rgba(255,255,255,0.05),0_0_0_90px_rgba(255,255,255,0.035)]" />
          <div className="relative z-10 w-fit rounded-2xl bg-white/92 p-3.5">
            <BrandMark href="/" />
          </div>
          <div className="relative z-10 my-auto max-w-lg py-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-100">
              {t("eyebrow")}
            </p>
            <h1 className="mt-5 text-5xl font-semibold leading-[1.02] tracking-[-0.055em]">
              {t("title")}
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-blue-100">
              {t("description")}
            </p>
            <div className="mt-10 grid grid-cols-2 gap-3">
              {features.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-2xl border border-white/12 bg-white/10 p-4 text-sm font-medium backdrop-blur-xl"
                >
                  <Icon size={17} className="text-[#bdf9e5]" />
                  {label}
                </div>
              ))}
            </div>
          </div>
          <p className="relative z-10 text-xs text-blue-100">
            Spiders AI · Your new way of working
          </p>
        </section>

        <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-16">
          <div className="w-full max-w-md">
            <div className="mb-4 flex justify-end">
              <LanguageSwitcher compact />
            </div>
            <div className="mb-8 lg:hidden">
              <BrandMark href="/" />
            </div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#3556d9]">
              {eyebrow}
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-[#071e55]">
              {title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              {description}
            </p>
            <div className="mt-8 rounded-3xl border border-white bg-white/72 p-5 shadow-[0_18px_50px_rgba(18,47,105,0.08)] sm:p-7">
              {children}
            </div>
            <Link
              href="/"
              className="mt-6 block text-center text-xs font-semibold text-slate-400 hover:text-[#173b9a]"
            >
              {t("back")}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
