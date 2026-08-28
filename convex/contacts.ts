import { query, mutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth, requireRole } from "./auth";

// Shared across the whole team - a contact created by one marketing manager
// still needs to show up for the CMO and social media users working the
// same account.
export const listContacts = query({
  handler: async (ctx) => {
    await requireAuth(ctx);
    return await ctx.db.query("contacts").order("desc").take(500);
  },
});

export const listContactsForOwnerInternal = internalQuery({
  args: { ownerUserId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("contacts")
      .withIndex("by_owner", (q) => q.eq("ownerUserId", args.ownerUserId))
      .take(500);
  },
});

export const createContact = mutation({
  args: {
    accountId: v.optional(v.id("accounts")),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    role: v.optional(v.string()),
    socialHandles: v.optional(v.record(v.string(), v.string())),
  },
  handler: async (ctx, args) => {
    const clerkUserId = await requireAuth(ctx);

    if (args.accountId) {
      const account = await ctx.db.get(args.accountId);
      if (!account) throw new Error("Account not found");
    }

    const contactId = await ctx.db.insert("contacts", {
      ownerUserId: clerkUserId,
      accountId: args.accountId,
      name: args.name,
      email: args.email,
      role: args.role,
      socialHandles: args.socialHandles,
      createdAt: Date.now(),
    });

    return contactId;
  },
});

// Update a contact (any authenticated teammate - contacts are shared)
export const updateContact = mutation({
  args: {
    contactId: v.id("contacts"),
    accountId: v.optional(v.id("accounts")),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    role: v.optional(v.string()),
    socialHandles: v.optional(v.record(v.string(), v.string())),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const contact = await ctx.db.get(args.contactId);
    if (!contact) throw new Error("Contact not found");

    const updates: any = {};
    if (args.accountId !== undefined) updates.accountId = args.accountId;
    if (args.name !== undefined) updates.name = args.name;
    if (args.email !== undefined) updates.email = args.email;
    if (args.role !== undefined) updates.role = args.role;
    if (args.socialHandles !== undefined) updates.socialHandles = args.socialHandles;

    if (Object.keys(updates).length > 0) {
      await ctx.db.patch(args.contactId, updates);
    }
    return args.contactId;
  },
});

// Delete a contact (admin or marketing manager only - destructive)
export const deleteContact = mutation({
  args: { contactId: v.id("contacts") },
  handler: async (ctx, args) => {
    await requireRole(ctx, ["admin", "marketing_manager"]);
    const contact = await ctx.db.get(args.contactId);
    if (!contact) throw new Error("Contact not found");

    await ctx.db.delete(args.contactId);
    return args.contactId;
  },
});

// List contacts by account (shared read)
export const listContactsByAccount = query({
  args: { accountId: v.id("accounts") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    return await ctx.db
      .query("contacts")
      .withIndex("by_account", (q) => q.eq("accountId", args.accountId))
      .take(500);
  },
});

// Get single contact (shared read)
export const getContact = query({
  args: { contactId: v.id("contacts") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    return await ctx.db.get(args.contactId);
  },
});
