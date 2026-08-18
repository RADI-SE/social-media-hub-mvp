import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
} from '@/components/ui/ChannelIcons';
import type { ChannelConfig } from '@/types/social';

export const channelConfigs: Record<ChannelConfig['id'], ChannelConfig> = {
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    platform: 'Facebook',
    icon: FacebookIcon,
    gradient: 'bg-blue-600',
    description: 'Social account',
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    platform: 'Instagram',
    icon: InstagramIcon,
    gradient: 'bg-gradient-to-r from-fuchsia-500 via-rose-500 to-amber-400',
    description: 'Workspace account',
  },
  twitter: {
    id: 'twitter',
    name: 'X (Twitter)',
    platform: 'X',
    icon: TwitterIcon,
    gradient: 'bg-black',
    description: 'Social account',
  },
};

export const channelList = Object.values(channelConfigs);