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
    platform: v.union(v.literal("Instagram"), v.literal("Facebook"), v.literal("LinkedIn"), v.literal("TikTok"), v.literal("X")),
    content: v.string(),
    mediaUrl: v.optional(v.string()),
    socialAccountId: v.optional(v.string()),
    status: v.union(v.literal("Scheduled"), v.literal("Processing"), v.literal("Published"), v.literal("Failed")),
    scheduledAt: v.optional(v.number()),
    publishedAt: v.optional(v.number()),
    error: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_status", ["status"]),


  analytics: defineTable({
    postId: v.id("posts"),

    impressions: v.number(),
    likes: v.number(),
    comments: v.number(),
    leads: v.number(),

    recordedAt: v.number(),
  }).index("by_postId", ["postId"]),


  comments: defineTable({
    userId: v.string(),
    targetUrl: v.string(),
    postId: v.optional(v.id("posts")), 
    authorName: v.string(),
    content: v.string(),
    classification: v.string(),
    platform: v.union(v.literal("facebook"), v.literal("instagram")), 
    scheduledAt: v.optional(v.number()),
    status: v.union(
      v.literal("Scheduled"),
      v.literal("Processing"), 
      v.literal("Published"),
      v.literal("Failed")
    ),
    error: v.optional(v.string()), 
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_status_scheduled", ["status", "scheduledAt"])
    .index("by_platform", ["platform"])
    .index("by_postId", ["postId"]),

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