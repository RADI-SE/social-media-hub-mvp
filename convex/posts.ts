import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
 
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


export const markItemProcessing = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");
    if (post.status !== "Scheduled") {
      return;
    }
    await ctx.db.patch(args.postId, {
      status: "Processing",
      updatedAt: Date.now(),
    });
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
      error: args.error,
      updatedAt: Date.now(),
    });
  },
});


export const cancelScheduledItem = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.postId);
    if (!item) throw new Error("Post not found");
    if (item.status !== "Scheduled") throw new Error("Only scheduled posts can be cancelled");
    await ctx.db.delete(args.postId);
  },
});
 

export const deletePost = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.postId);
  },
});

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