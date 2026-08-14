import { ExternalLink, Trash2 } from "lucide-react";
import type { Doc } from "@/convex/_generated/dataModel";
import CommentClassification from "./CommentClassification";
import ConvertToTaskButton from "./ConvertToTaskButton";

export default function CommentItem({
  comment,
  converted,
  converting,
  onConvert,
  onDelete,
}: {
  comment: Doc<"comments">;
  converted: boolean;
  converting: boolean;
  onConvert: () => void;
  onDelete: () => void;
}) {
  const initials = comment.authorName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <article className="glass-card grid gap-5 rounded-3xl p-6 lg:grid-cols-[1fr_auto] lg:items-center">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#c4ffe6] to-[#7590ff] text-xs font-bold text-[#09276b]">
            {initials}
          </span>
          <div>
            <p className="font-semibold text-[#071e55]">{comment.authorName}</p>
            <p className="text-xs text-slate-400">
              {comment.postId
                ? `Post ${comment.postId}`
                : comment.targetUrl
                  ? "External Facebook post"
                  : "Stored comment"}
            </p>
          </div>
          <CommentClassification value={comment.classification} />
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-700">
          {comment.content}
        </p>
        <div className="mt-4 flex items-center gap-3 text-xs">
          {comment.targetUrl && (
            <a
              href={comment.targetUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-[#2854dc] hover:text-[#173b9a]"
            >
              <ExternalLink size={13} />
              View source post
            </a>
          )}
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center gap-1 text-slate-400 hover:text-rose-600"
          >
            <Trash2 size={13} />
            Delete
          </button>
        </div>
      </div>
      <ConvertToTaskButton
        converted={converted}
        loading={converting}
        onConvert={onConvert}
      />
    </article>
  );
}
