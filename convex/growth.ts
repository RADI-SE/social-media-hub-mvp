import { query } from "./_generated/server";
import { requireAuth } from "./auth";

export const listAccountsForOwner = query({
  handler: async (ctx) => {
    const clerkUserId = await requireAuth(ctx); 
    return await ctx.db
      .query("accounts")
      .withIndex("by_owner", (q) => q.eq("ownerUserId", clerkUserId))
      .collect();
  },
});