import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// --- Record a published post (immediate) ---
export const recordPublishedPost = mutation({
  args: {
    userId: v.string(),
    platform: v.union(
      v.literal("Instagram"),
      v.literal("Facebook"),
      v.literal("LinkedIn"),
      v.literal("TikTok"),
      v.literal("X")
    ),
    content: v.string(),
    mediaUrl: v.optional(v.string()),
    socialAccountId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("posts", {
      userId: args.userId,
      platform: args.platform,
      content: args.content,
      mediaUrl: args.mediaUrl,
      socialAccountId: args.socialAccountId,
      status: "Published",
      publishedAt: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return id;
  },
});


// Get published posts for a user (for analytics)
export const getPublishedPostsForUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("status"), "Published"))
      .collect();
  },
});

// --- Schedule a post ---
export const schedulePost = mutation({
  args: {
    userId: v.string(),
    platform: v.union(
      v.literal("Instagram"),
      v.literal("Facebook"),
      v.literal("LinkedIn"),
      v.literal("TikTok"),
      v.literal("X")
    ),
    content: v.string(),
    scheduledAt: v.number(),
    mediaUrl: v.optional(v.string()),
    socialAccountId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("posts", {
      userId: args.userId,
      platform: args.platform,
      content: args.content,
      mediaUrl: args.mediaUrl,
      socialAccountId: args.socialAccountId,
      status: "Scheduled",
      scheduledAt: args.scheduledAt,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return id;
  },
});

// --- Get all posts for a user ---
export const getPostsForUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

// --- Get scheduled posts due now (for cron) ---
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

// --- Get scheduled posts for a user ---
export const getScheduledItemsForUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("status"), "Scheduled"))
      .collect();
  },
});

// --- Mark post as published ---
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

// --- Mark post as failed ---
export const markItemFailed = mutation({
  args: { postId: v.id("posts"), error: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.postId, {
      status: "Failed",
      updatedAt: Date.now(),
    });
  },
});

// --- Cancel a scheduled post ---
export const cancelScheduledItem = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.postId);
    if (!item) throw new Error("Post not found");
    if (item.status !== "Scheduled") throw new Error("Only scheduled posts can be cancelled");
    await ctx.db.delete(args.postId);
  },
});

// --- Delete a post ---
export const deletePost = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.postId);
  },
});

// --- Retry a failed post ---
export const retryPost = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.postId);
    if (!item) throw new Error("Post not found");
    if (item.status !== "Failed") throw new Error("Only failed posts can be retried");
    await ctx.db.patch(args.postId, {
      status: "Scheduled",
      scheduledAt: Date.now() + 60000,
      updatedAt: Date.now(),
    });
  },
});
