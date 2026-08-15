import StatusPill from "@/components/hub/StatusPill";
import type { Doc } from "@/convex/_generated/dataModel";

export default function CommentClassification({
  value,
}: {
  value: Doc<"comments">["classification"];
}) {
  return <StatusPill value={value} />;
}
