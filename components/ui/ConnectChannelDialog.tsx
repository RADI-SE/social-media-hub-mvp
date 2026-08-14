"use client";

import { useRef } from "react";
import { ConnectChannelDialogProps } from "./ConnectChannelDialog/types";
import { defaultChannels } from "./ConnectChannelDialog/defaultChannels";
import { DialogHeader } from "./ConnectChannelDialog/DialogHeader";
import { DialogBody } from "./ConnectChannelDialog/DialogBody";

export function ConnectChannelDialog({
  isOpen,
  onClose,
  onConnect,
  channels = defaultChannels,
  title = "Connect a channel",
  description = "Connect a social media channel to Spiders AI · Social Media Marketing Hub MVP.",
}: ConnectChannelDialogProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  const handleChannelClick = (channelId: string) => {
    if (onConnect) onConnect(channelId);
  };

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
        role="dialog"
        aria-labelledby="connect-dialog-title"
        aria-describedby="connect-dialog-desc"
      >
        <DialogHeader
          title={title}
          description={description}
          onClose={onClose}
        />
        <DialogBody channels={channels} onChannelClick={handleChannelClick} />
      </div>
    </div>
  );
}
