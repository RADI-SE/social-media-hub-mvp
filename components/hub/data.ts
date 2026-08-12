export type PostStatus = "Draft" | "Scheduled" | "Published";
export type CommentClassification =
  "Lead" | "Question" | "Complaint" | "Feedback" | "Engagement" | "Other";
export type TaskStatus = "Todo" | "InProgress" | "Completed";

export interface SocialAccount {
  id: string;
  userId: string;
  platform: string;
  accountName: string;
}

export interface Post {
  id: string;
  userId: string;
  socialAccountId: string;
  content: string;
  status: PostStatus;
  scheduledAt?: string;
}

export interface AICaption {
  id: string;
  postId: string;
  caption: string;
  language: "English" | "Arabic";
}

export interface Analytics {
  id: string;
  postId: string;
  impressions: number;
  likes: number;
  comments: number;
  leads: number;
}

export interface Comment {
  id: string;
  postId: string;
  authorName: string;
  content: string;
  classification: CommentClassification;
}

export interface FollowUpTask {
  id: string;
  commentId: string;
  userId: string;
  title: string;
  status: TaskStatus;
}

export const currentUser = {
  id: "user-01",
  name: "Noura Alharbi",
  email: "noura@spiders-ai.demo",
};

export const socialAccounts: SocialAccount[] = [
  {
    id: "account-01",
    userId: currentUser.id,
    platform: "Instagram",
    accountName: "@spiders_ai",
  },
  {
    id: "account-02",
    userId: currentUser.id,
    platform: "LinkedIn",
    accountName: "Spiders AI",
  },
  {
    id: "account-03",
    userId: currentUser.id,
    platform: "X",
    accountName: "@spiders_ai",
  },
];

export const posts: Post[] = [
  {
    id: "post-01",
    userId: currentUser.id,
    socialAccountId: "account-01",
    content:
      "Turn scattered customer conversations into clear, trackable action with Spiders AI.",
    status: "Published",
    scheduledAt: "2026-08-09T10:00:00+03:00",
  },
  {
    id: "post-02",
    userId: currentUser.id,
    socialAccountId: "account-02",
    content:
      "One workspace for content planning, monitoring, analytics, and follow-up.",
    status: "Scheduled",
    scheduledAt: "2026-08-12T13:30:00+03:00",
  },
  {
    id: "post-03",
    userId: currentUser.id,
    socialAccountId: "account-03",
    content: "Your new way of working is almost here.",
    status: "Draft",
  },
];

export const aiCaptions: AICaption[] = [
  {
    id: "caption-01",
    postId: "post-02",
    caption:
      "From conversation to action - faster, clearer, and all in one place.",
    language: "English",
  },
  {
    id: "caption-02",
    postId: "post-02",
    caption: "من المحادثة إلى الإنجاز - أسرع، أوضح، وفي مكان واحد.",
    language: "Arabic",
  },
];

export const analytics: Analytics[] = [
  {
    id: "analytics-01",
    postId: "post-01",
    impressions: 12840,
    likes: 932,
    comments: 86,
    leads: 14,
  },
  {
    id: "analytics-02",
    postId: "post-02",
    impressions: 4680,
    likes: 341,
    comments: 29,
    leads: 6,
  },
  {
    id: "analytics-03",
    postId: "post-03",
    impressions: 0,
    likes: 0,
    comments: 0,
    leads: 0,
  },
];

export const comments: Comment[] = [
  {
    id: "comment-01",
    postId: "post-01",
    authorName: "Reem Alqahtani",
    content: "Can your team contact me with pricing for a 20-person company?",
    classification: "Lead",
  },
  {
    id: "comment-02",
    postId: "post-01",
    authorName: "Faisal Omar",
    content: "Does the platform support Arabic captions?",
    classification: "Question",
  },
  {
    id: "comment-03",
    postId: "post-01",
    authorName: "Lina Haddad",
    content: "The unified workflow looks genuinely useful.",
    classification: "Feedback",
  },
  {
    id: "comment-04",
    postId: "post-02",
    authorName: "Maha Saleh",
    content: "Love the visual identity!",
    classification: "Engagement",
  },
];

export const followUpTasks: FollowUpTask[] = [
  {
    id: "task-01",
    commentId: "comment-01",
    userId: currentUser.id,
    title: "Contact Reem about team pricing",
    status: "InProgress",
  },
  {
    id: "task-02",
    commentId: "comment-02",
    userId: currentUser.id,
    title: "Reply with Arabic caption details",
    status: "Todo",
  },
  {
    id: "task-03",
    commentId: "comment-03",
    userId: currentUser.id,
    title: "Thank Lina for the feedback",
    status: "Completed",
  },
];

export function accountFor(post: Post) {
  return socialAccounts.find((account) => account.id === post.socialAccountId);
}

export function commentFor(task: FollowUpTask) {
  return comments.find((comment) => comment.id === task.commentId);
}
