import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// --- Create immediate comment (published) ---
export const createComment = mutation({
  args: {
    userId: v.string(),
    targetUrl: v.string(),
    authorName: v.string(),
    content: v.string(),
    classification: v.optional(v.union(
      v.literal("Lead"),
      v.literal("Question"),
      v.literal("Complaint"),
      v.literal("Feedback"),
      v.literal("Engagement"),
      v.literal("Other"),
    )),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("comments", {
      userId: args.userId,
      targetUrl: args.targetUrl,
      authorName: args.authorName,
      content: args.content,
      classification: args.classification || "Engagement",
      status: "Published", // uppercase
      createdAt: Date.now(),
    });
  },
});

// --- Schedule a comment (future) ---
export const scheduleComment = mutation({
  args: {
    userId: v.string(),
    targetUrl: v.string(),
    authorName: v.string(),
    content: v.string(),
    scheduledAt: v.number(),
    classification: v.optional(v.union(
      v.literal("Lead"),
      v.literal("Question"),
      v.literal("Complaint"),
      v.literal("Feedback"),
      v.literal("Engagement"),
      v.literal("Other"),
    )),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("comments", {
      userId: args.userId,
      targetUrl: args.targetUrl,
      authorName: args.authorName,
      content: args.content,
      classification: args.classification || "Engagement",
      scheduledAt: args.scheduledAt,
      status: "Scheduled", // uppercase
      createdAt: Date.now(),
    });
  },
});

// --- Get scheduled comments due now (for cron) ---
export const getScheduledComments = query({
  handler: async (ctx) => {
    const now = Date.now();
    return await ctx.db
      .query("comments")
      .withIndex("by_status_scheduled", (q) =>
        q.eq("status", "Scheduled").lte("scheduledAt", now)
      )
      .collect();
  },
});

// --- Mark comment as published ---
export const markCommentPublished = mutation({
  args: { commentId: v.id("comments") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.commentId, {
      status: "Published",
    });
  },
});

// --- Mark comment as failed ---
export const markCommentFailed = mutation({
  args: { commentId: v.id("comments") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.commentId, {
      status: "Failed",
    });
  },
});

// --- Get all comments for a user ---
export const getCommentsForUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("comments")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

// --- Get comments for a post ---
export const getCommentsForPost = query({
  args: { postId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("comments")
      .withIndex("by_postId", (q) => q.eq("postId", args.postId))
      .collect();
  },
});

// --- Delete a comment ---
export const deleteComment = mutation({
  args: { commentId: v.id("comments") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.commentId);
  },
});
