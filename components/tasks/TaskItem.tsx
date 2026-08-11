import StatusPill from "@/components/hub/StatusPill";
import { commentFor, type FollowUpTask } from "@/components/hub/data";

export default function TaskItem({ task }: { task: FollowUpTask }) {
  const source = commentFor(task);
  return <article className="glass-card rounded-2xl p-5"><StatusPill value={task.status} /><h3 className="mt-4 text-sm font-semibold leading-6 text-[#071e55]">{task.title}</h3><div className="mt-5 border-t border-slate-100 pt-4"><p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-slate-400">Source comment</p><p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{source?.content}</p></div></article>;
}

