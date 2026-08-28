import { mutation, query } from "./_generated/server";
import { v } from "convex/values";


export const saveFromClerk = mutation({
  args: {
    clerkUserId: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", args.clerkUserId))
      .unique();

    if (existingUser) {
      await ctx.db.patch(existingUser._id, {
        name: args.name ?? existingUser.name,
        email: args.email ?? existingUser.email,
      });
    } else {
      await ctx.db.insert("users", {
        clerkUserId: args.clerkUserId,
        name: args.name,
        email: args.email,
        role: "social_media_user",
        createdAt: Date.now(),
      });
    }
  },
});



export const current = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) =>
        q.eq("clerkUserId", identity.subject)
      )
      .unique();
    return user;
  },
});

export const getOrCreate = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const clerkUserId = identity.subject;

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) =>
        q.eq("clerkUserId", clerkUserId)
      )
      .unique();

    if (existingUser) return existingUser;
 
    const userId = await ctx.db.insert("users", {
      clerkUserId,
      role: "social_media_user",    
      createdAt: Date.now(),
    });

    return await ctx.db.get(userId);
  },
});
 
export const migrateRoles = mutation({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    for (const user of users) {
      if (!user.role) {
        await ctx.db.patch(user._id, { role: "social_media_user" });
      }
    }
  },
});