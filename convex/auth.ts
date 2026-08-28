import { QueryCtx, MutationCtx } from "./_generated/server";

export async function requireAuth(ctx: QueryCtx | MutationCtx): Promise<string> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  return identity.subject; // Clerk user ID
}

export async function requireRole(
  ctx: QueryCtx | MutationCtx,
  allowedRoles: string[]
) {
  const clerkUserId = await requireAuth(ctx);
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
    .first();

  if (!user) {
    throw new Error("User not found");
  }

  const role = user.role ?? "social_media_user";
  if (!allowedRoles.includes(role)) {
    throw new Error("Forbidden: insufficient role");
  }

  return { ...user, role };
}