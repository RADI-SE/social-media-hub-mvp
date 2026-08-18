import { Channel } from "./types";
import { FacebookIcon, InstagramIcon } from "../ChannelIcons";

export const defaultChannels: Channel[] = [
  {
    id: "facebook",
    name: "Facebook",
    subtitle: "Page or Group",
    icon: FacebookIcon,
  },
  {
    id: "instagram",
    name: "Instagram",
    subtitle: "Business or creator account",
    icon: InstagramIcon,
  },
];
