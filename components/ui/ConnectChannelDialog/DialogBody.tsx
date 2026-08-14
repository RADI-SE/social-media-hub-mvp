"use client";

import { Channel } from "./types";
import { ChannelCard } from "./ChannelCard";

interface DialogBodyProps {
  channels: Channel[];
  onChannelClick: (id: string) => void;
}

export function DialogBody({ channels, onChannelClick }: DialogBodyProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {channels.map((channel) => (
          <ChannelCard
            key={channel.id}
            channel={channel}
            onClick={onChannelClick}
          />
        ))}
      </div>
    </div>
  );
}
