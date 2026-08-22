"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PostComposer } from "@/components/ui/PostComposer/PostComposer";
import { useComposerWorkflow } from "@/hooks/useComposerWorkflow";
import {
  publishComment,
  publishInstagramComment,
  scheduleComment,
} from "@/lib/api";
import { type Platform } from "@/types/social-account";
import { useTranslations } from "next-intl";

export default function CommentPage() {
  const t = useTranslations("comments");
  const workflow = useComposerWorkflow();
  const createComment = useMutation(api.comments.createComment);
  const authorName =
    workflow.user?.fullName || workflow.user?.username || "You";

  const validate = (platform?: Platform, targetUrl?: string) => {
    if (!platform) return t("selectChannel");
    if (!targetUrl) return t("urlRequired");
    try {
      const hostname = new URL(targetUrl).hostname.replace(/^www\./, "");
      const matchesPlatform =
        platform === "Instagram"
          ? hostname === "instagram.com" || hostname.endsWith(".instagram.com")
          : hostname === "facebook.com" ||
            hostname.endsWith(".facebook.com") ||
            hostname === "fb.watch";
      if (!matchesPlatform) {
        return t("wrongPlatformUrl", { platform });
      }
    } catch {
      return t("invalidUrl");
    }
  };

  const handlePost = async (
    content: string,
    platforms: Platform[],
    targetUrl?: string,
  ) => {
    const platform = platforms[0];
    const userId = workflow.requireUser(validate(platform, targetUrl));
    if (!userId || !targetUrl || !platform) return;

    await workflow.run(
      "post",
      {
        loading: t("posting", { platform }),
        success: t("posted", { platform }),
      },
      async () => {
        const token = (await workflow.getToken()) ?? undefined;
        if (platform === "Instagram") {
          await publishInstagramComment(userId, targetUrl, content, token);
        } else {
          await publishComment(userId, targetUrl, content, token);
        }
        await createComment({
          userId,
          targetUrl,
          authorName,
          content,
          classification: "Engagement",
          platform: platform === "Instagram" ? "instagram" : "facebook",
        });
      },
    );
  };

  const handleSchedule = async (
    content: string,
    scheduledAt: number,
    platforms: Platform[],
    targetUrl?: string,
  ) => {
    const platform = platforms[0];
    const userId = workflow.requireUser(validate(platform, targetUrl));
    if (!userId || !targetUrl || !platform) return;

    await workflow.run(
      "schedule",
      {
        loading: t("scheduling", { platform }),
        success: t("scheduled", { platform }),
      },
      async () => {
        const token = (await workflow.getToken()) ?? undefined;
        await scheduleComment({
          userId,
          targetUrl,
          authorName,
          content,
          scheduledAt,
          platform: platform === "Instagram" ? "instagram" : "facebook",
          classification: "Engagement",
          token,
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
