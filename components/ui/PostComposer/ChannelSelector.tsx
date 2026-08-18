"use client";

import { FacebookIcon, InstagramIcon } from "../ChannelIcons";
import { type Platform } from "@/types/social-account";

export type ComposerChannelId = "facebook" | "instagram";

export type ComposerChannel = {
  id: ComposerChannelId;
  label: string;
  platform: Platform;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export const COMPOSER_CHANNELS: ComposerChannel[] = [
  {
    id: "facebook",
    label: "Facebook",
    platform: "Facebook",
    icon: FacebookIcon,
  },
  {
    id: "instagram",
    label: "Instagram",
    platform: "Instagram",
    icon: InstagramIcon,
  },
];

interface ChannelSelectorProps {
  selected: ComposerChannelId | null;
  onSelect: (id: ComposerChannelId) => void;
}

export function ChannelSelector({ selected, onSelect }: ChannelSelectorProps) {
  return (
    <section className="mb-6 border-b border-gray-100 pb-4">
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Select Channels
      </h4>
      <div className="flex flex-wrap gap-2">
        {COMPOSER_CHANNELS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors text-gray-700 ${
              selected === id
                ? "border-blue-500 bg-blue-50 text-blue-600"
                : "border-gray-200 hover:border-gray-400"
            }`}
            aria-label={label}
            aria-pressed={selected === id}
            title={label}
          >
            <Icon className="w-5 h-5" />
          </button>
        ))}
      </div>
    </section>
  );
}
