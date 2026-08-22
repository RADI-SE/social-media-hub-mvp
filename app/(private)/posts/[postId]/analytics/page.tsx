"use client";

import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { PostAnalytics } from "../../../../../components/analytics/PostAnalytics";

export default function PostAnalyticsPage() {
  const { postId } = useParams<{ postId: string }>();
  const { user } = useUser();
  const userId = user?.id;

  if (!userId) return <div>Loading user...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <PostAnalytics postId={postId} userId={userId} />
    </div>
  );
}