import { query } from "./_generated/server";
import { requireAuth } from "./auth";

// Every workspace role shares the same account portfolio - a CMO and a
// marketing manager need to see the same companies, not just what they
// personally created.
export const listAccounts = query({
  handler: async (ctx) => {
    await requireAuth(ctx);
    return await ctx.db.query("accounts").order("desc").take(500);
  },
});
