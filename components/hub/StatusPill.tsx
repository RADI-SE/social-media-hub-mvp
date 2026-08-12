import type { Doc } from "@/convex/_generated/dataModel";

type Status = Doc<"posts">["status"] | Doc<"comments">["classification"] | Doc<"followUpTasks">["status"];

const styles: Record<Status, string> =
  {
    Draft: "bg-slate-100 text-slate-600",
    Scheduled: "bg-blue-50 text-blue-700",
    Published: "bg-emerald-50 text-emerald-700",
    Failed: "bg-rose-100 text-rose-700",
    Lead: "bg-violet-100 text-violet-700",
    Question: "bg-sky-100 text-sky-700",
    Complaint: "bg-rose-100 text-rose-700",
    Feedback: "bg-amber-100 text-amber-800",
    Engagement: "bg-teal-100 text-teal-700",
    Other: "bg-slate-100 text-slate-600",
    Todo: "bg-slate-100 text-slate-600",
    InProgress: "bg-blue-100 text-blue-700",
    Completed: "bg-emerald-100 text-emerald-700",
  };

export default function StatusPill({ value }: { value: keyof typeof styles }) {
  const label = value === "InProgress" ? "In progress" : value;
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[value]}`}
    >
      {label}
    </span>
  );
}
