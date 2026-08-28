import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({

  users: defineTable({
    clerkUserId: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    role: v.optional(               // <-- now optional
      v.union(
        v.literal("admin"),
        v.literal("cmo"),
        v.literal("marketing_manager"),
        v.literal("social_media_user")
      )
    ),
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
    status: v.union(
      v.literal("Scheduled"),
      v.literal("Processing"),
      v.literal("PendingApproval"),
      v.literal("Published"),
      v.literal("Failed")
    ),
    scheduledAt: v.optional(v.number()),
    publishedAt: v.optional(v.number()),
    postUrl: v.optional(v.string()),
    platformPostId: v.optional(v.string()),
    analyticsCollected: v.optional(v.boolean()),
    lastAnalyticsScraped: v.optional(v.number()),
    error: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_status", ["status"]),

  analytics: defineTable({
    postId: v.id("posts"),
    userId: v.string(),
    platform: v.string(),
    likes: v.number(),
    comments: v.number(),
    shares: v.number(),
    scrapedAt: v.number(),
    createdAt: v.number(),
  })
    .index("by_postId", ["postId"])
    .index("by_userId", ["userId"])
    .index("by_postId_scrapedAt", ["postId", "scrapedAt"]),

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

accounts: defineTable({
  ownerUserId: v.string(),
  name: v.string(),
  domain: v.optional(v.string()),
  score: v.optional(v.float64()),
  intentScore: v.optional(v.float64()),
  adoptionScore: v.optional(v.float64()),
  engagementScore: v.optional(v.float64()),
  pipeline: v.optional(v.float64()),   // NEW
  ltv: v.optional(v.float64()),        // NEW
  spend: v.optional(v.float64()),      // NEW
  stage: v.union(
    v.literal("Visitor"),
    v.literal("Lead"),
    v.literal("MQL"),
    v.literal("Customer"),
    v.literal("Churned")
  ),
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_owner", ["ownerUserId"])
  .index("by_domain", ["domain"]),

contacts: defineTable({
  ownerUserId: v.string(),          // new field: owner of the contact (clerkUserId)
  accountId: v.optional(v.id("accounts")),
  clerkUserId: v.optional(v.string()),   // if contact is also a user in the system
  name: v.optional(v.string()),
  email: v.optional(v.string()),
  role: v.optional(v.string()),
  socialHandles: v.optional(v.record(v.string(), v.string())),
  createdAt: v.number(),
})
  .index("by_owner", ["ownerUserId"])
  .index("by_account", ["accountId"])
  .index("by_clerkUserId", ["clerkUserId"]),

events: defineTable({
  ownerUserId: v.string(),          // new field: owner of the event (clerkUserId)
  contactId: v.optional(v.id("contacts")),
  accountId: v.optional(v.id("accounts")),
  userId: v.optional(v.string()),   // internal user if event tied to them
  type: v.string(),
  source: v.string(),
  payload: v.optional(v.any()),
  createdAt: v.number(),
})
  .index("by_owner", ["ownerUserId"])
  .index("by_contact", ["contactId"])
  .index("by_account", ["accountId"])
  .index("by_user", ["userId"])
  .index("by_type_created", ["type", "createdAt"]),

  logs: defineTable({
    userId: v.optional(v.string()),
    action: v.string(),
    details: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_createdAt", ["createdAt"]),
});