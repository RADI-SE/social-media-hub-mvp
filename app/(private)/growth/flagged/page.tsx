"use client";

import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { Loader2, Flag } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import PageHeader from "@/components/hub/PageHeader";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import CommentTable from "@/components/comments/CommentTable";
import { getSuggestedPriority } from "@/components/comments/SuggestedPriority";

type Comment = Doc<"comments">;
const EMPTY_POSTS: Doc<"posts">[] = [];
const EMPTY_TASKS: Doc<"followUpTasks">[] = [];

export default function FlaggedPage() {
  const t = useTranslations("growth.flagged");
  const commentsT = useTranslations("comments");
  const allComments = useQuery(api.comments.listAllComments);
  const user = useQuery(api.users.current);
  const tasks = useQuery(
    api.followUpTasks.getTasksForUser,
    user ? { userId: user._id } : "skip",
  );
  const createTask = useMutation(api.followUpTasks.createFollowUpTask);
  const deleteComment = useMutation(api.comments.deleteComment);
  const [pendingId, setPendingId] = useState<Id<"comments"> | null>(null);

  const flagged = useMemo(
    () =>
      (allComments ?? []).filter(
        (comment) => getSuggestedPriority(comment.classification) === "High",
      ),
    [allComments],
  );

  const handleConvert = useCallback(
    async (comment: Comment) => {
      if (!user) {
        toast.error(commentsT("accountLoading"));
        return;
      }
      setPendingId(comment._id);
      try {
        await createTask({
          commentId: comment._id,
          userId: user._id,
          title: `${commentsT("convert")}: ${comment.authorName}`,
        });
        toast.success(commentsT("taskCreated"));
      } catch (error) {
        toast.error(error instanceof Error ? error.message : commentsT("taskFailed"));
      } finally {
        setPendingId(null);
      }
    },
    [createTask, commentsT, user],
  );

  const handleDelete = useCallback(
    async (commentId: Id<"comments">) => {
      try {
        await deleteComment({ commentId });
        toast.success(commentsT("deleted"));
      } catch (error) {
        toast.error(error instanceof Error ? error.message : commentsT("deleteFailed"));
      }
    },
    [deleteComment, commentsT],
  );

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />
      {allComments === undefined || (user && tasks === undefined) ? (
        <div className="glass-card flex min-h-64 items-center justify-center rounded-3xl text-sm text-slate-500">
          <Loader2 size={18} className="mr-2 animate-spin" />
          {commentsT("loading")}
        </div>
      ) : !flagged.length ? (
        <div className="glass-card flex min-h-64 flex-col items-center justify-center rounded-3xl px-6 text-center">
          <Flag className="text-[#3556d9]" />
          <h2 className="mt-4 font-semibold text-[#071e55]">{t("emptyTitle")}</h2>
          <p className="mt-2 max-w-md text-sm text-slate-500">{t("emptyDescription")}</p>
        </div>
      ) : (
        <section className="glass-card overflow-hidden rounded-3xl">
          <CommentTable
            comments={flagged}
            posts={EMPTY_POSTS}
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
