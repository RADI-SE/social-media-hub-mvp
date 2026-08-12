"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PostComposer } from "@/components/ui/PostComposer/PostComposer";
import { publishPost, schedulePost } from "@/lib/api";

export default function CreatePage() {
  const router = useRouter();
  const { user } = useUser();
  const userId = user?.id;

  const [isPosting, setIsPosting] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);

  const handlePost = async (content: string) => {
    if (!userId) {
      toast.error("You must be logged in.");
      return;
    }
    if (!content.trim()) {
      toast.error("Please write something.");
      return;
    }

    setIsPosting(true);
    const loadingToast = toast.loading("Publishing...");

    try {
      const data = await publishPost(userId, content);
      toast.dismiss(loadingToast);
      if (data.success) {
        toast.success("Post published successfully!");
      } else {
        toast.error(data.error || "Post failed");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error((error as Error).message);
    } finally {
      setIsPosting(false);
    }
  };

  const handleSchedule = async (content: string, scheduledAt: number) => {
    if (!userId) {
      toast.error("You must be logged in.");
      return;
    }

    setIsScheduling(true);
    const loadingToast = toast.loading("Scheduling...");

    try {
      await schedulePost(userId, content, scheduledAt);
      toast.dismiss(loadingToast);
      toast.success("Post scheduled successfully!");
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