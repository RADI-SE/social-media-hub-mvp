import type { Doc } from "@/convex/_generated/dataModel";

export type AnalyticsMetrics = {
  impressions: number;
  likes: number;
  comments: number;
  leads: number;
};

const metricSamples: AnalyticsMetrics[] = [
  { impressions: 12840, likes: 932, comments: 86, leads: 14 },
  { impressions: 4680, likes: 341, comments: 29, leads: 6 },
  { impressions: 7350, likes: 518, comments: 47, leads: 9 },
  { impressions: 3920, likes: 276, comments: 18, leads: 4 },
];

export function mockAnalyticsForPosts(posts: Doc<"posts">[]) {
  return posts.map((post, index) => ({
    post,
    analytics: metricSamples[index % metricSamples.length],
  }));
}
