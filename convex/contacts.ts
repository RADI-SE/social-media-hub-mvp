import { query, mutation, internalQuery, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth, requireRole } from "./auth";
 
export const listMyContacts = query({
  handler: async (ctx) => {
    const clerkUserId = await requireAuth(ctx);
    return await ctx.db
      .query("contacts")
      .withIndex("by_owner", (q) => q.eq("ownerUserId", clerkUserId))
      .collect();
  },
});
 
export const listContactsForOwnerInternal = internalQuery({
  args: { ownerUserId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("contacts")
      .withIndex("by_owner", (q) => q.eq("ownerUserId", args.ownerUserId))
      .collect();
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
      if (!account || account.ownerUserId !== clerkUserId) {
        throw new Error("Unauthorized");
      }
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

// Update a contact (owner only)
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
    const clerkUserId = await requireAuth(ctx);
    const contact = await ctx.db.get(args.contactId);
    if (!contact || contact.ownerUserId !== clerkUserId) {
      throw new Error("Unauthorized");
    }

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

// Delete a contact (owner only)
export const deleteContact = mutation({
  args: { contactId: v.id("contacts") },
  handler: async (ctx, args) => {
    const clerkUserId = await requireAuth(ctx);
    const contact = await ctx.db.get(args.contactId);
    if (!contact || contact.ownerUserId !== clerkUserId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.contactId);
    return args.contactId;
  },
});

// List contacts by account (owner check)
export const listContactsByAccount = query({
  args: { accountId: v.id("accounts") },
  handler: async (ctx, args) => {
    const clerkUserId = await requireAuth(ctx);
    const account = await ctx.db.get(args.accountId);
    if (!account || account.ownerUserId !== clerkUserId) {
      throw new Error("Unauthorized");
    }

    return await ctx.db
      .query("contacts")
      .withIndex("by_account", (q) => q.eq("accountId", args.accountId))
      .collect();
  },
});

// List all contacts for the current owner
export const listContactsForOwner = query({
  handler: async (ctx) => {
    const clerkUserId = await requireAuth(ctx);
    return await ctx.db
      .query("contacts")
      .withIndex("by_owner", (q) => q.eq("ownerUserId", clerkUserId))
      .collect();
  },
});

// Get single contact (owner check)
export const getContact = query({
  args: { contactId: v.id("contacts") },
  handler: async (ctx, args) => {
    const clerkUserId = await requireAuth(ctx);
    const contact = await ctx.db.get(args.contactId);
    if (!contact || contact.ownerUserId !== clerkUserId) {
      return null;
    }
    return contact;
  },
});