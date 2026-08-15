"use client";

import { useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs"; // ✅ import useAuth
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { PostComposer } from "@/components/ui/PostComposer/PostComposer";
import { publishPost } from "@/lib/api";
import { type Platform } from "@/types/social-account";

export default function CreatePage() {
  const router = useRouter();
  const { user } = useUser();
  const { getToken } = useAuth(); 
  const userId = user?.id;

  const [isPosting, setIsPosting] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);

  const schedulePost = useMutation(api.posts.schedulePost);
  const recordPublishedPost = useMutation(api.posts.recordPublishedPost);

  // --- Immediate post ---
  const handlePost = async (content: string, platform: Platform) => {
    if (!userId) {
      toast.error("You must be logged in.");
      return;
    }

    setIsPosting(true);
    const loadingToast = toast.loading("Publishing...");

    try {
     const token = (await getToken()) ?? undefined;
 
      const result = await publishPost(userId, content, token);
      if (!result.success) {
        toast.dismiss(loadingToast);
        toast.error(result.error || "Execution failed");
        return;
      }

      // 2. Save to Team DB
      await recordPublishedPost({
        userId,
        platform,
        content,
      });

      toast.dismiss(loadingToast);
      toast.success("Post published!");
      router.push("/home");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error((error as Error).message);
    } finally {
      setIsPosting(false);
    }
  };

  // --- Scheduled post ---
  const handleSchedule = async (content: string, scheduledAt: number, platform: Platform) => {
    if (!userId) {
      toast.error("You must be logged in.");
      return;
    }

    setIsScheduling(true);
    const loadingToast = toast.loading("Scheduling...");

    try {
      await schedulePost({
        userId,
        platform,
        content,
        scheduledAt,
      });
      toast.dismiss(loadingToast);
      toast.success("Post scheduled!");
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