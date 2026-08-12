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
    userId: v.id("users"),
    socialAccountId: v.id("socialAccounts"),
 
    type: v.union(
      v.literal("post"),
      v.literal("comment"),
    ),

    content: v.string(),
    mediaUrl: v.optional(v.string()),
 
    targetUrl: v.optional(v.string()),

    status: v.union(
      v.literal("Draft"),
      v.literal("Scheduled"),
      v.literal("Published"),
      v.literal("Failed"),
    ),

    scheduledAt: v.optional(v.number()),
    publishedAt: v.optional(v.number()),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_socialAccountId", ["socialAccountId"])
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
    postId: v.id("posts"),

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

    createdAt: v.number(),
  })
    .index("by_postId", ["postId"])
    .index("by_classification", ["classification"]),


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