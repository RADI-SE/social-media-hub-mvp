import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

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
      title: args.title,
      status: "Todo",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
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
      .collect();
  },
});

export const getTasksForComment = query({
  args: { commentId: v.id("comments") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("followUpTasks")
      .withIndex("by_commentId", (q) => q.eq("commentId", args.commentId))
      .collect();
  },
});