import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./auth";

// Internal mutation to recalculate scores for a single account based on its events
export const calculateAccountScores = internalMutation({
  args: { accountId: v.id("accounts") },
  handler: async (ctx, args) => {
    const account = await ctx.db.get(args.accountId);
    if (!account) throw new Error("Account not found");

    // Fetch all events for this account
    const events = await ctx.db
      .query("events")
      .withIndex("by_account", (q) => q.eq("accountId", args.accountId))
      .collect();

    let intentScore = 0;
    let adoptionScore = 0;
    let engagementScore = 0;

    for (const event of events) {
      const type = event.type;
      const payload = event.payload as any;

      // Intent signals (buying intent)
      if (type === "social_comment" && payload?.text?.includes("pricing")) {
        intentScore += 10;
      } else if (type === "website_visit" && payload?.page === "/pricing") {
        intentScore += 20;
      } else if (type === "demo_request") {
        intentScore += 50;
      } else if (type === "trial_started") {
        intentScore += 40;
      } else if (type === "renewal_viewed") {
        intentScore += 30;
      }

      // Adoption signals (product usage)
      if (type === "product_signup") {
        adoptionScore += 40;
      } else if (type === "feature_used") {
        adoptionScore += 15;
      } else if (type === "post_created") {
        adoptionScore += 10;
      } else if (type === "team_invited") {
        adoptionScore += 25;
      }

      // Engagement signals (interactions)
      if (type === "social_like") {
        engagementScore += 2;
      } else if (type === "social_comment") {
        engagementScore += 5;
      } else if (type === "social_share") {
        engagementScore += 8;
      } else if (type === "campaign_click") {
        engagementScore += 10;
      }
    }

    // Compute weighted total score (adjust weights as needed)
    const totalScore = intentScore * 0.5 + adoptionScore * 0.3 + engagementScore * 0.2;

    await ctx.db.patch(args.accountId, {
      intentScore,
      adoptionScore,
      engagementScore,
      score: totalScore,
      updatedAt: Date.now(),
    });

    return {
      intentScore,
      adoptionScore,
      engagementScore,
      score: totalScore,
    };
  },
});

// Query to get detailed score breakdown for an account (shared read)
export const getAccountScoreBreakdown = query({
  args: { accountId: v.id("accounts") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    return await ctx.db.get(args.accountId);
  },
});