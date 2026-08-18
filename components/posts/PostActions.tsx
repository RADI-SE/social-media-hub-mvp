"use client";

import { useMutation } from "convex/react";
import { RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";

export default function PostActions({ post }: { post: Doc<"posts"> }) {
  const deletePost = useMutation(api.posts.deletePost);
  const retryPost = useMutation(api.posts.retryPost);
  const cancelPost = useMutation(api.posts.cancelScheduledItem);

  const run = async (action: () => Promise<unknown>, success: string) => {
    try {
      await action();
      toast.success(success);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Action failed");
    }
  };

  return (
    <div className="flex items-center gap-1">
      {post.status === "Scheduled" && (
        <ActionButton
          label="Cancel scheduled post"
          tone="text-amber-600 hover:bg-amber-50"
          onClick={() =>
            run(() => cancelPost({ postId: post._id }), "Cancelled")
          }
        >
          <Trash2 size={15} />
        </ActionButton>
      )}
      {post.status === "Failed" && (
        <ActionButton
          label="Retry post"
          tone="text-blue-600 hover:bg-blue-50"
          onClick={() =>
            run(() => retryPost({ postId: post._id }), "Will retry in 1 minute")
          }
        >
          <RotateCcw size={15} />
        </ActionButton>
      )}
      <ActionButton
        label="Delete post"
        tone="text-rose-500 hover:bg-rose-50"
        onClick={() => run(() => deletePost({ postId: post._id }), "Deleted")}
      >
        <Trash2 size={15} />
      </ActionButton>
    </div>
  );
}

function ActionButton({
  children,
  label,
  onClick,
  tone,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  tone: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`rounded-lg p-2 transition-colors ${tone}`}
    >
      {children}
    </button>
  );
}
