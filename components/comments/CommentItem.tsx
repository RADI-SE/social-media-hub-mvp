import { accountFor, posts, type Comment } from "@/components/hub/data";
import CommentClassification from "./CommentClassification";
import ConvertToTaskButton from "./ConvertToTaskButton";

export default function CommentItem({ comment, converted, onConvert }: { comment: Comment; converted: boolean; onConvert: () => void }) {
  const post = posts.find((item) => item.id === comment.postId);
  return <article className="glass-card grid gap-5 rounded-3xl p-6 lg:grid-cols-[1fr_auto] lg:items-center"><div className="min-w-0"><div className="flex flex-wrap items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#c4ffe6] to-[#7590ff] text-xs font-bold text-[#09276b]">{comment.authorName.split(" ").map((part) => part[0]).join("")}</span><div><p className="font-semibold text-[#071e55]">{comment.authorName}</p><p className="text-xs text-slate-400">{post ? `${accountFor(post)?.platform} · ${post.id}` : comment.postId}</p></div><CommentClassification value={comment.classification} /></div><p className="mt-4 text-sm leading-6 text-slate-700">{comment.content}</p></div><ConvertToTaskButton converted={converted} onConvert={onConvert} /></article>;
}

