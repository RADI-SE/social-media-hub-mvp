"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import PostList from "@/components/posts/PostList";

export default function PostsPage() {
  const { user } = useUser();
  const userId = user?.id;
 
  const posts = useQuery(api.posts.getPostsForUser, userId ? { userId } : "skip");

  if (posts === undefined) {
    return <div className="p-8 text-gray-500">Loading posts…</div>;
  }

  return <PostList posts={posts} />;
}