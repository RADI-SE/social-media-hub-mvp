"use client";

import Link from "next/link";
import { Loader2, Plus } from "lucide-react";
import { useQuery } from "convex/react";
import PageHeader from "@/components/hub/PageHeader";
import { api } from "@/convex/_generated/api";
import PostCard from "./PostCard";

export default function PostList() {
  const user = useQuery(api.users.current);
  const published = useQuery(api.posts.getPublishedPostsForUser, user ? { userId: user._id } : "skip");
  const scheduled = useQuery(api.posts.getScheduledItemsForUser, user ? { userId: user._id } : "skip");
  const accounts = useQuery(api.socialAccounts.getAccountsForUser, user ? { userId: user.clerkUserId } : "skip");
  const loading = user === undefined || Boolean(user && [published, scheduled, accounts].some((value) => value === undefined));
  const posts = [...(published ?? []), ...(scheduled ?? [])].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <>
      <PageHeader eyebrow="Content" title="Posts" description="Published and scheduled content from the shared backend." action={<Link href="/create/post" className="inline-flex items-center gap-2 rounded-xl bg-[#173b9a] px-4 py-2.5 text-sm font-semibold text-white"><Plus size={16} />New post</Link>} />
      <section className="glass-card overflow-hidden rounded-3xl">
        <div className="hidden grid-cols-[0.75fr_2fr_0.7fr_1fr_auto] gap-5 border-b border-slate-100 px-6 py-4 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-slate-400 md:grid"><span>Platform</span><span>Content</span><span>Status</span><span>Scheduled at</span><span>Analytics</span></div>
        {loading ? <div className="flex min-h-56 items-center justify-center text-sm text-slate-500"><Loader2 size={18} className="mr-2 animate-spin" />Loading posts…</div> : !user ? <p className="px-6 py-12 text-center text-sm text-slate-500">Sign in again to load your posts.</p> : posts.length ? <div className="divide-y divide-slate-100">{posts.map((post) => <PostCard key={post._id} post={post} account={accounts?.find((account) => account._id === post.socialAccountId)} />)}</div> : <p className="px-6 py-12 text-center text-sm text-slate-500">No published or scheduled posts yet.</p>}
      </section>
    </>
  );
}
