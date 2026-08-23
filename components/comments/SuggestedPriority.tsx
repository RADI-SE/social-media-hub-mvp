"use client";

import { useTranslations } from "next-intl";

export const suggestedPriorities = ["High", "Medium", "Low"] as const;
export type SuggestedPriority = (typeof suggestedPriorities)[number];

const priorityByClassification: Record<string, SuggestedPriority> = {
  Lead: "High",
  Complaint: "High",
  Question: "Medium",
  Feedback: "Medium",
  Engagement: "Low",
  Other: "Low",
};

const labelKeys = {
  High: "priorityHigh",
  Medium: "priorityMedium",
  Low: "priorityLow",
} as const;

const reasonKeys = {
  Lead: "priorityReasonLead",
  Complaint: "priorityReasonComplaint",
  Question: "priorityReasonQuestion",
  Feedback: "priorityReasonFeedback",
  Engagement: "priorityReasonEngagement",
  Other: "priorityReasonOther",
} as const;

const styles: Record<SuggestedPriority, string> = {
  High: "bg-rose-100 text-rose-700 ring-rose-200",
  Medium: "bg-amber-100 text-amber-800 ring-amber-200",
  Low: "bg-slate-100 text-slate-600 ring-slate-200",
};

export function getSuggestedPriority(classification?: string) {
  return priorityByClassification[classification ?? "Other"] ?? "Low";
}

export default function SuggestedPriorityBadge({
  classification,
  showReason = true,
}: {
  classification?: string;
  showReason?: boolean;
}) {
  const t = useTranslations("comments");
  const category = classification ?? "Other";
  const priority = getSuggestedPriority(category);
  const reasonKey =
    reasonKeys[category as keyof typeof reasonKeys] ?? reasonKeys.Other;

  return (
    <div
      className="min-w-28 text-start"
      title={`${t("priorityFrontendOnly")} ${t(reasonKey)}`}
    >
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${styles[priority]}`}
      >
        {t(labelKeys[priority])}
      </span>
      {showReason && (
        <p className="mt-1.5 max-w-36 text-[0.68rem] leading-4 text-slate-500">
          {t(reasonKey)}
        </p>
      )}
    </div>
  );
}
