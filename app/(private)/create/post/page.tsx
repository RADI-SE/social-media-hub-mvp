"use client";

import { useState, useEffect } from "react";
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
import { useTranslations } from "next-intl";
import { useDashboardRole } from "@/lib/dashboard-access"; // ✅ import role hook

const formatPlatforms = (platforms: Platform[]) => platforms.join(" & ");

export default function CreatePage() {
  const t = useTranslations("composer");
  const router = useRouter();
  const { user } = useUser();
  const { getToken } = useAuth();
  const role = useDashboardRole(); // 🧠 get current role
  const userId = user?.id;

  // ✅ All hooks at the top (unconditional)
  const [isPosting, setIsPosting] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const recordPublishedPost = useMutation(api.posts.recordPublishedPost);

  // ✅ Redirect non‑social users (unconditional useEffect)
  useEffect(() => {
    if (role !== null && role !== "social_media_user") {
      router.push("/home");
    }
  }, [role, router]);

  // ⏳ Loading state while role is resolving
  if (role === null) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }
 
  if (role !== "social_media_user") {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-medium text-red-600">Access Denied</p>
      </div>
    );
  }
 
  const handlePost = async (
    content: string,
    platforms: Platform[],
    _targetUrl?: string,
    image?: File,
  ) => {
    if (!userId) {
      toast.error(t("loginRequired"));
      return;
    }

    if (platforms.length === 0) {
      toast.error(t("channelRequired"));
      return;
    }

    const platformLabel = formatPlatforms(platforms);
    setIsPosting(true);
    const loadingToast = toast.loading(
      t("publishing", { platforms: platformLabel }),
    );

    try {
      let imageBase64: string | undefined;
      if (image) {
        imageBase64 = await fileToBase64(image);
      }

      const results = await Promise.allSettled(
        platforms.map(async (platform) => {
          const token =
            (await getToken(
              platforms.length > 1 ? { skipCache: true } : undefined,
            )) ?? undefined;
          const result =
            platform === "Instagram"
              ? await publishInstagramPost(userId, content, token, imageBase64)
              : await publishPost(userId, content, token, imageBase64);

          if (!result.success) {
            throw new Error(result.error || t("publishFailed", { platform }));
          }
          if (!result.postId) {
            await recordPublishedPost({ userId, platform, content });
          }
          return platform;
        }),
      );

      toast.dismiss(loadingToast);
      const publishedPlatforms = results.flatMap((result) =>
        result.status === "fulfilled" ? [result.value] : [],
      );
      const failures = results.flatMap((result, index) =>
        result.status === "rejected"
          ? [
              `${platforms[index]}: ${
                result.reason instanceof Error
                  ? result.reason.message
                  : String(result.reason)
              }`,
            ]
          : [],
      );

      if (publishedPlatforms.length > 0) {
        toast.success(
          t("published", { platforms: formatPlatforms(publishedPlatforms) }),
        );
      }
      failures.forEach((failure) => toast.error(failure));
      if (failures.length === 0) router.push("/home");
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
      toast.error(t("loginRequired"));
      return;
    }

    if (platforms.length === 0) {
      toast.error(t("channelRequired"));
      return;
    }
    if (platforms.includes("Instagram") && !image) {
      toast.error(t("instagramImageRequired"));
      return;
    }

    const platformLabel = formatPlatforms(platforms);
    setIsScheduling(true);
    const loadingToast = toast.loading(
      t("schedulingOn", { platforms: platformLabel }),
    );

    try {
      let mediaUrl: string | undefined;

      if (image) {
        const imageBase64 = await fileToBase64(image);
        const token = (await getToken({ skipCache: true })) ?? undefined;
        mediaUrl = await uploadTempImage(imageBase64, userId, token);
        console.log(`📸 Image uploaded to temp: ${mediaUrl}`);
      }

      for (const platform of platforms) {
        const token = (await getToken({ skipCache: true })) ?? undefined;
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
      toast.success(t("scheduledOn", { platforms: platformLabel }));
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