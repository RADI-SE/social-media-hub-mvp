// types/social-account.ts
export interface SocialAccount {
  _id: string;
  userId: string;
  platform: string;
  accountName: string;
  status?: "Connected" | "Disconnected";
}

export type Platform = "Instagram" | "Facebook" | "LinkedIn" | "TikTok" | "X";
