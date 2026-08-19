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

export default function CreatePage() {
  const router = useRouter();
  const { user } = useUser();
  const { getToken } = useAuth();
  const userId = user?.id;

  const [isPosting, setIsPosting] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);

  const recordPublishedPost = useMutation(api.posts.recordPublishedPost);


  const handlePost = async (
    content: string,
    platform: Platform,
    _targetUrl?: string,
    image?: File,
  ) => {
    if (!userId) {
      toast.error("You must be logged in.");
      return;
    }

    setIsPosting(true);
    const loadingToast = toast.loading(`Publishing to ${platform}...`);

    try {
      const token = (await getToken()) ?? undefined;
      let imageBase64: string | undefined;
      if (image) {
        imageBase64 = await fileToBase64(image); 
      }

      let result;
      if (platform === "Instagram") {
        result = await publishInstagramPost(userId, content, token, imageBase64);
      } else {
        result = await publishPost(userId, content, token, imageBase64);
      }

      if (!result.success) {
        toast.dismiss(loadingToast);
        toast.error(result.error || "Execution failed");
        return;
      }

      await recordPublishedPost({
        userId,
        platform,
        content,
      });

      toast.dismiss(loadingToast);
      toast.success(`Post published on ${platform}!`);
      router.push("/home");
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
    platform: Platform,
    _targetUrl?: string,
    image?: File,
  ) => {
    if (!userId) {
      toast.error("You must be logged in.");
      return;
    }

    setIsScheduling(true);
    const loadingToast = toast.loading(`Scheduling on ${platform}...`);

    try {
      const token = (await getToken()) ?? undefined;
      let mediaUrl: string | undefined;

      if (image) {
        const imageBase64 = await fileToBase64(image); // ✅ uses imported helper
        mediaUrl = await uploadTempImage(imageBase64, token); // ✅ API function with token
      }

      if (platform === "Instagram" && !mediaUrl) {
        toast.dismiss(loadingToast);
        toast.error("Instagram scheduled posts require an image.");
        return;
      }

      await schedulePost({
        userId,
        content,
        scheduledAt,
        platform: platform === "Instagram" ? "instagram" : "facebook",
        mediaUrl,
        token,
      });

      toast.dismiss(loadingToast);
      toast.success(`Post scheduled on ${platform}!`);
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