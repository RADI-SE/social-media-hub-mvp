"use client";

import { FacebookIcon } from "../ChannelIcons";

type Channel = {
  id: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const CHANNELS: Channel[] = [
  { id: "facebook", label: "Facebook", icon: FacebookIcon },
];

interface ChannelSelectorProps {
  selected: string[];
  onToggle: (id: string) => void;
}

export function ChannelSelector({ selected, onToggle }: ChannelSelectorProps) {
  return (
    <section className="mb-6 border-b border-gray-100 pb-4">
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Select Channels
      </h4>
      <div className="flex flex-wrap gap-2">
        {CHANNELS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onToggle(id)}
            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors text-gray-700 ${
              selected.includes(id)
                ? "border-blue-500 bg-blue-50 text-blue-600"
                : "border-gray-200 hover:border-gray-400"
            }`}
            aria-label={label}
          >
            <Icon className="w-5 h-5" />
          </button>
        ))}
      </div>
    </section>
  );
}
