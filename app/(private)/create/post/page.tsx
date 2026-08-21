"use client";

import { useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { PostComposer } from "@/components/ui/PostComposer/PostComposer";
import {
  publishPost,
  publishInstagramPost,
  schedulePost,
  uploadTempImage,
} from "@/lib/api";
import { fileToBase64 } from "@/lib/image";
import { type Platform } from "@/types/social-account";

const formatPlatforms = (platforms: Platform[]) => platforms.join(" & ");

export default function CreatePage() {
  const router = useRouter();
  const { user } = useUser();
  const { getToken } = useAuth();
  const userId = user?.id;

  const [isPosting, setIsPosting] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);

  const recordPublishedPost = useMutation(api.posts.recordPublishedPost);
  const updatePostUrl = useMutation(api.posts.updatePostUrl);

  const handlePost = async (
    content: string,
    platforms: Platform[],
    _targetUrl?: string,
    image?: File,
  ) => {
    if (!userId) {
      toast.error("You must be logged in.");
      return;
    }

    if (platforms.length === 0) {
      toast.error("Select at least one channel.");
      return;
    }

    const platformLabel = formatPlatforms(platforms);
    setIsPosting(true);
    const loadingToast = toast.loading(`Publishing to ${platformLabel}...`);

    try {
      const token = (await getToken()) ?? undefined;
      let imageBase64: string | undefined;
      if (image) {
        imageBase64 = await fileToBase64(image);
      }

      let hasMissingPostUrl = false;
      for (const platform of platforms) {
        const result =
          platform === "Instagram"
            ? await publishInstagramPost(userId, content, token, imageBase64)
            : await publishPost(userId, content, token, imageBase64);

        if (!result.success) {
          throw new Error(result.error || `Publishing to ${platform} failed.`);
        }

        const postId = await recordPublishedPost({ userId, platform, content });
        const postUrl =
          typeof result.postUrl === "string" ? result.postUrl : undefined;
        const platformPostId =
          typeof result.platformPostId === "string"
            ? result.platformPostId
            : undefined;

        if (postUrl) {
          await updatePostUrl({ postId, postUrl, platformPostId });
        } else {
          hasMissingPostUrl = true;
        }
      }

      toast.dismiss(loadingToast);
      if (hasMissingPostUrl) {
        toast.success(
          `Published on ${platformLabel}. Add the missing post URL to enable analytics and classification.`,
        );
        router.push("/posts");
      } else {
        toast.success(`Post published on ${platformLabel}!`);
        router.push("/home");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error((error as Error).message);
    } finally {
      setIsPosting(false);
    }
  };

  const handleSchedule = async (
    content: string,
    scheduledAt: number,
    platforms: Platform[],
    _targetUrl?: string,
    image?: File,
  ) => {
    if (!userId) {
      toast.error("You must be logged in.");
      return;
    }

    if (platforms.length === 0) {
      toast.error("Select at least one channel.");
      return;
    }
    if (platforms.includes("Instagram") && !image) {
      toast.error("Instagram scheduled posts require an image.");
      return;
    }

    const platformLabel = formatPlatforms(platforms);
    setIsScheduling(true);
    const loadingToast = toast.loading(`Scheduling on ${platformLabel}...`);

    try {
      const token = (await getToken()) ?? undefined;
      let mediaUrl: string | undefined;

      if (image) {
        const imageBase64 = await fileToBase64(image);
        mediaUrl = await uploadTempImage(imageBase64, userId, token);
        console.log(`📸 Image uploaded to temp: ${mediaUrl}`);
      }

      for (const platform of platforms) {
        await schedulePost({
          userId,
          content,
          scheduledAt,
          platform: platform === "Instagram" ? "instagram" : "facebook",
          mediaUrl,
          token,
        });
      }

      toast.dismiss(loadingToast);
      toast.success(`Post scheduled on ${platformLabel}!`);
      router.push("/home");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error((error as Error).message);
    } finally {
      setIsScheduling(false);
    }
  };

  const handleClose = () => {
    router.push("/home");
  };

  return (
    <PostComposer
      isOpen={true}
      onClose={handleClose}
      onPost={handlePost}
      onSchedule={handleSchedule}
      isPosting={isPosting}
      isScheduling={isScheduling}
    />
  );
}
