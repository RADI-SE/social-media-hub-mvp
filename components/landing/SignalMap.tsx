import {
  BarChart3,
  CalendarCheck2,
  CheckCircle2,
  MessageCircleMore,
  Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function SignalMap() {
  const t = useTranslations("landing");
  const nodes = [
    {
      className: "signal-node signal-node-post",
      icon: CalendarCheck2,
      eyebrow: t("post"),
      label: t("scheduled"),
      detail: "12 Aug · 1:30 PM",
    },
    {
      className: "signal-node signal-node-comment",
      icon: MessageCircleMore,
      eyebrow: t("comment"),
      label: t("leadDetected"),
      detail: t("pricingRequest"),
    },
    {
      className: "signal-node signal-node-analytics",
      icon: BarChart3,
      eyebrow: t("analytics"),
      label: t("leadsCount"),
      detail: t("demoPerformance"),
    },
    {
      className: "signal-node signal-node-task",
      icon: CheckCircle2,
      eyebrow: t("followUpLabel"),
      label: t("taskCreated"),
      detail: t("contactCustomer"),
    },
  ];
  return (
    <div className="signal-map" aria-label={t("workflowPreview")}>
      <div className="signal-orbit signal-orbit-one" />
      <div className="signal-orbit signal-orbit-two" />
      <svg className="signal-lines" viewBox="0 0 620 590" aria-hidden="true">
        <defs>
          <linearGradient id="signal-gradient" x1="0" x2="1">
            <stop offset="0" stopColor="#bdf9e5" />
            <stop offset="0.55" stopColor="#6e8aff" />
            <stop offset="1" stopColor="#3156dc" />
          </linearGradient>
        </defs>
        <path d="M310 295 C215 230 170 170 132 118" />
        <path d="M310 295 C405 215 470 173 515 128" />
        <path d="M310 295 C205 365 163 415 119 467" />
        <path d="M310 295 C410 360 468 420 515 472" />
        <path
          className="signal-line-active"
          d="M132 118 C250 65 402 70 515 128 C572 250 570 368 515 472 C376 530 245 526 119 467 C69 332 73 218 132 118"
        />
      </svg>

      <div className="signal-core">
        <span className="brand-web brand-web-large" aria-hidden="true">
          <span />
        </span>
        <p>Spiders AI</p>
        <span>{t("signalHub")}</span>
      </div>

      {nodes.map(({ className, icon: Icon, eyebrow, label, detail }) => (
        <article key={eyebrow} className={className}>
          <span className="signal-node-icon">
            <Icon size={17} />
          </span>
          <div>
            <p>{eyebrow}</p>
            <strong>{label}</strong>
            <span>{detail}</span>
          </div>
        </article>
      ))}

      <div className="signal-spark signal-spark-one">
        <Sparkles size={15} />
      </div>
      <div className="signal-spark signal-spark-two">
        <Sparkles size={12} />
      </div>
    </div>
  );
}
