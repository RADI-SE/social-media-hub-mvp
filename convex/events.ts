import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./auth";

// Internal mutation to capture an event (called by Playwright workers or API)
// This function is trusted and does not require user auth; it's called from server-side code.
export const captureEvent = internalMutation({
  args: {
    ownerUserId: v.string(),      // clerkUserId of the owner
    contactId: v.optional(v.id("contacts")),
    accountId: v.optional(v.id("accounts")),
    type: v.string(),
    source: v.string(),
    payload: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const eventId = await ctx.db.insert("events", {
      ownerUserId: args.ownerUserId,
      contactId: args.contactId,
      accountId: args.accountId,
      userId: args.ownerUserId,   // optional: store owner as userId for convenience
      type: args.type,
      source: args.source,
      payload: args.payload,
      createdAt: Date.now(),
    });

    // After capturing event, trigger scoring and journey stage update
    // We'll call internal mutations for scoring and stage update.
    // For now, just return the eventId.
    return eventId;
  },
});

// List events for a specific account (shared read)
export const listEventsByAccount = query({
  args: { accountId: v.id("accounts") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    return await ctx.db
      .query("events")
      .withIndex("by_account", (q) => q.eq("accountId", args.accountId))
      .take(500);
  },
});

// List events for a specific contact (shared read)
export const listEventsByContact = query({
  args: { contactId: v.id("contacts") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    return await ctx.db
      .query("events")
      .withIndex("by_contact", (q) => q.eq("contactId", args.contactId))
      .take(500);
  },
});

// Recent activity feed across the whole workspace.
export const listEvents = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const limit = args.limit ?? 50;
    return await ctx.db.query("events").order("desc").take(limit);
  },
});