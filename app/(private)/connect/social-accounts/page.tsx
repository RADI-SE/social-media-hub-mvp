// app/(private)/connect/social-accounts/page.tsx
"use client";

import { ConnectChannelDialog } from "@/components/ui/ConnectChannelDialog";
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
} from "@/components/ui/ChannelIcons";
import { ChannelCard } from "@/components/social/ChannelCard";
import { useSocialAccounts } from "@/hooks/useSocialAccounts";
import { channelList } from "@/config/channels";

export default function SocialAccountsPage() {
  const {
    statuses,
    connectedChannels,
    isConnectDialogOpen,
    setIsConnectDialogOpen,
    handleConnect,
    handleDisconnectFacebook,
    handleDisconnectInstagram,
  } = useSocialAccounts();

  const hasConnected = Object.values(statuses).some((s) => s.connected);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Social Accounts
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Manage your connected social media channels
          </p>
        </div>
        <button
          onClick={() => setIsConnectDialogOpen(true)}
          className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Connect a Channel
        </button>
      </div>

      {hasConnected ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Facebook */}
          {statuses.facebook.connected && (
            <ChannelCard
              icon={<FacebookIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
              name="Facebook"
              description="Social account"
              gradient="bg-blue-600"
              isConnected={statuses.facebook.connected}
              isLoading={statuses.facebook.loading}
              onDisconnect={handleDisconnectFacebook}
            />
          )}

          {/* Instagram */}
          {statuses.instagram.connected && (
            <ChannelCard
              icon={<InstagramIcon className="h-5 w-5 text-fuchsia-600 dark:text-fuchsia-400" />}
              name="Instagram"
              description="Workspace account"
              gradient="bg-gradient-to-r from-fuchsia-500 via-rose-500 to-amber-400"
              isConnected={statuses.instagram.connected}
              isLoading={statuses.instagram.loading}
              onDisconnect={handleDisconnectInstagram}
            />
          )}
        </div>
      ) : (
        <EmptyState onConnect={() => setIsConnectDialogOpen(true)} />
      )}

      <ConnectChannelDialog
        isOpen={isConnectDialogOpen}
        onClose={() => setIsConnectDialogOpen(false)}
        onConnect={handleConnect}
        channels={channelList.map((c) => ({
          id: c.id,
          name: c.name,
          icon: c.icon,
        }))}
        connectedChannels={connectedChannels}
        showRequestChannel={false}
        title="Add a social account"
        description="Choose a platform to connect."
      />
    </div>
  );
}

function EmptyState({ onConnect }: { onConnect: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-dashed border-gray-300 bg-gradient-to-b from-gray-50/80 to-white px-6 py-16 text-center dark:border-gray-700 dark:from-gray-800/60 dark:to-gray-800/30">
      <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-64 -translate-x-1/2 rounded-full bg-blue-500/5 blur-3xl" />
      <div className="relative mx-auto flex max-w-sm flex-col items-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 ring-1 ring-gray-200 dark:bg-gray-700/60 dark:ring-gray-600">
          <svg className="h-6 w-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35m2.1-5.4a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold tracking-tight text-gray-900 dark:text-white">
          No accounts connected
        </h3>
        <p className="mt-1.5 max-w-xs text-sm leading-6 text-gray-500 dark:text-gray-400">
          Connect your social accounts to start publishing and managing your content from one place.
        </p>
        <button
          onClick={onConnect}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-gray-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-900/20 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Connect a Channel
        </button>
      </div>
    </div>
  );
}