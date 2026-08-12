import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
 
export const getScheduledItems = query({
  handler: async (ctx) => {
    const now = Date.now();
    return await ctx.db
      .query("posts")
      .withIndex("by_status", (q) => q.eq("status", "Scheduled"))
      .filter((q) => q.lte(q.field("scheduledAt"), now))
      .collect();
  },
});
 
export const markItemPublished = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.postId, {
      status: "Published",
      publishedAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});
 
export const markItemFailed = mutation({
  args: { postId: v.id("posts"), error: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.postId, {
      status: "Failed",
      updatedAt: Date.now(),
    });
  },
});
 
export const schedulePost = mutation({
  args: {
    userId: v.id("users"),
    socialAccountId: v.id("socialAccounts"),
    content: v.string(),
    scheduledAt: v.number(),
    mediaUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("posts", {
      userId: args.userId,
      socialAccountId: args.socialAccountId,
      type: "post",
      content: args.content,
      mediaUrl: args.mediaUrl,
      status: "Scheduled",
      scheduledAt: args.scheduledAt,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return id;
  },
});
 
export const scheduleComment = mutation({
  args: {
    userId: v.id("users"),
    socialAccountId: v.id("socialAccounts"),
    targetUrl: v.string(),
    content: v.string(),
    scheduledAt: v.number(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("posts", {
      userId: args.userId,
      socialAccountId: args.socialAccountId,
      type: "comment",
      targetUrl: args.targetUrl,
      content: args.content,
      status: "Scheduled",
      scheduledAt: args.scheduledAt,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return id;
  },
});
 
export const cancelScheduledItem = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.postId);
    if (!item) throw new Error("Item not found");
    if (item.status !== "Scheduled") throw new Error("Can only cancel scheduled items");
    await ctx.db.delete(args.postId);
  },
});
 
export const getScheduledItemsForUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("status"), "Scheduled"))
      .collect();
  },
});