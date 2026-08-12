"use client";

import Link from "next/link";
import { Loader2, Plus } from "lucide-react";
import { useQuery } from "convex/react";
import PageHeader from "@/components/hub/PageHeader";
import { api } from "@/convex/_generated/api";

export default function ContentCalendar() {
  const user = useQuery(api.users.current);
  const scheduled = useQuery(api.posts.getScheduledItemsForUser, user ? { userId: user._id } : "skip");
  const accounts = useQuery(api.socialAccounts.getAccountsForUser, user ? { userId: user.clerkUserId } : "skip");
  const loading = user === undefined || Boolean(user && (scheduled === undefined || accounts === undefined));

  return (
    <>
      <PageHeader eyebrow="Publishing" title="Scheduled content" description="Posts waiting to be published by the scheduling service." action={<Link href="/create/post" className="inline-flex items-center gap-2 rounded-xl bg-[#173b9a] px-4 py-2.5 text-sm font-semibold text-white"><Plus size={16} />Schedule post</Link>} />
      <section className="glass-card overflow-hidden rounded-3xl">
        <div className="hidden grid-cols-[0.8fr_2fr_1fr] gap-5 border-b border-slate-100 px-6 py-4 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-slate-400 md:grid"><span>Platform</span><span>Content</span><span>Scheduled for</span></div>
        {loading ? <div className="flex min-h-56 items-center justify-center text-sm text-slate-500"><Loader2 size={18} className="mr-2 animate-spin" />Loading schedule…</div> : !user ? <p className="px-6 py-12 text-center text-sm text-slate-500">Sign in again to load your schedule.</p> : scheduled?.length ? <div className="divide-y divide-slate-100">{[...scheduled].sort((a, b) => (a.scheduledAt ?? 0) - (b.scheduledAt ?? 0)).map((post) => { const account = accounts?.find((item) => item._id === post.socialAccountId); return <article key={post._id} className="grid gap-3 px-6 py-5 md:grid-cols-[0.8fr_2fr_1fr] md:items-center"><div><p className="text-sm font-semibold text-[#173b9a]">{account?.platform ?? "Social"}</p><p className="text-xs text-slate-400">{account?.accountName ?? "Account"}</p></div><p className="text-sm leading-6 text-slate-700">{post.content}</p><p className="text-xs text-slate-500">{post.scheduledAt ? new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(post.scheduledAt)) : "Schedule unavailable"}</p></article>; })}</div> : <p className="px-6 py-12 text-center text-sm text-slate-500">No scheduled posts yet.</p>}
      </section>
    </>
  );
}
