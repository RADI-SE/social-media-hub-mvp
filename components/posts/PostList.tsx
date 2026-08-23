"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import type { Doc } from "@/convex/_generated/dataModel";
import PageHeader from "@/components/hub/PageHeader";
import StatusPill from "@/components/hub/StatusPill";
import DataTable, { dataTableFeatures } from "@/components/ui/DataTable";
import TableToolbar from "@/components/ui/TableToolbar";
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
        <PostTable posts={posts} />
      </section>
    </>
  );
}

export function PostTable({
  posts,
  showToolbar = true,
  pageSize = 8,
}: {
  posts: Post[];
  showToolbar?: boolean;
  pageSize?: number;
}) {
  const t = useTranslations("posts");
  const common = useTranslations("common");
  const formatter = useFormatter();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("");
  const [status, setStatus] = useState("");
  const columns = useMemo(
    () => createColumns(t, common, formatter),
    [t, common, formatter],
  );
  const filteredPosts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return posts.filter(
      (post) =>
        (!query ||
          post.content.toLocaleLowerCase().includes(query) ||
          post.platform.toLocaleLowerCase().includes(query)) &&
        (!platform || post.platform === platform) &&
        (!status || post.status === status),
    );
  }, [platform, posts, search, status]);
  const options = (values: string[]) =>
    [...new Set(values)].sort().map((value) => ({ label: value, value }));

  return (
    <>
      {showToolbar && (
        <TableToolbar
          title={t("tableTitle")}
          countLabel={t("results", {
            count: filteredPosts.length,
            total: posts.length,
          })}
          search={search}
          searchPlaceholder={t("searchPlaceholder")}
          clearLabel={t("clearFilters")}
          onSearchChange={setSearch}
          onClear={() => {
            setSearch("");
            setPlatform("");
            setStatus("");
          }}
          filters={[
            {
              label: t("platform"),
              value: platform,
              allLabel: t("allPlatforms"),
              options: options(posts.map((post) => post.platform)),
              onChange: setPlatform,
            },
            {
              label: common("status"),
              value: status,
              allLabel: t("allStatuses"),
              options: options(posts.map((post) => post.status)),
              onChange: setStatus,
            },
          ]}
        />
      )}
      <DataTable
        columns={columns}
        data={filteredPosts}
        emptyMessage={t("empty")}
        initialSorting={[{ id: "date", desc: true }]}
        getRowId={(post) => post._id}
        onRowClick={(post) => router.push(`/posts/${post._id}`)}
        getRowLabel={(post) => t("openDetails", { content: post.content })}
        pageSize={pageSize}
      />
    </>
  );
}
