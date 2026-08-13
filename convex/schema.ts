import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({

  users: defineTable({
    clerkUserId: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_clerkUserId", ["clerkUserId"]),


  socialAccounts: defineTable({
    userId: v.optional(v.string()),
    platform: v.union(
      v.literal("Instagram"),
      v.literal("Facebook"),
      v.literal("LinkedIn"),
      v.literal("TikTok"),
      v.literal("X"),
    ),
    accountName: v.string(),
    accountHandle: v.string(),
    status: v.union(
      v.literal("Connected"),
      v.literal("Disconnected"),
    ),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_platform", ["platform"]),

  posts: defineTable({
    userId: v.string(),
    platform: v.union(
      v.literal("Instagram"),
      v.literal("Facebook"),
      v.literal("LinkedIn"),
      v.literal("TikTok"),
      v.literal("X")
    ),
    content: v.string(),
    mediaUrl: v.optional(v.string()),
    socialAccountId: v.optional(v.string()),
    status: v.union(
      v.literal("Draft"),
      v.literal("Scheduled"),
      v.literal("Published"),
      v.literal("Failed")
    ),
    scheduledAt: v.optional(v.number()),
    publishedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
    type: v.optional(v.union(v.literal("post"), v.literal("comment"))), // add this to allow existing data
  })
    .index("by_userId", ["userId"])
    .index("by_status", ["status"])
    .index("by_scheduledAt", ["scheduledAt"]),


  analytics: defineTable({
    postId: v.id("posts"),

    impressions: v.number(),
    likes: v.number(),
    comments: v.number(),
    leads: v.number(),

    recordedAt: v.number(),
  }).index("by_postId", ["postId"]),


  comments: defineTable({
    userId: v.optional(v.string()),
    postId: v.optional(v.string()),
    targetUrl: v.optional(v.string()),
    authorName: v.string(),
    content: v.string(),
    classification: v.union(
      v.literal("Lead"),
      v.literal("Question"),
      v.literal("Complaint"),
      v.literal("Feedback"),
      v.literal("Engagement"),
      v.literal("Other"),
    ),
    scheduledAt: v.optional(v.number()),
    status: v.optional(v.union(   // make optional
      v.literal("Scheduled"),
      v.literal("Published"),
      v.literal("Failed"),
    )),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_postId", ["postId"])
    .index("by_classification", ["classification"])
    .index("by_status_scheduled", ["status", "scheduledAt"]),

  followUpTasks: defineTable({
    commentId: v.id("comments"),
    userId: v.id("users"),

    title: v.string(),

    status: v.union(
      v.literal("Todo"),
      v.literal("InProgress"),
      v.literal("Completed"),
    ),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_commentId", ["commentId"])
    .index("by_status", ["status"]),
});