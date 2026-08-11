"use client";
import { useState } from "react";
import { Check } from "lucide-react";
import PageHeader from "@/components/hub/PageHeader";
import { socialAccounts, type PostStatus } from "@/components/hub/data";
import AICaptionGenerator from "@/components/comments/AICaptionGenerator";
import SchedulePicker from "./SchedulePicker";

export default function PostForm() {
  const [socialAccountId, setSocialAccountId] = useState(socialAccounts[0].id);
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<PostStatus>("Draft");
  const [scheduledAt, setScheduledAt] = useState("");
  const [saved, setSaved] = useState(false);
  function savePost(event: React.FormEvent) { event.preventDefault(); setSaved(true); window.setTimeout(() => setSaved(false), 2600); }
  return <><PageHeader eyebrow="Publishing" title="Create a post" description="Build one post using only the fields defined in the shared data model." /><form onSubmit={savePost} className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]"><section className="glass-card rounded-3xl p-6 sm:p-8"><div className="mb-7 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 font-bold text-blue-700">01</span><div><h2 className="font-semibold">Post details</h2><p className="text-xs text-slate-500">Account, content, status, and schedule</p></div></div><label className="block text-sm font-semibold text-slate-700" htmlFor="socialAccountId">Social account</label><select id="socialAccountId" value={socialAccountId} onChange={(event) => setSocialAccountId(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-700">{socialAccounts.map((account) => <option key={account.id} value={account.id}>{account.platform} · {account.accountName}</option>)}</select><label className="mt-6 block text-sm font-semibold text-slate-700" htmlFor="content">Content</label><textarea id="content" value={content} onChange={(event) => setContent(event.target.value)} required rows={8} placeholder="Write the post content..." className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm leading-6 text-slate-700 placeholder:text-slate-400" /><div className="mt-6 grid gap-5 sm:grid-cols-2"><div><label className="block text-sm font-semibold text-slate-700" htmlFor="status">Status</label><select id="status" value={status} onChange={(event) => setStatus(event.target.value as PostStatus)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm"><option>Draft</option><option>Scheduled</option><option>Published</option></select></div><SchedulePicker value={scheduledAt} onChange={setScheduledAt} disabled={status !== "Scheduled"} required={status === "Scheduled"} /></div></section><AICaptionGenerator /><div className="flex items-center justify-end gap-4 xl:col-span-2"><span className={`flex items-center gap-2 text-sm font-semibold text-emerald-700 ${saved ? "opacity-100" : "opacity-0"}`}><Check size={16} />Post saved in demo</span><button type="submit" className="rounded-xl bg-[#173b9a] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/15 hover:-translate-y-0.5">Save post</button></div></form></>;
}

