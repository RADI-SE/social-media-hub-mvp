"use client";

import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import type { Id } from "@/convex/_generated/dataModel";
import { PostAnalytics } from "../../../../../components/analytics/PostAnalytics";
import { useTranslations } from "next-intl";

export default function PostAnalyticsPage() {
  const t = useTranslations("analytics");
  const { postId } = useParams<{ postId: string }>();
  const { user } = useUser();
  const userId = user?.id;

  if (!userId) return <div>{t("loadingUser")}</div>;

  return (
    <div className="mx-auto max-w-5xl p-6 sm:p-8">
      <PostAnalytics postId={postId as Id<"posts">} userId={userId} />
    </div>
  );
}
