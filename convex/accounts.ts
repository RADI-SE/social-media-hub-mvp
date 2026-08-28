import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth, requireRole } from "./auth";

export const createAccount = mutation({
  args: {
    name: v.string(),
    domain: v.optional(v.string()),
    stage: v.union(
      v.literal("Visitor"),
      v.literal("Lead"),
      v.literal("MQL"),
      v.literal("Customer"),
      v.literal("Churned")
    ),
    pipeline: v.optional(v.float64()),
    ltv: v.optional(v.float64()),
    spend: v.optional(v.float64()),
  },
  handler: async (ctx, args) => {
    const user = await requireRole(ctx, ["admin", "marketing_manager"]);
    const now = Date.now();

    const accountId = await ctx.db.insert("accounts", {
      ownerUserId: user.clerkUserId,
      name: args.name,
      domain: args.domain,
      stage: args.stage,
      pipeline: args.pipeline ?? 0,
      ltv: args.ltv ?? 0,
      spend: args.spend ?? 0,
      intentScore: 0,
      adoptionScore: 0,
      engagementScore: 0,
      score: 0,
      createdAt: now,
      updatedAt: now,
    });

    return accountId;
  },
});
export const updateAccount = mutation({
  args: {
    accountId: v.id("accounts"),
    name: v.optional(v.string()),
    domain: v.optional(v.string()),
    stage: v.optional(
      v.union(
        v.literal("Visitor"),
        v.literal("Lead"),
        v.literal("MQL"),
        v.literal("Customer"),
        v.literal("Churned")
      )
    ),
    pipeline: v.optional(v.float64()),
    ltv: v.optional(v.float64()),
  },
  handler: async (ctx, args) => {
    const clerkUserId = await requireAuth(ctx);
    const account = await ctx.db.get(args.accountId);
    if (!account) throw new Error("Account not found");

    // Allow only the owner or an admin
    if (account.ownerUserId !== clerkUserId) {
      const user = await requireRole(ctx, ["admin"]);
      if (!user) throw new Error("Unauthorized");
    }

    const updates: any = { updatedAt: Date.now() };
    if (args.name !== undefined) updates.name = args.name;
    if (args.domain !== undefined) updates.domain = args.domain;
    if (args.stage !== undefined) updates.stage = args.stage;
    if (args.pipeline !== undefined) updates.pipeline = args.pipeline;
    if (args.ltv !== undefined) updates.ltv = args.ltv;

    await ctx.db.patch(args.accountId, updates);
    return args.accountId;
  },
});

// Delete an account (owner or admin)
export const deleteAccount = mutation({
  args: { accountId: v.id("accounts") },
  handler: async (ctx, args) => {
    const clerkUserId = await requireAuth(ctx);
    const account = await ctx.db.get(args.accountId);
    if (!account) throw new Error("Account not found");

    if (account.ownerUserId !== clerkUserId) {
      const user = await requireRole(ctx, ["admin"]);
      if (!user) throw new Error("Unauthorized");
    }

    // Optionally delete related contacts/events first
    await ctx.db.delete(args.accountId);
    return args.accountId;
  },
});

// Get single account (owner or admin)
export const getAccount = query({
  args: { accountId: v.id("accounts") },
  handler: async (ctx, args) => {
    const clerkUserId = await requireAuth(ctx);
    const account = await ctx.db.get(args.accountId);
    if (!account) return null;

    if (account.ownerUserId !== clerkUserId) {
      const user = await requireRole(ctx, ["admin"]);
      if (!user) throw new Error("Unauthorized");
    }
    return account;
  },
});