"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import CommentList from "@/components/comments/CommentList";

export default function CommentsPage() {
  const { user } = useUser();
  const userId = user?.id;

  const comments = useQuery(
    api.comments.getCommentsForUser,
    userId ? { userId } : "skip"
  );

  if (comments === undefined) {
    return <div className="p-8 text-gray-500">Loading comments…</div>;
  }

  return <CommentList comments={comments} />;
}