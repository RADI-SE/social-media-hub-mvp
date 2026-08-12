"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ConnectChannelDialog } from "@/components/ui/ConnectChannelDialog";
import { TwitterIcon, FacebookIcon } from "@/components/ui/ChannelIcons";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import {
  getSessionStatus,
  refreshSession,
  disconnectSession,
} from "@/lib/api";

type ChannelStatus = {
  connected: boolean;
  loading: boolean;
  error?: string;
};

export default function SocialAccountsPage() {
  const { user } = useUser();
  const userId = user?.id;

  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);

  // Convex mutations (stay in component)
  const connectAccount = useMutation(api.socialAccounts.connectAccount);
  const disconnectAccount = useMutation(api.socialAccounts.disconnectAccount);

  const [channelStatuses, setChannelStatuses] = useState<Record<string, ChannelStatus>>({
    facebook: { connected: false, loading: true },
    twitter: { connected: false, loading: false },
  });

  // Check status on mount and after connect/disconnect
  const checkStatus = async () => {
    if (!userId) {
      setChannelStatuses((prev) => ({
        ...prev,
        facebook: { connected: false, loading: false },
      }));
      return;
    }

    try {
      const data = await getSessionStatus(userId);
      setChannelStatuses((prev) => ({
        ...prev,
        facebook: { connected: data.connected, loading: false },
      }));
    } catch (error) {
      console.error("Status check failed:", error);
      setChannelStatuses((prev) => ({
        ...prev,
        facebook: {
          connected: false,
          loading: false,
          error: (error as Error).message,
        },
      }));
      toast.error("Failed to check connection status");
    }
  };

  useEffect(() => {
    checkStatus();
  }, [userId]);

  const handleConnect = async (channelId: string) => {
    if (channelId !== "facebook") {
      console.log(`Connecting to ${channelId}...`);
      setIsConnectDialogOpen(false);
      return;
    }

    if (!userId) {
      toast.error("You must be logged in.");
      return;
    }

    setChannelStatuses((prev) => ({
      ...prev,
      facebook: { ...prev.facebook, loading: true },
    }));
    setIsConnectDialogOpen(false);

    const loadingToast = toast.loading("Connecting to Facebook...");

    try {
      await refreshSession(userId);
      // Re-check status
      const statusData = await getSessionStatus(userId);

      if (statusData.connected) {
        // Save to Team Server DB via Convex
        try {
          await connectAccount({
            userId: userId as any,
            platform: "Facebook",
            accountName: "Facebook Account",
            accountHandle: userId,
          });
        } catch (err) {
          console.error("❌ Failed to update Team DB:", err);
          // Don't block the UI – the session is already stored
        }

        setChannelStatuses((prev) => ({
          ...prev,
          facebook: { connected: true, loading: false },
        }));

        toast.dismiss(loadingToast);
        toast.success("Facebook connected successfully!");
      } else {
        throw new Error("Session not stored in Script Server");
      }
    } catch (error) {
      console.error("Connect error:", error);
      setChannelStatuses((prev) => ({
        ...prev,
        facebook: {
          ...prev.facebook,
          loading: false,
          error: (error as Error).message,
        },
      }));
      toast.dismiss(loadingToast);
      toast.error((error as Error).message);
    }
  };

  const handleDisconnect = async () => {
    if (!userId) {
      toast.error("You must be logged in.");
      return;
    }

    setChannelStatuses((prev) => ({
      ...prev,
      facebook: { ...prev.facebook, loading: true },
    }));

    const loadingToast = toast.loading("Disconnecting...");

    try {
      await disconnectSession(userId);

      // Remove from Team Server DB via Convex
      await disconnectAccount({
        userId: userId as any,
        platform: "Facebook",
      });

      setChannelStatuses((prev) => ({
        ...prev,
        facebook: { connected: false, loading: false },
      }));

      toast.dismiss(loadingToast);
      toast.success("Account disconnected successfully!");
    } catch (error) {
      console.error("Disconnect error:", error);
      setChannelStatuses((prev) => ({
        ...prev,
        facebook: {
          ...prev.facebook,
          loading: false,
          error: (error as Error).message,
        },
      }));
      toast.dismiss(loadingToast);
      toast.error((error as Error).message);
    }
  };

  const facebookStatus = channelStatuses.facebook;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Header – unchanged */}
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

      {/* Connected accounts – unchanged */}
      {Object.values(channelStatuses).some((status) => status.connected) ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {channelStatuses.facebook.connected && (
            <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800/80 dark:hover:border-gray-600">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-blue-600 opacity-80" />

              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 ring-1 ring-blue-100 dark:bg-blue-900/20 dark:ring-blue-900/40">
                    <FacebookIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Facebook
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      Social account
                    </p>
                  </div>
                </div>

                <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                  Connected
                </div>
              </div>

              <div className="my-4 border-t border-gray-100 dark:border-gray-700/70" />

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  Ready to publish
                </span>
                <button
                  onClick={handleDisconnect}
                  disabled={facebookStatus.loading}
                  className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400 disabled:opacity-50"
                >
                  {facebookStatus.loading ? "Disconnecting..." : "Disconnect"}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
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
              Connect your social accounts to start publishing and managing your
              content from one place.
            </p>
            <button
              onClick={() => setIsConnectDialogOpen(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-gray-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-900/20 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Connect a Channel
            </button>
          </div>
        </div>
      )}

      <ConnectChannelDialog
        isOpen={isConnectDialogOpen}
        onClose={() => setIsConnectDialogOpen(false)}
        onConnect={handleConnect}
        channels={[
          { id: "facebook", name: "Facebook", icon: FacebookIcon },
          { id: "twitter", name: "X (Twitter)", icon: TwitterIcon },
        ]}
        showRequestChannel={false}
        title="Add a social account"
        description="Choose a platform to connect."
      />
    </div>
  );
}