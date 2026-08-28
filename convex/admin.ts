import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth, requireRole } from "./auth";

export const listUsers = query({
  handler: async (ctx) => {
    await requireRole(ctx, ["admin"]);
    return await ctx.db.query("users").take(500);
  },
});

// Minimal teammate directory for assignee pickers. Open to the roles that can
// delegate follow-up tasks, without exposing the full admin user list.
export const listTeammates = query({
  handler: async (ctx) => {
    await requireRole(ctx, ["admin", "cmo", "marketing_manager"]);
    const users = await ctx.db.query("users").take(500);
    return users.map((user) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role ?? "social_media_user",
    }));
  },
});

// Lets the client know whether the "claim admin" escape hatch should be shown.
export const hasAdmin = query({
  handler: async (ctx) => {
    await requireAuth(ctx);
    const users = await ctx.db.query("users").take(500);
    return users.some((user) => user.role === "admin");
  },
});

// One-time bootstrap: if the workspace currently has zero admins, the calling
// user can self-promote. Prevents a role change from permanently locking
// everyone out of role management. No-ops once any admin exists.
export const bootstrapAdmin = mutation({
  handler: async (ctx) => {
    const clerkUserId = await requireAuth(ctx);
    const users = await ctx.db.query("users").take(500);
    if (users.some((user) => user.role === "admin")) {
      throw new Error("An admin already exists for this workspace");
    }

    const callingUser = users.find((user) => user.clerkUserId === clerkUserId);
    if (!callingUser) throw new Error("User not found");

    await ctx.db.patch(callingUser._id, { role: "admin" });
    await ctx.db.insert("logs", {
      userId: clerkUserId,
      action: "user_role_updated",
      details: `User ${clerkUserId} self-promoted to admin (no admin existed)`,
      createdAt: Date.now(),
    });
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