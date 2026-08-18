"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PostComposer } from "@/components/ui/PostComposer/PostComposer";
import { useComposerWorkflow } from "@/hooks/useComposerWorkflow";
import { publishComment } from "@/lib/api";
import { type Platform } from "@/types/social-account";

export default function CommentPage() {
  const workflow = useComposerWorkflow();
  const createComment = useMutation(api.comments.createComment);
  const scheduleComment = useMutation(api.comments.scheduleComment);
  const authorName =
    workflow.user?.fullName || workflow.user?.username || "You";

  const validate = (targetUrl?: string) => {
    if (!targetUrl) return "A Facebook post URL is required.";
  };

  const handlePost = async (
    content: string,
    _platform: Platform,
    targetUrl?: string,
  ) => {
    const userId = workflow.requireUser(validate(targetUrl));
    if (!userId || !targetUrl) return;

    await workflow.run(
      "post",
      { loading: "Posting comment...", success: "Comment posted!" },
      async () => {
        const token = (await workflow.getToken()) ?? undefined;
        await publishComment(userId, targetUrl, content, token);
        await createComment({
          userId,
          targetUrl,
          authorName,
          content,
          classification: "Engagement",
        });
      },
    );
  };

  const handleSchedule = async (
    content: string,
    scheduledAt: number,
    _platform: Platform,
    targetUrl?: string,
  ) => {
    const userId = workflow.requireUser(validate(targetUrl));
    if (!userId || !targetUrl) return;

    await workflow.run(
      "schedule",
      { loading: "Scheduling comment...", success: "Comment scheduled!" },
      async () => {
        await scheduleComment({
          userId,
          targetUrl,
          authorName,
          content,
          scheduledAt,
          classification: "Engagement",
        });
      },
    );
  };

  return (
    <PostComposer
      isOpen
      mode="comment"
      onClose={workflow.close}
      onPost={handlePost}
      onSchedule={handleSchedule}
      isPosting={workflow.isPosting}
      isScheduling={workflow.isScheduling}
    />
  );
}
