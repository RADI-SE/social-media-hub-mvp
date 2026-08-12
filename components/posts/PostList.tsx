import Link from "next/link";
import { Plus } from "lucide-react";
import PageHeader from "@/components/hub/PageHeader";
import { posts } from "@/components/hub/data";
import PostCard from "./PostCard";

export default function PostList() {
  return (
    <>
      <PageHeader
        eyebrow="Content"
        title="Posts"
        description="Draft, scheduled, and published content in one schema-aligned view."
        action={
          <Link
            href="/create"
            className="inline-flex items-center gap-2 rounded-xl bg-[#173b9a] px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Plus size={16} />
            New post
          </Link>
        }
      />
      <section className="glass-card overflow-hidden rounded-3xl">
        <div className="hidden grid-cols-[0.75fr_2fr_0.7fr_1fr_auto] gap-5 border-b border-slate-100 px-6 py-4 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-slate-400 md:grid">
          <span>Platform</span>
          <span>Content</span>
          <span>Status</span>
          <span>Scheduled at</span>
          <span>Post</span>
        </div>
        <div className="divide-y divide-slate-100">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </>
  );
}
