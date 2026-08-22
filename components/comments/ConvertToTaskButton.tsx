import { ArrowRight, Check, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ConvertToTaskButton({
  converted,
  loading,
  onConvert,
}: {
  converted: boolean;
  loading: boolean;
  onConvert: () => void;
}) {
  const t = useTranslations("comments");
  return (
    <button
      type="button"
      disabled={converted || loading}
      onClick={onConvert}
      className={`inline-flex min-w-44 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold disabled:cursor-not-allowed ${converted ? "bg-emerald-50 text-emerald-700" : "bg-[#173b9a] text-white hover:bg-[#0f2e7d] disabled:opacity-60"}`}
    >
      {loading ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          {t("convert")}…
        </>
      ) : converted ? (
        <>
          <Check size={16} />
          {t("converted")}
        </>
      ) : (
        <>
          {t("convert")}
          <ArrowRight size={16} />
        </>
      )}
    </button>
  );
}
