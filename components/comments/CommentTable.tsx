"use client";

import { useMemo } from "react";
import { ExternalLink, Trash2 } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import StatusPill from "@/components/hub/StatusPill";
import DataTable, { dataTableFeatures } from "@/components/ui/DataTable";
import ConvertToTaskButton from "./ConvertToTaskButton";
import { FacebookIcon, InstagramIcon } from "@/components/ui/ChannelIcons";
import { useFormatter, useTranslations } from "next-intl";

type Comment = Doc<"comments">;
type Post = Doc<"posts">;
const column = createColumnHelper<typeof dataTableFeatures, Comment>();

interface CommentTableProps {
  comments: Comment[];
  posts: Post[];
  tasks: Doc<"followUpTasks">[];
  pendingId: Id<"comments"> | null;
  onConvert: (comment: Comment) => void;
  onDelete: (commentId: Id<"comments">) => void;
}

export default function CommentTable({
  comments,
  posts,
  tasks,
  pendingId,
  onConvert,
  onDelete,
}: CommentTableProps) {
  const t = useTranslations("comments");
  const common = useTranslations("common");
  const formatter = useFormatter();
  const postsById = useMemo(
    () => new Map(posts.map((post) => [post._id, post])),
    [posts],
  );
  const postsByUrl = useMemo(
    () =>
      new Map(
        posts
          .filter((post) => post.postUrl)
          .map((post) => [post.postUrl as string, post]),
      ),
    [posts],
  );
  const columns = useMemo(
    () =>
      column.columns([
        column.display({
          id: "sourcePost",
          header: t("sourcePost"),
          cell: ({ row }) => {
            const comment = row.original;
            const post = comment.postId
              ? postsById.get(comment.postId)
              : postsByUrl.get(comment.targetUrl);
            return <PostContext comment={comment} post={post} />;
          },
        }),
        column.accessor("authorName", {
          header: t("author"),
          cell: ({ row }) => (
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#c4ffe6] to-[#7590ff] text-xs font-bold text-[#09276b]">
                {initials(row.original.authorName)}
              </span>
              <span className="font-semibold text-[#071e55]">
                {row.original.authorName}
              </span>
            </div>
          ),
        }),
        column.accessor("content", {
          header: t("comment"),
          cell: ({ getValue }) => (
            <p
              className="max-w-md truncate text-sm text-slate-600"
              title={getValue()}
            >
              {getValue()}
            </p>
          ),
        }),
        column.accessor("classification", {
          header: t("classification"),
          cell: ({ getValue }) => <StatusPill value={getValue()} />,
        }),
        column.accessor("status", {
          header: common("status"),
          cell: ({ getValue }) => (
            <StatusPill value={getValue() ?? "Published"} />
          ),
        }),
        column.accessor("createdAt", {
          header: common("created"),
          cell: ({ getValue }) => (
            <span className="whitespace-nowrap text-sm text-slate-500">
              {formatter.dateTime(getValue(), {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
          ),
        }),
        column.display({
          id: "actions",
          header: common("actions"),
          cell: ({ row }) => (
            <CommentActions
              comment={row.original}
              converted={tasks.some(
                (task) => task.commentId === row.original._id,
              )}
              converting={pendingId === row.original._id}
              onConvert={() => onConvert(row.original)}
              onDelete={() => onDelete(row.original._id)}
            />
          ),
        }),
      ]),
    [
      common,
      formatter,
      onConvert,
      onDelete,
      pendingId,
      postsById,
      postsByUrl,
      t,
      tasks,
    ],
  );

  return (
    <DataTable
      columns={columns}
      data={comments}
      emptyMessage={t("emptyTitle")}
      initialSorting={[{ id: "createdAt", desc: true }]}
      getRowId={(comment) => comment._id}
    />
  );
}

function PostContext({ comment, post }: { comment: Comment; post?: Post }) {
  const t = useTranslations("comments");
  const platform =
    post?.platform ??
    (comment.platform === "instagram" ? "Instagram" : "Facebook");
  const PlatformIcon = platform === "Instagram" ? InstagramIcon : FacebookIcon;
  const postId = post?._id ?? comment.postId;

  return (
    <div className="max-w-56 text-left">
      <p
        className="mb-1 truncate font-mono text-[0.62rem] text-slate-400"
        title={postId}
      >
        {postId ? t("postId", { id: postId }) : t("postNotLinked")}
      </p>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#3556d9]">
        <PlatformIcon className="h-3.5 w-3.5 flex-none" />
        {platform}
      </div>
      <p className="mt-1 truncate text-xs text-slate-500" title={post?.content}>
        {post?.content ?? t("postContentUnavailable")}
      </p>
    </div>
  );
}

function CommentActions({
  comment,
  converted,
  converting,
  onConvert,
  onDelete,
}: {
  comment: Comment;
  converted: boolean;
  converting: boolean;
  onConvert: () => void;
  onDelete: () => void;
}) {
  const t = useTranslations("comments");
  return (
    <div className="flex items-center justify-end gap-2">
      {comment.targetUrl && (
        <a
          href={comment.targetUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={t("viewSource")}
          className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-[#2854dc]"
        >
          <ExternalLink size={15} />
        </a>
      )}
      <button
        type="button"
        onClick={onDelete}
        aria-label={t("deleteComment")}
        className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
      >
        <Trash2 size={15} />
      </button>
      <ConvertToTaskButton
        converted={converted}
        loading={converting}
        onConvert={onConvert}
      />
    </div>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}
