"use client";

import { useMemo } from "react";
import { Loader2, MessageSquareText } from "lucide-react";
import { useMutation, useQueries, useQuery } from "convex/react";
import PageHeader from "@/components/hub/PageHeader";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import CommentItem, { type CommentView } from "./CommentItem";

export default function CommentList() {
  const user = useQuery(api.users.current);
  const posts = useQuery(
    api.posts.getPublishedPostsForUser,
    user ? { userId: user._id } : "skip",
  );
  const tasks = useQuery(
    api.followUpTasks.getTasksForUser,
    user ? { userId: user._id } : "skip",
  );

  return (
    <>
      <PageHeader
        eyebrow="Monitoring"
        title="Comments and leads"
        description="Review classified comments and convert a relevant conversation into follow-up work."
      />
      <div className="mb-5 flex items-center gap-2 rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-xs text-blue-800">
        <MessageSquareText size={16} />
        <span>Classification is AI-assisted demo output and includes the six values in the shared model.</span>
      </div>

      {user === undefined || (user && (posts === undefined || tasks === undefined)) ? (
        <LoadingState />
      ) : !user ? (
        <EmptyState title="Account data is unavailable" description="Sign in again to load your comments." />
      ) : !posts?.length ? (
        <EmptyState title="No published posts yet" description="Comments will appear after a published post receives demo interactions." />
      ) : (
        <CommentsContent user={user} posts={posts} tasks={tasks ?? []} />
      )}
    </>
  );
}

function CommentsContent({
  user,
  posts,
  tasks,
}: {
  user: Doc<"users">;
  posts: Doc<"posts">[];
  tasks: Doc<"followUpTasks">[];
}) {
  const createTask = useMutation(api.followUpTasks.createFollowUpTask);
  const commentQueries = useMemo(
    () => Object.fromEntries(
      posts.map((post) => [
        post._id,
        { query: api.comments.getCommentsForPost, args: { postId: post._id } },
      ]),
    ),
    [posts],
  );
  const results = useQueries(commentQueries);

  if (posts.some((post) => results[post._id] === undefined)) return <LoadingState />;
  if (posts.some((post) => results[post._id] instanceof Error)) {
    return <EmptyState title="Could not load comments" description="Refresh the page and try again." />;
  }

  const comments: CommentView[] = posts.flatMap((post) =>
    (results[post._id] as Doc<"comments">[]).map((comment) => ({
      ...comment,
      postContent: post.content,
    })),
  );

  if (!comments.length) {
    return <EmptyState title="No comments available" description="Classified comments connected to your published posts will appear here." />;
  }

  return (
    <section className="grid gap-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          converted={tasks.some((task) => task.commentId === comment._id)}
          onConvert={() => createTask({
            commentId: comment._id,
            userId: user._id,
            title: `Follow up with ${comment.authorName}`,
          })}
        />
      ))}
    </section>
  );
}

function LoadingState() {
  return <div className="glass-card flex min-h-56 items-center justify-center rounded-3xl text-sm text-slate-500"><Loader2 size={18} className="mr-2 animate-spin" />Loading comments…</div>;
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="glass-card flex min-h-56 flex-col items-center justify-center rounded-3xl px-6 text-center"><MessageSquareText size={24} className="text-[#3556d9]" /><h2 className="mt-4 font-semibold text-[#071e55]">{title}</h2><p className="mt-2 max-w-md text-sm leading-6 text-slate-500">{description}</p></div>;
}
