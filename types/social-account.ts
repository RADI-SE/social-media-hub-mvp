// types/social-account.ts
export interface SocialAccount {
  _id: string;
  userId: string;
  platform: string;
  accountName: string;
}

export type Platform = "Instagram" | "Facebook" | "LinkedIn" | "TikTok" | "X";