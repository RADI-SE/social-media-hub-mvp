import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireRole } from "./auth";

// Self-service: convert a comment into a task for the person viewing it.
export const createFollowUpTask = mutation({
  args: {
    commentId: v.id("comments"),
    userId: v.id("users"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("followUpTasks", {
      commentId: args.commentId,
      userId: args.userId,
      assignedByUserId: args.userId,
      title: args.title,
      status: "Todo",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Delegation: a CMO / marketing manager / admin hands a task to a teammate.
export const assignFollowUpTask = mutation({
  args: {
    assigneeUserId: v.id("users"),
    title: v.string(),
    commentId: v.optional(v.id("comments")),
  },
  handler: async (ctx, args) => {
    const assigner = await requireRole(ctx, ["admin", "cmo", "marketing_manager"]);
    const assignee = await ctx.db.get(args.assigneeUserId);
    if (!assignee) throw new Error("Assignee not found");

    return await ctx.db.insert("followUpTasks", {
      commentId: args.commentId,
      userId: args.assigneeUserId,
      assignedByUserId: assigner._id,
      title: args.title,
      status: "Todo",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Team-wide view for the roles that can delegate tasks.
export const listTeamTasks = query({
  handler: async (ctx) => {
    await requireRole(ctx, ["admin", "cmo", "marketing_manager"]);
    return await ctx.db.query("followUpTasks").order("desc").take(300);
  },
});

export const updateTaskStatus = mutation({
  args: {
    taskId: v.id("followUpTasks"),
    status: v.union(v.literal("Todo"), v.literal("InProgress"), v.literal("Completed")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.taskId, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

export const getTasksForUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("followUpTasks")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(300);
  },
});

export const getTasksForComment = query({
  args: { commentId: v.id("comments") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("followUpTasks")
      .withIndex("by_commentId", (q) => q.eq("commentId", args.commentId))
      .take(50);
  },
});