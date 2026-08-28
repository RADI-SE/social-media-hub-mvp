"use client";

import { Check } from "lucide-react";
import { Channel } from "./types";
import { useDashboardRole } from "@/lib/dashboard-access";  

interface ChannelCardProps {
  channel: Channel;
  onClick: (id: string) => void;
  disabled?: boolean;
}

export function ChannelCard({
  channel,
  onClick,
  disabled = false,
}: ChannelCardProps) {
  const role = useDashboardRole();  

   if (role === null) {
     return (
      <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg bg-gray-50 animate-pulse">
        <div className="w-10 h-10 rounded-full bg-gray-200" />
        <div className="h-4 w-20 mt-1 bg-gray-200 rounded" />
      </div>
    );
  }

  if (role !== "social_media_user") {
    return null; // ✅ invisible for non‑social users
  }
 
  const Icon = channel.icon;

  const handleClick = () => {
    if (!disabled) onClick(channel.id);
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      className={`flex flex-col items-center p-4 border rounded-lg transition-all ${
        disabled
          ? "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
          : "border-gray-200 hover:border-blue-400 hover:shadow-md cursor-pointer"
      }`}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !disabled) onClick(channel.id);
      }}
    >
      {Icon ? (
        <Icon
          className={`w-10 h-10 ${disabled ? "text-gray-400" : "text-gray-700"}`}
        />
      ) : (
        <div className="w-10 h-10 flex items-center justify-center text-gray-400">
          <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10">
            <rect
              x="4"
              y="4"
              width="16"
              height="16"
              rx="2"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>
      )}

      <h4
        className={`text-sm font-medium mt-1 ${disabled ? "text-gray-500" : "text-gray-800"}`}
      >
        {channel.name}
      </h4>
      {channel.subtitle && (
        <span
          className={`text-xs text-center ${disabled ? "text-gray-400" : "text-gray-500"}`}
        >
          {channel.subtitle}
        </span>
      )}
      {disabled && (
        <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-green-600">
          <Check className="h-3 w-3" />
          Connected
        </span>
      )}
    </div>
  );
}