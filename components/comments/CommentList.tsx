"use client";
import { useState } from "react";
import { MessageSquareText } from "lucide-react";
import PageHeader from "@/components/hub/PageHeader";
import { comments } from "@/components/hub/data";
import CommentItem from "./CommentItem";

export default function CommentList() {
  const [converted, setConverted] = useState<string[]>([
    "comment-01",
    "comment-02",
    "comment-03",
  ]);
  return (
    <>
      <PageHeader
        eyebrow="Monitoring"
        title="Comments and leads"
        description="Review classified comments and convert a relevant conversation into follow-up work."
      />
      <div className="mb-5 flex items-center gap-2 rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-xs text-blue-800">
        <MessageSquareText size={16} />
        <span>
          Classification is AI-assisted demo output and includes the six values
          in the shared model.
        </span>
      </div>
      <section className="grid gap-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            converted={converted.includes(comment.id)}
            onConvert={() => setConverted((items) => [...items, comment.id])}
          />
        ))}
      </section>
    </>
  );
}
