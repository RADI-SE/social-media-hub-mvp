"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import type { Doc } from "@/convex/_generated/dataModel";
import PageHeader from "@/components/hub/PageHeader";
import StatusPill from "@/components/hub/StatusPill";
import DataTable, { dataTableFeatures } from "@/components/ui/DataTable";
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
} from "@/components/ui/ChannelIcons";
import PostActions from "./PostActions";

type Post = Doc<"posts">;

const platformIcons = {
  Facebook: FacebookIcon,
  Instagram: InstagramIcon,
  X: TwitterIcon,
};

const column = createColumnHelper<typeof dataTableFeatures, Post>();

const columns = column.columns([
  column.accessor("platform", {
    header: "Platform",
    cell: ({ row }) => {
      const Icon =
        platformIcons[row.original.platform as keyof typeof platformIcons];
      return (
        <span className="flex items-center gap-2 text-sm font-semibold text-[#071e55]">
          {Icon && <Icon className="h-4 w-4 text-slate-500" />}
          {row.original.platform}
        </span>
      );
    },
  }),
  column.accessor("content", {
    header: "Content",
    cell: ({ getValue }) => (
      <p
        className="max-w-md truncate text-sm text-slate-600"
        title={getValue()}
      >
        {getValue()}
      </p>
    ),
  }),
  column.accessor("status", {
    header: "Status",
    cell: ({ getValue }) => <StatusPill value={getValue()} />,
  }),
  column.accessor(
    (post) => post.scheduledAt ?? post.publishedAt ?? post.createdAt,
    {
      id: "date",
      header: "Date",
      cell: ({ getValue }) => (
        <span className="whitespace-nowrap text-sm text-slate-500">
          {format(getValue(), "MMM d, yyyy · h:mm a")}
        </span>
      ),
    },
  ),
  column.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <PostActions post={row.original} />,
  }),
]);

export default function PostList({ posts }: { posts: Post[] }) {
  return (
    <>
      <PageHeader
        eyebrow="Content"
        title="Posts"
        description="Draft, scheduled, and published content in one schema-aligned view."
        action={
          <Link
            href="/create/post"
            className="inline-flex items-center gap-2 rounded-xl bg-[#173b9a] px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Plus size={16} />
            New post
          </Link>
        }
      />
      <section className="glass-card overflow-hidden rounded-3xl">
        <DataTable
          columns={columns}
          data={posts}
          emptyMessage="No posts yet."
          initialSorting={[{ id: "date", desc: true }]}
          getRowId={(post) => post._id}
        />
      </section>
    </>
  );
}
