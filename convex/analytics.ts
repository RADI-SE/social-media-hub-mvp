import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const recordAnalytics = mutation({
  args: {
    postId: v.id("posts"),
    impressions: v.number(),
    likes: v.number(),
    comments: v.number(),
    leads: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("analytics", {
      postId: args.postId,
      impressions: args.impressions,
      likes: args.likes,
      comments: args.comments,
      leads: args.leads,
      recordedAt: Date.now(),
    });
  },
});

export const getAnalyticsForPost = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("analytics")
      .withIndex("by_postId", (q) => q.eq("postId", args.postId))
      .order("desc")
      .collect();
  },
});