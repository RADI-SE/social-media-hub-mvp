"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { TwitterIcon, FacebookIcon } from "../ui/ChannelIcons";
import { format } from "date-fns";
import { Trash2, RotateCcw, Calendar } from "lucide-react";
import type { Doc } from "@/convex/_generated/dataModel";

const platformIcons = {
  Facebook: FacebookIcon,
  Twitter: TwitterIcon,
};

const platformMap = {
  Facebook: "Facebook",
  X: "Twitter",
};

const statusColors = {
  Draft: "bg-gray-200 text-gray-700",
  Scheduled: "bg-blue-100 text-blue-700",
  Published: "bg-green-100 text-green-700",
  Failed: "bg-red-100 text-red-700",
};

export default function PostCard({ post }: { post: Doc<"posts"> }) {
  const deletePost = useMutation(api.posts.deletePost);
  const retryPost = useMutation(api.posts.retryPost);
  const cancelScheduled = useMutation(api.posts.cancelScheduledItem);

  const handleDelete = async () => {
    try {
      await deletePost({ postId: post._id });
      toast.success("Deleted");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleRetry = async () => {
    try {
      await retryPost({ postId: post._id });
      toast.success("Will retry in 1 minute");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleCancel = async () => {
    try {
      await cancelScheduled({ postId: post._id });
      toast.success("Cancelled");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const Icon =
    platformIcons[platformMap[post.platform] as keyof typeof platformIcons] ||
    null;

  return (
    <div className="grid grid-cols-1 gap-3 px-6 py-4 md:grid-cols-[0.75fr_2fr_0.7fr_1fr_auto] md:items-center">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="h-5 w-5 text-slate-500" />}
        <span className="text-sm font-medium">
          {post.platform || "Facebook"}
        </span>
        {post.type === "comment" && (
          <span className="text-xs text-slate-400">(comment)</span>
        )}
      </div>
      <div className="truncate text-sm text-slate-700" title={post.content}>
        {post.content}
      </div>
      <div>
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
            statusColors[post.status as keyof typeof statusColors]
          }`}
        >
          {post.status}
        </span>
      </div>
      <div className="text-sm text-slate-500">
        {post.scheduledAt ? (
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {format(post.scheduledAt, "MMM d, yyyy h:mm a")}
          </span>
        ) : (
          <span className="text-xs text-slate-300">—</span>
        )}
      </div>
      <div className="flex items-center gap-1">
        {post.status === "Scheduled" && (
          <button
            type="button"
            onClick={handleCancel}
            className="rounded p-1.5 text-yellow-600 hover:bg-yellow-50"
            title="Cancel"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
        {post.status === "Failed" && (
          <button
            type="button"
            onClick={handleRetry}
            className="rounded p-1.5 text-blue-600 hover:bg-blue-50"
            title="Retry"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        )}
        <button
          type="button"
          onClick={handleDelete}
          className="rounded p-1.5 text-red-500 hover:bg-red-50"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
