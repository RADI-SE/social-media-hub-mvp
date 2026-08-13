"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import StatusPill from "@/components/hub/StatusPill";
import type { Id } from "@/convex/_generated/dataModel";
import type { FollowUpTask, TaskStatus } from "./TaskList";

const options: Array<{ value: TaskStatus; label: string }> = [
  { value: "Todo", label: "To do" },
  { value: "InProgress", label: "In progress" },
  { value: "Completed", label: "Completed" },
];

export default function TaskItem({
  task,
  onStatusChange,
}: {
  task: FollowUpTask;
  onStatusChange: (taskId: Id<"followUpTasks">, status: TaskStatus) => Promise<void>;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleChange(status: TaskStatus) {
    setIsSaving(true);
    setError("");
    try {
      await onStatusChange(task._id, status);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not update the task.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <article className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between gap-3">
        <StatusPill value={task.status} />
        {isSaving && <Loader2 size={15} className="animate-spin text-[#3556d9]" aria-label="Updating task" />}
      </div>
      <h3 className="mt-4 text-sm font-semibold leading-6 text-[#071e55]">{task.title}</h3>
      <label htmlFor={`task-status-${task._id}`} className="mt-5 block text-[0.62rem] font-bold uppercase tracking-[0.14em] text-slate-400">Status</label>
      <select
        id={`task-status-${task._id}`}
        value={task.status}
        disabled={isSaving}
        onChange={(event) => void handleChange(event.target.value as TaskStatus)}
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      >
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      <div className="mt-5 border-t border-slate-100 pt-4">
        <p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-slate-400">Last updated</p>
        <p className="mt-2 text-xs text-slate-500">{new Date(task.updatedAt).toLocaleString()}</p>
      </div>
      {error && <p role="alert" className="mt-3 text-xs text-rose-600">{error}</p>}
    </article>
  );
}
