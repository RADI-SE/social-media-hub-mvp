"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { ChevronLeft, ChevronRight, Loader2, Plus } from "lucide-react";
import PageHeader from "@/components/hub/PageHeader";
import { api } from "@/convex/_generated/api";

export default function ContentCalendar() {
  const { user, isLoaded } = useUser();
  const posts = useQuery(
    api.posts.getPostsForUser,
    user ? { userId: user.id } : "skip",
  );
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  if (!isLoaded || (user && posts === undefined)) {
    return (
      <div className="glass-card flex min-h-64 items-center justify-center rounded-3xl text-sm text-slate-500">
        <Loader2 size={18} className="mr-2 animate-spin" />
        Loading calendar…
      </div>
    );
  }

  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const numberOfDays = new Date(year, month + 1, 0).getDate();
  const cells = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: numberOfDays }, (_, index) => index + 1),
  ];
  const datedPosts = (posts ?? []).filter(
    (post) =>
      post.scheduledAt &&
      (post.status === "Scheduled" || post.status === "Published"),
  );

  function moveMonth(offset: number) {
    setVisibleMonth(new Date(year, month + offset, 1));
  }

  return (
    <>
      <PageHeader
        eyebrow="Publishing"
        title="Content calendar"
        description="Scheduled and published posts grouped by their saved publishing date."
        action={
          <Link
            href="/create/post"
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
              {visibleMonth.toLocaleString("en", { month: "long" })}
            </p>
            <h2 className="mt-1 text-xl font-semibold">{year}</h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => moveMonth(-1)}
              className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 hover:text-[#173b9a]"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => moveMonth(1)}
              className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 hover:text-[#173b9a]"
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
          {cells.map((day, index) => {
            if (day === null)
              return (
                <div
                  key={`blank-${index}`}
                  className="min-h-24 border-b border-r border-blue-900/5 bg-white/20 sm:min-h-32"
                />
              );
            const dayPosts = datedPosts.filter((post) => {
              const date = new Date(post.scheduledAt!);
              return (
                date.getFullYear() === year &&
                date.getMonth() === month &&
                date.getDate() === day
              );
            });
            const today = new Date();
            const isToday =
              today.getFullYear() === year &&
              today.getMonth() === month &&
              today.getDate() === day;
            return (
              <div
                key={day}
                className="min-h-24 border-b border-r border-blue-900/5 p-2 sm:min-h-32 sm:p-3"
              >
                <span
                  className={`grid h-7 w-7 place-items-center rounded-full text-xs font-semibold ${isToday ? "bg-[#173b9a] text-white" : "text-slate-500"}`}
                >
                  {day}
                </span>
                <div className="mt-2 space-y-1.5">
                  {dayPosts.map((post) => (
                    <article
                      key={post._id}
                      className={`rounded-lg border px-2 py-1.5 text-[0.62rem] leading-4 ${post.status === "Published" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-blue-200 bg-blue-50 text-blue-800"}`}
                    >
                      <p className="font-bold">{post.platform}</p>
                      <p className="hidden truncate sm:block">{post.content}</p>
                    </article>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
