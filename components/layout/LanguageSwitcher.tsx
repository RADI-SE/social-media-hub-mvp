"use client";

import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { localeCookie, locales, type AppLocale } from "@/i18n/config";

export default function LanguageSwitcher({
  compact = false,
}: {
  compact?: boolean;
}) {
  const locale = useLocale();
  const t = useTranslations("language");
  const router = useRouter();

  function changeLocale(nextLocale: AppLocale) {
    document.cookie = `${localeCookie}=${nextLocale};path=/;max-age=31536000;samesite=lax`;
    router.refresh();
  }

  return (
    <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
      <Languages size={15} aria-hidden="true" />
      {!compact && <span>{t("label")}</span>}
      <select
        value={locale}
        onChange={(event) => changeLocale(event.target.value as AppLocale)}
        aria-label={t("label")}
        className="rounded-lg border border-blue-100 bg-white/80 px-2 py-1.5 text-xs font-semibold text-[#173b9a] outline-none focus:border-blue-300"
      >
        {locales.map((item) => (
          <option key={item} value={item}>
            {t(item)}
          </option>
        ))}
      </select>
    </label>
  );
}
