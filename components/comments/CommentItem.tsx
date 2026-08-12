"use client";

import { useState } from "react";
import type { Doc } from "@/convex/_generated/dataModel";
import CommentClassification from "./CommentClassification";
import ConvertToTaskButton from "./ConvertToTaskButton";

export type CommentView = Doc<"comments"> & { postContent: string };

export default function CommentItem({
  comment,
  converted,
  onConvert,
}: {
  comment: CommentView;
  converted: boolean;
  onConvert: () => Promise<unknown>;
}) {
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState("");

  async function convert() {
    setIsConverting(true);
    setError("");
    try {
      await onConvert();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not create the task.");
    } finally {
      setIsConverting(false);
    }
  }

  return (
    <article className="glass-card grid gap-5 rounded-3xl p-6 lg:grid-cols-[1fr_auto] lg:items-center">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#c4ffe6] to-[#7590ff] text-xs font-bold text-[#09276b]">
            {comment.authorName.split(" ").map((part) => part[0]).join("")}
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-[#071e55]">{comment.authorName}</p>
            <p className="max-w-64 truncate text-xs text-slate-400">{comment.postContent}</p>
          </div>
          <CommentClassification value={comment.classification} />
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-700">{comment.content}</p>
        {error && <p role="alert" className="mt-3 text-xs text-rose-600">{error}</p>}
      </div>
      <ConvertToTaskButton converted={converted} isLoading={isConverting} onConvert={() => void convert()} />
    </article>
  );
}
