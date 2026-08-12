import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAccountsForUser = query({
  args: { userId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.userId) return [];
    return await ctx.db
      .query("socialAccounts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const connectAccount = mutation({
  args: {
    userId: v.string(),
    platform: v.union(
      v.literal("Instagram"),
      v.literal("Facebook"),
      v.literal("LinkedIn"),
      v.literal("TikTok"),
      v.literal("X"),
    ),
    accountName: v.string(),
    accountHandle: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("socialAccounts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("platform"), args.platform))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, {
        accountName: args.accountName,
        accountHandle: args.accountHandle,
        status: "Connected",
      });
      return existing._id;
    }
    return await ctx.db.insert("socialAccounts", {
      userId: args.userId,
      platform: args.platform,
      accountName: args.accountName,
      accountHandle: args.accountHandle,
      status: "Connected",
      createdAt: Date.now(),
    });
  },
});

export const disconnectAccount = mutation({
  args: {
    userId: v.string(),
    platform: v.union(
      v.literal("Instagram"),
      v.literal("Facebook"),
      v.literal("LinkedIn"),
      v.literal("TikTok"),
      v.literal("X"),
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("socialAccounts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("platform"), args.platform))
      .first();
    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});