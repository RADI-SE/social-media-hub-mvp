'use client';

import { Plus } from 'lucide-react';

interface RequestChannelCardProps {
  onClick: () => void;
}

export function RequestChannelCard({ onClick }: RequestChannelCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      className="flex flex-col items-center justify-center p-4 border border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <Plus className="w-10 h-10 text-gray-400" />
      <h4 className="text-sm font-medium text-gray-800 mt-1">Can't find it?</h4>
      <span className="text-xs text-gray-500 text-center">Request a channel</span>
    </div>
  );
}