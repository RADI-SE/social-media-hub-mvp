"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
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
import PostUrlControl from "./PostUrlControl";
import { useFormatter, useTranslations } from "next-intl";

type Post = Doc<"posts">;

const platformIcons = {
  Facebook: FacebookIcon,
  Instagram: InstagramIcon,
  X: TwitterIcon,
};

const column = createColumnHelper<typeof dataTableFeatures, Post>();

function createColumns(
  t: ReturnType<typeof useTranslations<"posts">>,
  common: ReturnType<typeof useTranslations<"common">>,
  formatter: ReturnType<typeof useFormatter>,
) {
  return column.columns([
    column.accessor("platform", {
      header: t("platform"),
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
      header: t("content"),
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
      header: common("status"),
      cell: ({ getValue }) => <StatusPill value={getValue()} />,
    }),
    column.display({
      id: "postUrl",
      header: t("postUrl"),
      cell: ({ row }) => <PostUrlControl post={row.original} />,
    }),
    column.accessor(
      (post) => post.scheduledAt ?? post.publishedAt ?? post.createdAt,
      {
        id: "date",
        header: common("created"),
        cell: ({ getValue }) => (
          <span className="whitespace-nowrap text-sm text-slate-500">
            {formatter.dateTime(getValue(), {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </span>
        ),
      },
    ),
    column.display({
      id: "actions",
      header: common("actions"),
      cell: ({ row }) => <PostActions post={row.original} />,
    }),
  ]);
}

export default function PostList({ posts }: { posts: Post[] }) {
  const t = useTranslations("posts");
  const common = useTranslations("common");
  const formatter = useFormatter();
  const columns = useMemo(
    () => createColumns(t, common, formatter),
    [t, common, formatter],
  );
  const router = useRouter();

  const handleRowClick = (post: Post) => {
    router.push(`/posts/${post._id}/analytics`);
  };

  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
        action={
          <Link
            href="/create/post"
            className="inline-flex items-center gap-2 rounded-xl bg-[#173b9a] px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Plus size={16} />
            {t("newPost")}
          </Link>
        }
      />
      <section className="glass-card overflow-hidden rounded-3xl">
        <DataTable
          columns={columns}
          data={posts}
          emptyMessage={t("empty")}
          initialSorting={[{ id: "date", desc: true }]}
          getRowId={(post) => post._id}
          onRowClick={handleRowClick} // 👈 row click navigation
        />
      </section>
    </>
  );
}
