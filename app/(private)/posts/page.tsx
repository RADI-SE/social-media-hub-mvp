"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import PostList from "@/components/posts/PostList";
import { useTranslations } from "next-intl";
import { useDashboardRole } from "@/lib/dashboard-access";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PostsPage() {
  const t = useTranslations("posts");
  const { user } = useUser();
  const userId = user?.id;
  const role = useDashboardRole();
  const router = useRouter();
 
  const posts = useQuery(
    api.posts.getPostsForUser,
    userId ? { userId } : "skip",
  );
 
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
 
  if (posts === undefined) {
    return <div className="p-8 text-gray-500">{t("loading")}</div>;
  }

  return <PostList posts={posts} />;
}