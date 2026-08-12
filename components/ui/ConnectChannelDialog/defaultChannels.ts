import { Channel } from './types';
import { FacebookIcon, TwitterIcon } from '../ChannelIcons'; // adjust path

export const defaultChannels: Channel[] = [
  { id: 'facebook', name: 'Facebook', subtitle: 'Page or Group', icon: FacebookIcon },
  { id: 'twitter', name: 'Twitter / X', subtitle: 'Profile', icon: TwitterIcon },
  {
    id: 'startpage',
    name: 'Start Page',
    subtitle: 'Simple, powerful link-in-bio',
  },
];