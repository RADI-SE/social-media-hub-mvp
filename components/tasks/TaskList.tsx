"use client";

import { CheckCircle2, Circle, Clock3, ListChecks, Loader2 } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import PageHeader from "@/components/hub/PageHeader";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import TaskItem from "./TaskItem";

export type TaskStatus = "Todo" | "InProgress" | "Completed";

const columns = [
  { status: "Todo" as const, title: "To do", icon: Circle },
  { status: "InProgress" as const, title: "In progress", icon: Clock3 },
  { status: "Completed" as const, title: "Completed", icon: CheckCircle2 },
];

export default function TaskList() {
  const user = useQuery(api.users.current);
  const tasks = useQuery(
    api.followUpTasks.getTasksForUser,
    user ? { userId: user._id } : "skip",
  );
  const updateTaskStatus = useMutation(api.followUpTasks.updateTaskStatus);

  async function changeStatus(taskId: Id<"followUpTasks">, status: TaskStatus) {
    await updateTaskStatus({ taskId, status });
  }

  return (
    <>
      <PageHeader
        eyebrow="Follow-up"
        title="Tasks"
        description="Track work created from classified comments and leads."
      />

      {user === undefined || (user && tasks === undefined) ? (
        <LoadingState />
      ) : !user ? (
        <EmptyState title="Account data is unavailable" description="Sign in again to load your follow-up tasks." />
      ) : !tasks?.length ? (
        <EmptyState title="No follow-up tasks yet" description="Convert a classified comment or lead into a task to begin tracking it here." />
      ) : (
        <section className="grid gap-5 lg:grid-cols-3">
          {columns.map(({ status, title, icon: Icon }) => {
            const items = tasks.filter((task) => task.status === status);
            return (
              <div key={status} className="rounded-3xl border border-white/80 bg-white/45 p-4 backdrop-blur-xl">
                <header className="flex items-center justify-between px-1 py-2">
                  <div className="flex items-center gap-2"><Icon size={17} className="text-[#3556d9]" /><h2 className="text-sm font-semibold">{title}</h2></div>
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-xs font-bold text-slate-500">{items.length}</span>
                </header>
                <div className="mt-3 space-y-3">
                  {items.length ? items.map((task) => (
                    <TaskItem key={task._id} task={task} onStatusChange={changeStatus} />
                  )) : (
                    <p className="rounded-2xl border border-dashed border-blue-100 px-4 py-8 text-center text-xs text-slate-400">No tasks in this stage</p>
                  )}
                </div>
              </div>
            );
          })}
        </section>
      )}
    </>
  );
}

function LoadingState() {
  return <div className="glass-card flex min-h-64 items-center justify-center rounded-3xl text-sm text-slate-500"><Loader2 size={18} className="mr-2 animate-spin" />Loading follow-up tasks…</div>;
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="glass-card flex min-h-64 flex-col items-center justify-center rounded-3xl px-6 text-center"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-[#3556d9]"><ListChecks size={22} /></span><h2 className="mt-4 font-semibold text-[#071e55]">{title}</h2><p className="mt-2 max-w-md text-sm leading-6 text-slate-500">{description}</p></div>;
}

export type FollowUpTask = Doc<"followUpTasks">;
