"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import PageHeader from "@/components/hub/PageHeader";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const days = Array.from({ length: 31 }, (_, index) => index + 1);

export default function ContentCalendar() {
  const { user } = useUser();
  const userId = user?.id;

  // Fetch posts and social accounts
  const posts = useQuery(api.posts.getPostsForUser, userId ? { userId } : "skip");
  const socialAccounts = useQuery(api.socialAccounts.getAccountsForUser, userId ? { userId } : "skip");

  // Loading state
  if (posts === undefined || socialAccounts === undefined) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-gray-500">Loading calendar…</div>
      </div>
    );
  }

  // Build a map of socialAccountId -> platform
  const accountMap = new Map();
  socialAccounts?.forEach((account) => {
    accountMap.set(account._id, account.platform);
  });

  // Filter posts that have a scheduled date (Scheduled or Published)
  const scheduledPosts = posts.filter(
    (post) => post.scheduledAt && (post.status === "Scheduled" || post.status === "Published")
  );

  // Group posts by day (using the date of scheduledAt)
  const postsByDay = new Map();
  scheduledPosts.forEach((post) => {
    const date = new Date(post.scheduledAt);
    const day = date.getDate(); // 1-31
    if (!postsByDay.has(day)) {
      postsByDay.set(day, []);
    }
    postsByDay.get(day).push(post);
  });

  return (
    <>
      <PageHeader
        eyebrow="Publishing"
        title="Content calendar"
        description="Scheduled and published posts by date. Drafts remain in the posts view until a date is assigned."
        action={
          <Link
            href="/create"
            className="inline-flex items-center gap-2 rounded-xl bg-[#173b9a] px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Plus size={16} />
            Schedule post
          </Link>
        }
      />
      <section className="glass-card overflow-hidden rounded-3xl">
        <header className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-7">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#3556d9]">
              {new Date().toLocaleString("default", { month: "long" })}
            </p>
            <h2 className="mt-1 text-xl font-semibold">{new Date().getFullYear()}</h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous month"
              className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-500"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              aria-label="Next month"
              className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-500"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </header>
        <div className="grid grid-cols-7 border-b border-slate-100 bg-white/45 text-center text-[0.62rem] font-bold uppercase tracking-[0.12em] text-slate-400">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="py-3">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 soft-grid">
          {days.map((day) => {
            const dayPosts = postsByDay.get(day) || [];
            return (
              <div
                key={day}
                className="min-h-24 border-b border-r border-blue-900/5 p-2 sm:min-h-32 sm:p-3"
              >
                <span
                  className={`grid h-7 w-7 place-items-center rounded-full text-xs font-semibold ${
                    day === new Date().getDate()
                      ? "bg-[#173b9a] text-white"
                      : "text-slate-500"
                  }`}
                >
                  {day}
                </span>
                <div className="mt-2 space-y-1.5">
                  {dayPosts.map((post) => {
                    // Get platform from accountMap
                    const platform = post.platform || "Unknown";
                    return (
                      <article
                        key={post._id}
                        className={`rounded-lg border px-2 py-1.5 text-[0.62rem] leading-4 ${
                          post.status === "Published"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                            : "border-blue-200 bg-blue-50 text-blue-800"
                        }`}
                      >
                        <p className="font-bold">{platform}</p>
                        <p className="hidden truncate sm:block">{post.content}</p>
                      </article>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}