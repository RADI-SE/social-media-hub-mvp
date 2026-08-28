import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireRole } from "./auth";

export const listUsers = query({
  handler: async (ctx) => {
    await requireRole(ctx, ["admin"]);
    return await ctx.db.query("users").collect();
  },
});

export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(
      v.literal("admin"),
      v.literal("cmo"),
      v.literal("marketing_manager"),
      v.literal("social_media_user")
    ),
  },
  handler: async (ctx, args) => {
    await requireRole(ctx, ["admin"]);

    const targetUser = await ctx.db.get(args.userId);
    if (!targetUser) throw new Error("User not found");

    await ctx.db.patch(args.userId, { role: args.role });

    // Log the action
    await ctx.db.insert("logs", {
      userId: (await ctx.auth.getUserIdentity())?.subject,
      action: "user_role_updated",
      details: `User ${targetUser.clerkUserId} role changed to ${args.role}`,
      createdAt: Date.now(),
    });
  },
});

export const listLogs = query({
  handler: async (ctx) => {
    await requireRole(ctx, ["admin"]);
    return await ctx.db
      .query("logs")
      .withIndex("by_createdAt")
      .order("desc")
      .take(100);
  },
});