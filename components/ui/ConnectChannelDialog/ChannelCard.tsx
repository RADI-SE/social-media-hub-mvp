'use client';

import { Info } from 'lucide-react';
import { Channel } from './types';

interface ChannelCardProps {
  channel: Channel;
  onClick: (id: string) => void;
  onInfoClick: (id: string) => void;
}

export function ChannelCard({ channel, onClick, onInfoClick }: ChannelCardProps) {
  const Icon = channel.icon;

  return (
    <div
      role="button"
      tabIndex={0}
      className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
      onClick={() => onClick(channel.id)}
      onKeyDown={(e) => e.key === 'Enter' && onClick(channel.id)}
    >
      {Icon ? (
        <Icon className="w-10 h-10 text-gray-700" />
      ) : (
        <div className="w-10 h-10 flex items-center justify-center text-gray-400">
          <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10">
            <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
      )}

      <button
        className="self-end -mt-4 text-gray-400 hover:text-gray-600"
        onClick={(e) => {
          e.stopPropagation();
          onInfoClick(channel.id);
        }}
        aria-label={`More details for ${channel.name}`}
      >
        <Info size={16} />
      </button>

      <h4 className="text-sm font-medium text-gray-800 mt-1">{channel.name}</h4>
      {channel.subtitle && (
        <span className="text-xs text-gray-500 text-center">{channel.subtitle}</span>
      )}
    </div>
  );
}