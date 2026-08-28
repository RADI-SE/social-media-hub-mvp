import { internalMutation, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth, requireRole } from "./auth";

// Internal mutation: automatically update journey stage based on scores
export const updateJourneyStage = internalMutation({
  args: { accountId: v.id("accounts") },
  handler: async (ctx, args) => {
    const account = await ctx.db.get(args.accountId);
    if (!account) throw new Error("Account not found");

    const currentStage = account.stage;
    const intent = account.intentScore ?? 0;
    const adoption = account.adoptionScore ?? 0;

    let newStage = currentStage;

    // Define transition rules
    if (currentStage === "Visitor" && intent > 10) {
      newStage = "Lead";
    } else if (currentStage === "Lead" && intent > 50) {
      newStage = "MQL";
    } else if (currentStage === "MQL" && adoption > 20 && intent > 30) {
      newStage = "Customer";
    }

    if (newStage !== currentStage) {
      await ctx.db.patch(args.accountId, {
        stage: newStage,
        updatedAt: Date.now(),
      });
    }

    return newStage;
  },
});

// Manual override of stage (allowed for marketing_manager and admin)
export const manualSetStage = mutation({
  args: {
    accountId: v.id("accounts"),
    stage: v.union(
      v.literal("Visitor"),
      v.literal("Lead"),
      v.literal("MQL"),
      v.literal("Customer"),
      v.literal("Churned")
    ),
  },
  handler: async (ctx, args) => {
    const clerkUserId = await requireAuth(ctx);

    // Verify account ownership or role
    const account = await ctx.db.get(args.accountId);
    if (!account) throw new Error("Account not found");

    if (account.ownerUserId !== clerkUserId) {
      // If not owner, must be admin or marketing_manager
      const user = await requireRole(ctx, ["admin", "marketing_manager"]);
      if (!user) throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.accountId, {
      stage: args.stage,
      updatedAt: Date.now(),
    });

    return args.accountId;
  },
});

 