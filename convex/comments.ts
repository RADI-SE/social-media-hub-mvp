import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const storeComment = mutation({
  args: {
    postId: v.id("posts"),
    authorName: v.string(),
    content: v.string(),
    classification: v.union(
      v.literal("Lead"),
      v.literal("Question"),
      v.literal("Complaint"),
      v.literal("Feedback"),
      v.literal("Engagement"),
      v.literal("Other"),
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("comments", {
      postId: args.postId,
      authorName: args.authorName,
      content: args.content,
      classification: args.classification,
      createdAt: Date.now(),
    });
  },
});

export const getCommentsForPost = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("comments")
      .withIndex("by_postId", (q) => q.eq("postId", args.postId))
      .collect();
  },
});

export const getCommentsByClassification = query({
  args: {
    classification: v.union(
      v.literal("Lead"),
      v.literal("Question"),
      v.literal("Complaint"),
      v.literal("Feedback"),
      v.literal("Engagement"),
      v.literal("Other"),
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("comments")
      .withIndex("by_classification", (q) => q.eq("classification", args.classification))
      .collect();
  },
});