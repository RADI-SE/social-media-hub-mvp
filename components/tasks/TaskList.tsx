import { CheckCircle2, Circle, Clock3 } from "lucide-react";
import PageHeader from "@/components/hub/PageHeader";
import { followUpTasks } from "@/components/hub/data";
import TaskItem from "./TaskItem";

const columns = [
  { status: "Todo" as const, title: "To do", icon: Circle },
  { status: "InProgress" as const, title: "In progress", icon: Clock3 },
  { status: "Completed" as const, title: "Completed", icon: CheckCircle2 },
];
export default function TaskList() {
  return (
    <>
      <PageHeader
        eyebrow="Follow-up"
        title="Tasks"
        description="Track work created from classified comments and leads."
      />
      <section className="grid gap-5 lg:grid-cols-3">
        {columns.map(({ status, title, icon: Icon }) => {
          const items = followUpTasks.filter((task) => task.status === status);
          return (
            <div
              key={status}
              className="rounded-3xl border border-white/80 bg-white/45 p-4 backdrop-blur-xl"
            >
              <header className="flex items-center justify-between px-1 py-2">
                <div className="flex items-center gap-2">
                  <Icon size={17} className="text-[#3556d9]" />
                  <h2 className="text-sm font-semibold">{title}</h2>
                </div>
                <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-xs font-bold text-slate-500">
                  {items.length}
                </span>
              </header>
              <div className="mt-3 space-y-3">
                {items.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
}
