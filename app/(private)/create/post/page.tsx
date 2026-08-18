"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PostComposer } from "@/components/ui/PostComposer/PostComposer";
import { useComposerWorkflow } from "@/hooks/useComposerWorkflow";
import { publishPost } from "@/lib/api";
import { type Platform } from "@/types/social-account";

export default function CreatePage() {
  const workflow = useComposerWorkflow();
  const schedulePost = useMutation(api.posts.schedulePost);
  const recordPublishedPost = useMutation(api.posts.recordPublishedPost);

  const validate = (platform: Platform, image?: File) => {
    if (platform === "Instagram") {
      return "Instagram publishing is not connected to the server yet.";
    }
    if (image) {
      return "The publishing server still needs an image upload endpoint.";
    }
  };

  const handlePost = async (
    content: string,
    platform: Platform,
    _targetUrl?: string,
    image?: File,
  ) => {
    const userId = workflow.requireUser(validate(platform, image));
    if (!userId) return;

    await workflow.run(
      "post",
      { loading: "Publishing...", success: "Post published!" },
      async () => {
        const token = (await workflow.getToken()) ?? undefined;
        const result = await publishPost(userId, content, token);
        if (!result.success)
          throw new Error(result.error || "Execution failed");
        await recordPublishedPost({
          userId,
          platform,
          content,
        });
      },
    );
  };

  const handleSchedule = async (
    content: string,
    scheduledAt: number,
    platform: Platform,
    _targetUrl?: string,
    image?: File,
  ) => {
    const userId = workflow.requireUser(validate(platform, image));
    if (!userId) return;

    await workflow.run(
      "schedule",
      { loading: "Scheduling...", success: "Post scheduled!" },
      async () => {
        await schedulePost({
          userId,
          platform,
          content,
          scheduledAt,
        });
      },
    );
  };

  return (
    <PostComposer
      isOpen
      onClose={workflow.close}
      onPost={handlePost}
      onSchedule={handleSchedule}
      isPosting={workflow.isPosting}
      isScheduling={workflow.isScheduling}
    />
  );
}
