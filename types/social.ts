// types/social.ts
import type { Platform } from './social-account';

export type ChannelId = 'facebook' | 'instagram' | 'twitter';

export type ChannelStatus = {
  connected: boolean;
  loading: boolean;
  error?: string;
};

export type ChannelStatuses = Record<ChannelId, ChannelStatus>;

export type ChannelConfig = {
  id: ChannelId;
  name: string;
  platform: Platform;        // matches the Convex platform field
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  description: string;
};