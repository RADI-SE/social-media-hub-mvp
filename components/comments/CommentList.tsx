"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { Loader2, MessageCircleMore, Plus } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/hub/PageHeader";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import CommentTable from "./CommentTable";

type Comment = Doc<"comments">;
const EMPTY_TASKS: Doc<"followUpTasks">[] = [];

export default function CommentList({
  comments,
}: {
  comments: Doc<"comments">[];
}) {
  const user = useQuery(api.users.current);
  const tasks = useQuery(
    api.followUpTasks.getTasksForUser,
    user ? { userId: user._id } : "skip",
  );
  const createTask = useMutation(api.followUpTasks.createFollowUpTask);
  const deleteComment = useMutation(api.comments.deleteComment);
  const [pendingId, setPendingId] = useState<Id<"comments"> | null>(null);

  const handleConvert = useCallback(
    async (comment: Comment) => {
      if (!user) {
        toast.error("Your account is still loading. Try again.");
        return;
      }
      setPendingId(comment._id);
      try {
        await createTask({
          commentId: comment._id,
          userId: user._id,
          title: `Follow up with ${comment.authorName}`,
        });
        toast.success("Follow-up task created");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Could not create task",
        );
      } finally {
        setPendingId(null);
      }
    },
    [createTask, user],
  );

  const handleDelete = useCallback(
    async (commentId: Id<"comments">) => {
      try {
        await deleteComment({ commentId });
        toast.success("Comment deleted");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Could not delete comment",
        );
      }
    },
    [deleteComment],
  );

  return (
    <>
      <PageHeader
        eyebrow="Engagement"
        title="Comments"
        description="Review stored comments, classifications, and turn a customer signal into follow-up work."
        action={
          <Link
            href="/comments/post"
            className="inline-flex items-center gap-2 rounded-xl bg-[#173b9a] px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Plus size={16} />
            New comment
          </Link>
        }
      />
      {user === undefined || (user && tasks === undefined) ? (
        <div className="glass-card flex min-h-64 items-center justify-center rounded-3xl text-sm text-slate-500">
          <Loader2 size={18} className="mr-2 animate-spin" />
          Loading comments…
        </div>
      ) : !comments.length ? (
        <div className="glass-card flex min-h-64 flex-col items-center justify-center rounded-3xl px-6 text-center">
          <MessageCircleMore className="text-[#3556d9]" />
          <h2 className="mt-4 font-semibold text-[#071e55]">No comments yet</h2>
          <p className="mt-2 max-w-md text-sm text-slate-500">
            Stored comments will appear here after they are posted or imported.
          </p>
        </div>
      ) : (
        <section className="glass-card overflow-hidden rounded-3xl">
          <CommentTable
            comments={comments}
            tasks={tasks ?? EMPTY_TASKS}
            pendingId={pendingId}
            onConvert={handleConvert}
            onDelete={handleDelete}
          />
        </section>
      )}
    </>
  );
}
