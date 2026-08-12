import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import StatusPill from "@/components/hub/StatusPill";
import { accountFor, type Post } from "@/components/hub/data";

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="grid gap-4 px-6 py-5 md:grid-cols-[0.75fr_2fr_0.7fr_1fr_auto] md:items-center">
      <div>
        <p className="text-sm font-semibold text-[#173b9a]">
          {accountFor(post)?.platform}
        </p>
        <p className="text-xs text-slate-400">
          {accountFor(post)?.accountName}
        </p>
      </div>
      <p className="text-sm leading-6 text-slate-700">{post.content}</p>
      <div>
        <StatusPill value={post.status} />
      </div>
      <p className="text-xs leading-5 text-slate-500">
        {post.scheduledAt
          ? new Intl.DateTimeFormat("en", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(new Date(post.scheduledAt))
          : "Not scheduled"}
      </p>
      <Link
        href={`/analytics?postId=${post.id}`}
        aria-label={`View analytics for ${post.id}`}
        className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 hover:border-blue-300 hover:text-blue-700"
      >
        <ArrowUpRight size={16} />
      </Link>
    </article>
  );
}
