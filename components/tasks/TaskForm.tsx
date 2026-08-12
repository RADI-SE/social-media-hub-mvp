import type { TaskStatus } from "@/components/hub/data";

export default function TaskForm({
  title,
  status,
  onTitleChange,
  onStatusChange,
}: {
  title: string;
  status: TaskStatus;
  onTitleChange: (value: string) => void;
  onStatusChange: (value: TaskStatus) => void;
}) {
  return (
    <div className="grid gap-4">
      <label className="text-sm font-semibold text-slate-700">
        Title
        <input
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal"
        />
      </label>
      <label className="text-sm font-semibold text-slate-700">
        Status
        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value as TaskStatus)}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal"
        >
          <option value="Todo">To do</option>
          <option value="InProgress">In progress</option>
          <option value="Completed">Completed</option>
        </select>
      </label>
    </div>
  );
}
