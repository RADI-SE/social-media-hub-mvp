"use client";

import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { Id } from "@/convex/_generated/dataModel";
import { PostAnalytics } from "../../../../../components/analytics/PostAnalytics";
import { useTranslations } from "next-intl";
import { useDashboardRole } from "@/lib/dashboard-access";

export default function PostAnalyticsPage() {
  const t = useTranslations("analytics");
  const { postId } = useParams<{ postId: string }>();
  const { user } = useUser();
  const userId = user?.id;
  const role = useDashboardRole();
  const router = useRouter();
 
  useEffect(() => {
    if (role !== null && role !== "social_media_user") {
      router.push("/home");
    }
  }, [role, router]);
 
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
 
  if (!userId) {
    return <div className="p-8 text-gray-500">{t("loadingUser")}</div>;
  }

  return (
    <div className="mx-auto max-w-5xl p-6 sm:p-8">
      <PostAnalytics postId={postId as Id<"posts">} userId={userId} />
    </div>
  );
}