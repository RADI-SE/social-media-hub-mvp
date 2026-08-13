"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { PostComposer } from "@/components/ui/PostComposer/PostComposer";
import { publishComment } from "@/lib/api";
import { type Platform } from "@/types/social-account";

export default function CommentPage() {
  const router = useRouter();
  const { user } = useUser();
  const userId = user?.id;
  const userName = user?.fullName || user?.username || "You";

  const [isPosting, setIsPosting] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);

  const createComment = useMutation(api.comments.createComment);
  const scheduleComment = useMutation(api.comments.scheduleComment);

  const handlePost = async (content: string, _platform: Platform, targetUrl?: string) => {
    if (!userId || !targetUrl) {
      toast.error("Missing user or post URL.");
      return;
    }

    setIsPosting(true);
    const loadingToast = toast.loading("Posting comment...");

    try { 
      await publishComment(userId, targetUrl, content);
 
      await createComment({
        userId,
        targetUrl,
        authorName: userName,
        content,
        classification: "Engagement",
      });

      toast.dismiss(loadingToast);
      toast.success("Comment posted!");
      router.push("/home");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error((error as Error).message);
    } finally {
      setIsPosting(false);
    }
  };

  const handleSchedule = async (content: string, scheduledAt: number, _platform: Platform, targetUrl?: string) => {
    if (!userId || !targetUrl) {
      toast.error("Missing user or post URL.");
      return;
    }

    setIsScheduling(true);
    const loadingToast = toast.loading("Scheduling comment...");

    try {  
      await scheduleComment({
        userId,
        targetUrl,
        authorName: userName,
        content,
        scheduledAt,
        classification: "Engagement",
      });
      toast.dismiss(loadingToast);
      toast.success("Comment scheduled!");
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
      mode="comment"
      onClose={handleClose}
      onPost={handlePost}
      onSchedule={handleSchedule}
      isPosting={isPosting}
      isScheduling={isScheduling}
    />
  );
}