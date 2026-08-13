"use client";

import Link from "next/link";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { format } from "date-fns";
import { toast } from "sonner";
import { Trash2, ExternalLink, Plus } from "lucide-react";
import PageHeader from "@/components/hub/PageHeader";

const statusColors: Record<string, string> = {
  Scheduled: "bg-blue-100 text-blue-800",
  Published: "bg-green-100 text-green-800",
  Failed: "bg-red-100 text-red-800",
};

type Comment = {
  _id: string;
  postId?: string;
  targetUrl?: string;
  authorName: string;
  content: string;
  status: string; // "Scheduled" | "Published" | "Failed"
  createdAt: number;
};

export default function CommentList({ comments }: { comments: Comment[] }) {
  const deleteComment = useMutation(api.comments.deleteComment);

  const handleDelete = async (commentId: string) => {
    try {
      await deleteComment({ commentId });
      toast.success("Comment deleted");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Engagement"
        title="Comments"
        description="View and manage comments from your published posts."
        action={
          <Link
            href="/comments/post"
            className="inline-flex items-center gap-2 rounded-xl bg-[#173b9a] px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Plus size={16} />
            New comment
          </Link>
        }
      />
      <section className="glass-card overflow-hidden rounded-3xl">
        <div className="hidden grid-cols-[1fr_2fr_0.7fr_1fr_auto] gap-5 border-b border-slate-100 px-6 py-4 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-slate-400 md:grid">
          <span>Author</span>
          <span>Content</span>
          <span>Status</span>
          <span>Created at</span>
          <span>Actions</span>
        </div>
        <div className="divide-y divide-slate-100">
          {comments.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-slate-400">
              No comments found.
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment._id}
                className="grid grid-cols-1 gap-3 px-6 py-4 md:grid-cols-[1fr_2fr_0.7fr_1fr_auto] md:items-center"
              >
                <div className="font-medium text-sm text-gray-900">
                  {comment.authorName}
                </div>
                <div className="truncate text-sm text-gray-700" title={comment.content}>
                  {comment.content}
                </div>
                <div>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      statusColors[comment.status] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {comment.status}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {format(comment.createdAt, "MMM d, yyyy h:mm a")}
                </div>
                <div className="flex items-center gap-1">
                  {comment.targetUrl && (
                    <a
                      href={comment.targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded p-1.5 text-blue-600 hover:bg-blue-50"
                      title="View post"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="rounded p-1.5 text-red-500 hover:bg-red-50"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}