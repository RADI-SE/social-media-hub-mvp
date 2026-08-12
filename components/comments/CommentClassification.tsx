import StatusPill from "@/components/hub/StatusPill";
import type { CommentClassification as Classification } from "@/components/hub/data";

export default function CommentClassification({
  value,
}: {
  value: Classification;
}) {
  return <StatusPill value={value} />;
}
