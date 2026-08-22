import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckSquare2,
  MessageCircleMore,
  Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function WorkflowRail() {
  const t = useTranslations("landing");
  const steps = [
    { icon: CalendarDays, number: "01", title: t("plan"), text: t("planText") },
    {
      icon: Sparkles,
      number: "02",
      title: t("generate"),
      text: t("generateText"),
    },
    {
      icon: BarChart3,
      number: "03",
      title: t("understand"),
      text: t("understandText"),
    },
    {
      icon: MessageCircleMore,
      number: "04",
      title: t("classify"),
      text: t("classifyText"),
    },
    {
      icon: CheckSquare2,
      number: "05",
      title: t("followUp"),
      text: t("followUpText"),
    },
  ];
  return (
    <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-10 lg:px-16">
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#3556d9]">
            {t("workflow")}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#071e55] sm:text-3xl">
            {t("workflowTitle")}
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-6 text-slate-500">
          {t("workflowDescription")}
        </p>
      </div>
      <div className="landing-rail">
        {steps.map(({ icon: Icon, number, title, text }, index) => (
          <div key={title} className="landing-step">
            <div className="flex items-start justify-between">
              <span className="landing-step-icon">
                <Icon size={18} />
              </span>
              <span className="text-[0.62rem] font-bold tracking-[0.16em] text-slate-300">
                {number}
              </span>
            </div>
            <h3>{title}</h3>
            <p>{text}</p>
            {index < steps.length - 1 && (
              <ArrowRight className="landing-step-arrow" size={16} />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
