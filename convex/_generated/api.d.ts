/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as accounts from "../accounts.js";
import type * as admin from "../admin.js";
import type * as analytics from "../analytics.js";
import type * as auth from "../auth.js";
import type * as comments from "../comments.js";
import type * as contacts from "../contacts.js";
import type * as events from "../events.js";
import type * as followUpTasks from "../followUpTasks.js";
import type * as growth from "../growth.js";
import type * as journey from "../journey.js";
import type * as posts from "../posts.js";
import type * as scoring from "../scoring.js";
import type * as seed from "../seed.js";
import type * as socialAccounts from "../socialAccounts.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  accounts: typeof accounts;
  admin: typeof admin;
  analytics: typeof analytics;
  auth: typeof auth;
  comments: typeof comments;
  contacts: typeof contacts;
  events: typeof events;
  followUpTasks: typeof followUpTasks;
  growth: typeof growth;
  journey: typeof journey;
  posts: typeof posts;
  scoring: typeof scoring;
  seed: typeof seed;
  socialAccounts: typeof socialAccounts;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
