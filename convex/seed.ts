import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

const DEMO_ACCOUNTS = [
  { name: "Northstar Retail", domain: "northstarretail.com", stage: "MQL", intentScore: 91, adoptionScore: 40, engagementScore: 70, pipeline: 540000, ltv: 720000, spend: 150000 },
  { name: "Crescent Labs", domain: "crescentlabs.io", stage: "Lead", intentScore: 78, adoptionScore: 60, engagementScore: 55, pipeline: 276000, ltv: 400000, spend: 80000 },
  { name: "Masar Logistics", domain: "masarlogistics.com", stage: "Lead", intentScore: 69, adoptionScore: 30, engagementScore: 65, pipeline: 210000, ltv: 300000, spend: 60000 },
  { name: "Namaa Health", domain: "namaahealth.com", stage: "Customer", intentScore: 74, adoptionScore: 85, engagementScore: 60, pipeline: 720000, ltv: 900000, spend: 200000 },
  { name: "Vertex Cloud", domain: "vertexcloud.dev", stage: "Customer", intentScore: 66, adoptionScore: 50, engagementScore: 45, pipeline: 144000, ltv: 200000, spend: 40000 },
  { name: "Amwaj Foods", domain: "amwajfoods.com", stage: "Visitor", intentScore: 12, adoptionScore: 0, engagementScore: 18, pipeline: 0, ltv: 0, spend: 0 },
  { name: "Falcon Robotics", domain: "falconrobotics.ai", stage: "Visitor", intentScore: 8, adoptionScore: 0, engagementScore: 22, pipeline: 0, ltv: 0, spend: 0 },
  { name: "Orchid Media Group", domain: "orchidmedia.com", stage: "MQL", intentScore: 88, adoptionScore: 35, engagementScore: 72, pipeline: 480000, ltv: 650000, spend: 120000 },
  { name: "Sahara Fintech", domain: "saharafintech.com", stage: "Lead", intentScore: 55, adoptionScore: 20, engagementScore: 48, pipeline: 165000, ltv: 240000, spend: 35000 },
  { name: "Blue Harbor Shipping", domain: "blueharbor.com", stage: "Customer", intentScore: 60, adoptionScore: 92, engagementScore: 58, pipeline: 380000, ltv: 610000, spend: 175000 },
  { name: "Zenith Realty", domain: "zenithrealty.com", stage: "Churned", intentScore: 15, adoptionScore: 10, engagementScore: 5, pipeline: 0, ltv: 90000, spend: 25000 },
  { name: "Pioneer Manufacturing", domain: "pioneermfg.com", stage: "Churned", intentScore: 20, adoptionScore: 8, engagementScore: 10, pipeline: 0, ltv: 120000, spend: 45000 },
] as const;

const CONTACT_ROLES = ["CMO", "VP Marketing", "Growth Lead", "Head of Ops", "Founder"];

const EVENT_TEMPLATES = [
  { type: "page_view", source: "website" },
  { type: "email_open", source: "outbound_email" },
  { type: "demo_request", source: "website" },
  { type: "content_download", source: "linkedin_ad" },
  { type: "webinar_attended", source: "webinar" },
];

export const seedGrowthData = internalMutation({
  args: {
    ownerUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    let accountCount = 0;
    let contactCount = 0;
    let eventCount = 0;

    for (const acc of DEMO_ACCOUNTS) {
      const accountId = await ctx.db.insert("accounts", {
        ownerUserId: args.ownerUserId,
        name: acc.name,
        domain: acc.domain,
        stage: acc.stage as any,
        intentScore: acc.intentScore,
        adoptionScore: acc.adoptionScore,
        engagementScore: acc.engagementScore,
        pipeline: acc.pipeline,
        ltv: acc.ltv,
        spend: acc.spend,
        score: acc.intentScore * 0.5 + acc.adoptionScore * 0.3 + acc.engagementScore * 0.2,
        createdAt: now,
        updatedAt: now,
      });
      accountCount++;

      const slug = acc.domain.split(".")[0];
      const contactId = await ctx.db.insert("contacts", {
        ownerUserId: args.ownerUserId,
        accountId,
        name: `${acc.name.split(" ")[0]} Contact`,
        email: `contact@${acc.domain}`,
        role: CONTACT_ROLES[accountCount % CONTACT_ROLES.length],
        socialHandles: { linkedin: `linkedin.com/company/${slug}` },
        createdAt: now,
      });
      contactCount++;

      const eventsForAccount = EVENT_TEMPLATES.slice(0, 2 + (accountCount % 3));
      for (const [i, tmpl] of eventsForAccount.entries()) {
        await ctx.db.insert("events", {
          ownerUserId: args.ownerUserId,
          contactId,
          accountId,
          userId: args.ownerUserId,
          type: tmpl.type,
          source: tmpl.source,
          payload: {},
          createdAt: now - (eventsForAccount.length - i) * 86400000,
        });
        eventCount++;
      }
    }

    return `Seeded ${accountCount} accounts, ${contactCount} contacts, ${eventCount} events`;
  },
});
