import Link from "next/link";
import StatusPill from "@/components/hub/StatusPill";
import { accountFor, posts } from "@/components/hub/data";

export function RecentPosts() {
  return <article className="glass-card overflow-hidden rounded-3xl"><div className="flex items-center justify-between border-b border-slate-100 px-6 py-5"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#3556d9]">Content flow</p><h2 className="mt-1 text-xl font-semibold tracking-[-0.03em]">Recent posts</h2></div><Link href="/posts" className="text-sm font-semibold text-[#2854dc] hover:text-[#173b9a]">View all</Link></div><div className="divide-y divide-slate-100">{posts.map((post) => <div key={post.id} className="grid gap-3 px-6 py-5 sm:grid-cols-[1fr_auto] sm:items-center"><div className="min-w-0"><div className="mb-2 flex items-center gap-2 text-xs text-slate-400"><span>{accountFor(post)?.platform}</span><span>·</span><span>{accountFor(post)?.accountName}</span></div><p className="truncate text-sm font-medium text-slate-700">{post.content}</p></div><StatusPill value={post.status} /></div>)}</div></article>;
}

