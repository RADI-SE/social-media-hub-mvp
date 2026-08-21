import { query, mutation } from "./_generated/server";
import { v } from "convex/values";


export const recordPostAnalytics = mutation({
  args: {
    postId: v.id("posts"),
    userId: v.string(),
    platform: v.union(
      v.literal("Instagram"),
      v.literal("Facebook"),
      v.literal("LinkedIn"),
      v.literal("TikTok"),
      v.literal("X")
    ),
    reach: v.number(),
    impressions: v.number(),
    frequency: v.number(),
    engagementRate: v.number(),
    postClicks: v.number(),
    profileVisits: v.number(),
    followerGrowth: v.number(),
    shareOfVoice: v.optional(v.number()),
    likes: v.number(),
    comments: v.number(),
    shares: v.number(),
    engagement: v.number(),
    leads: v.optional(v.number()),
    conversions: v.optional(v.number()),
    revenue: v.optional(v.number()),
    recordedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("analytics", {
      ...args,
      createdAt: Date.now(),
    });
    return id;
  },
});


export const getPostAnalytics = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("analytics")
      .withIndex("by_postId", (q) => q.eq("postId", args.postId))
      .order("desc")
      .collect();
  },
});

export const getLatestPostAnalytics = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("analytics")
      .withIndex("by_postId", (q) => q.eq("postId", args.postId))
      .order("desc")
      .first();
  },
});

export const getAnalyticsOverview = query({
  args: {
    userId: v.string(),
    platform: v.optional(
      v.union(
        v.literal("Instagram"),
        v.literal("Facebook"),
        v.literal("LinkedIn"),
        v.literal("TikTok"),
        v.literal("X")
      )
    ),
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const days = args.days || 30;
    const startDate = Date.now() - days * 24 * 60 * 60 * 1000;

    let query = ctx.db
      .query("posts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId));

    if (args.platform) {
      query = query.filter((q) => q.eq(q.field("platform"), args.platform));
    }

    const posts = await query.collect();

    let totalReach = 0;
    let totalImpressions = 0;
    let totalEngagement = 0;
    let totalLikes = 0;
    let totalComments = 0;
    let totalShares = 0;
    let totalPosts = 0;
    let totalEngagementRate = 0;
    let postsWithAnalytics = 0;

    for (const post of posts) {
      if (post.status !== "Published") continue;
      totalPosts++;

      const analytics = await ctx.db
        .query("analytics")
        .withIndex("by_postId", (q) => q.eq("postId", post._id))
        .first();

      if (analytics) {
        postsWithAnalytics++;
        totalReach += analytics.reach || 0;
        totalImpressions += analytics.impressions || 0;
        totalLikes += analytics.likes || 0;
        totalComments += analytics.comments || 0;
        totalShares += analytics.shares || 0;
        totalEngagementRate += analytics.engagementRate || 0;
      }
    }

    totalEngagement = totalLikes + totalComments + totalShares;

    return {
      totalPosts,
      postsWithAnalytics,
      totalReach,
      totalImpressions,
      totalEngagement,
      totalLikes,
      totalComments,
      totalShares,
      avgEngagementRate: postsWithAnalytics > 0
        ? totalEngagementRate / postsWithAnalytics
        : 0,
    };
  },
});


export const getAnalyticsTimeline = query({
  args: {
    userId: v.string(),
    platform: v.optional(
      v.union(
        v.literal("Instagram"),
        v.literal("Facebook"),
        v.literal("LinkedIn"),
        v.literal("TikTok"),
        v.literal("X")
      )
    ),
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const days = args.days || 30;
    const startDate = Date.now() - days * 24 * 60 * 60 * 1000;

    let query = ctx.db
      .query("posts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId));

    if (args.platform) {
      query = query.filter((q) => q.eq(q.field("platform"), args.platform));
    }

    const posts = await query.collect();

    interface TimelineEntry {
      date: string;
      reach: number;
      impressions: number;
      engagement: number;
      likes: number;
      comments: number;
      shares: number;
      posts: number;
    }

    const timeline: Record<string, TimelineEntry> = {};

    for (const post of posts) {
      if (post.status !== "Published") continue;

      const analytics = await ctx.db
        .query("analytics")
        .withIndex("by_postId", (q) => q.eq("postId", post._id))
        .first();

      if (analytics) {
        const date = new Date(post.publishedAt || post.createdAt);
        const day = date.toISOString().split('T')[0];

        if (!timeline[day]) {
          timeline[day] = {
            date: day,
            reach: 0,
            impressions: 0,
            engagement: 0,
            likes: 0,
            comments: 0,
            shares: 0,
            posts: 0,
          };
        }

        timeline[day].reach += analytics.reach || 0;
        timeline[day].impressions += analytics.impressions || 0;
        timeline[day].likes += analytics.likes || 0;
        timeline[day].comments += analytics.comments || 0;
        timeline[day].shares += analytics.shares || 0;
        timeline[day].engagement += (analytics.likes || 0) + (analytics.comments || 0) + (analytics.shares || 0);
        timeline[day].posts++;
      }
    }

    return Object.values(timeline).sort((a, b) => a.date.localeCompare(b.date));
  },
});


export const getTopPosts = query({
  args: {
    userId: v.string(),
    limit: v.optional(v.number()),
    platform: v.optional(
      v.union(
        v.literal("Instagram"),
        v.literal("Facebook"),
        v.literal("LinkedIn"),
        v.literal("TikTok"),
        v.literal("X")
      )
    ),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;

    let query = ctx.db
      .query("posts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("status"), "Published"));

    if (args.platform) {
      query = query.filter((q) => q.eq(q.field("platform"), args.platform));
    }

    const posts = await query.collect();

    const postsWithAnalytics = [];

    for (const post of posts) {
      const analytics = await ctx.db
        .query("analytics")
        .withIndex("by_postId", (q) => q.eq("postId", post._id))
        .first();

      if (analytics) {
        postsWithAnalytics.push({
          ...post,
          analytics: analytics,
          totalEngagement: (analytics.likes || 0) + (analytics.comments || 0) + (analytics.shares || 0),
        });
      }
    }

    return postsWithAnalytics
      .sort((a, b) => b.totalEngagement - a.totalEngagement)
      .slice(0, limit);
  },
});