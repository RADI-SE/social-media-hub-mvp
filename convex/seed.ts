import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const seedAccounts = internalMutation({
  args: {
    ownerUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const demo = [
      { name: "Northstar Retail", stage: "MQL", intentScore: 91, adoptionScore: 40, engagementScore: 70, pipeline: 540000, ltv: 720000, spend: 150000 },
      { name: "Crescent Labs", stage: "Lead", intentScore: 78, adoptionScore: 60, engagementScore: 55, pipeline: 276000, ltv: 400000, spend: 80000 },
      { name: "Masar Logistics", stage: "Lead", intentScore: 69, adoptionScore: 30, engagementScore: 65, pipeline: 210000, ltv: 300000, spend: 60000 },
      { name: "Namaa Health", stage: "Customer", intentScore: 74, adoptionScore: 85, engagementScore: 60, pipeline: 720000, ltv: 900000, spend: 200000 },
      { name: "Vertex Cloud", stage: "Customer", intentScore: 66, adoptionScore: 50, engagementScore: 45, pipeline: 144000, ltv: 200000, spend: 40000 },
    ];

    for (const acc of demo) {
      await ctx.db.insert("accounts", {
        ownerUserId: args.ownerUserId,
        name: acc.name,
        stage: acc.stage as any,
        intentScore: acc.intentScore,
        adoptionScore: acc.adoptionScore,
        engagementScore: acc.engagementScore,
        pipeline: acc.pipeline,
        ltv: acc.ltv,
        spend: acc.spend,
        score: acc.intentScore * 0.5 + acc.adoptionScore * 0.3 + acc.engagementScore * 0.2,
        createdAt: now,
        updatedAt: now,
      });
    }
    return "Seeded 5 demo accounts";
  },
});