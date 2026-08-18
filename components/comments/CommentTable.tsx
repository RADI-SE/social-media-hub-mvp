"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import { ExternalLink, Trash2 } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import StatusPill from "@/components/hub/StatusPill";
import DataTable, { dataTableFeatures } from "@/components/ui/DataTable";
import ConvertToTaskButton from "./ConvertToTaskButton";

type Comment = Doc<"comments">;
const column = createColumnHelper<typeof dataTableFeatures, Comment>();

interface CommentTableProps {
  comments: Comment[];
  tasks: Doc<"followUpTasks">[];
  pendingId: Id<"comments"> | null;
  onConvert: (comment: Comment) => void;
  onDelete: (commentId: Id<"comments">) => void;
}

export default function CommentTable({
  comments,
  tasks,
  pendingId,
  onConvert,
  onDelete,
}: CommentTableProps) {
  const columns = useMemo(
    () =>
      column.columns([
        column.accessor("authorName", {
          header: "Author",
          cell: ({ row }) => (
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#c4ffe6] to-[#7590ff] text-xs font-bold text-[#09276b]">
                {initials(row.original.authorName)}
              </span>
              <span className="font-semibold text-[#071e55]">
                {row.original.authorName}
              </span>
            </div>
          ),
        }),
        column.accessor("content", {
          header: "Comment",
          cell: ({ getValue }) => (
            <p
              className="max-w-md truncate text-sm text-slate-600"
              title={getValue()}
            >
              {getValue()}
            </p>
          ),
        }),
        column.accessor("classification", {
          header: "Classification",
          cell: ({ getValue }) => <StatusPill value={getValue()} />,
        }),
        column.accessor("status", {
          header: "Status",
          cell: ({ getValue }) => (
            <StatusPill value={getValue() ?? "Published"} />
          ),
        }),
        column.accessor("createdAt", {
          header: "Created",
          cell: ({ getValue }) => (
            <span className="whitespace-nowrap text-sm text-slate-500">
              {format(getValue(), "MMM d, yyyy · h:mm a")}
            </span>
          ),
        }),
        column.display({
          id: "actions",
          header: "Actions",
          cell: ({ row }) => (
            <CommentActions
              comment={row.original}
              converted={tasks.some(
                (task) => task.commentId === row.original._id,
              )}
              converting={pendingId === row.original._id}
              onConvert={() => onConvert(row.original)}
              onDelete={() => onDelete(row.original._id)}
            />
          ),
        }),
      ]),
    [onConvert, onDelete, pendingId, tasks],
  );

  return (
    <DataTable
      columns={columns}
      data={comments}
      emptyMessage="No comments yet."
      initialSorting={[{ id: "createdAt", desc: true }]}
      getRowId={(comment) => comment._id}
    />
  );
}

function CommentActions({
  comment,
  converted,
  converting,
  onConvert,
  onDelete,
}: {
  comment: Comment;
  converted: boolean;
  converting: boolean;
  onConvert: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center justify-end gap-2">
      {comment.targetUrl && (
        <a
          href={comment.targetUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="View source post"
          className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-[#2854dc]"
        >
          <ExternalLink size={15} />
        </a>
      )}
      <button
        type="button"
        onClick={onDelete}
        aria-label="Delete comment"
        className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
      >
        <Trash2 size={15} />
      </button>
      <ConvertToTaskButton
        converted={converted}
        loading={converting}
        onConvert={onConvert}
      />
    </div>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}
