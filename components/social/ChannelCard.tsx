import { ReactNode } from 'react';

interface ChannelCardProps {
  icon: ReactNode;
  name: string;
  description: string;
  gradient: string;
  isConnected: boolean;
  isLoading: boolean;
  onDisconnect: () => void;
  disconnectLabel?: string;
  statusLabel?: string;
  children?: ReactNode;
}

export function ChannelCard({
  icon,
  name,
  description,
  gradient,
  isConnected,
  isLoading,
  onDisconnect,
  disconnectLabel = 'Disconnect',
  statusLabel = 'Connected',
  children,
}: ChannelCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800/80 dark:hover:border-gray-600">
      <div className={`absolute inset-x-0 top-0 h-0.5 ${gradient} opacity-90`} />

      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-50 ring-1 ring-gray-100 dark:bg-gray-900/20 dark:ring-gray-900/40">
            {icon}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{name}</p>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{description}</p>
          </div>
        </div>

        {isConnected && (
          <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            {statusLabel}
          </div>
        )}
      </div>

      <div className="my-4 border-t border-gray-100 dark:border-gray-700/70" />

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 dark:text-gray-500">{children || 'Ready'}</span>
        {isConnected && (
          <button
            onClick={onDisconnect}
            disabled={isLoading}
            className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400 disabled:opacity-50"
          >
            {isLoading ? 'Disconnecting...' : disconnectLabel}
          </button>
        )}
      </div>
    </div>
  );
}