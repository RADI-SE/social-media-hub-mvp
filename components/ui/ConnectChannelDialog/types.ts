import { ComponentType, SVGProps } from "react";

export interface Channel {
  id: string;
  name: string;
  subtitle?: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
}

export interface ConnectChannelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect?: (channelId: string) => void;
  channels?: Channel[];
  connectedChannels?: string[];
  title?: string;
  description?: string;
}
