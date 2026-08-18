"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { channelConfigs } from "@/config/channels";
import { api } from "@/convex/_generated/api";
import {
  disconnectInstagramSession,
  disconnectSession,
  getInstagramSessionStatus,
  getSessionStatus,
  refreshInstagramSession,
  refreshSession,
} from "@/lib/api";
import type { SocialAccount } from "@/types/social-account";
import type { ChannelId, ChannelStatus, ChannelStatuses } from "@/types/social";

const initialStatuses: ChannelStatuses = {
  facebook: { connected: false, loading: true },
  instagram: { connected: false, loading: false },
  twitter: { connected: false, loading: false },
};

const wait = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export function useSocialAccounts() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const userId = user?.id;
  const [statuses, setStatuses] = useState(initialStatuses);
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);
  const connectAccount = useMutation(api.socialAccounts.connectAccount);
  const disconnectAccount = useMutation(api.socialAccounts.disconnectAccount);
  const storedAccounts = useQuery(
    api.socialAccounts.getAccountsForUser,
    userId ? { userId } : "skip",
  ) as SocialAccount[] | undefined;

  const getFreshToken = useCallback(
    async () => (await getToken()) ?? undefined,
    [getToken],
  );

  const setChannelStatus = useCallback(
    (channel: ChannelId, status: Partial<ChannelStatus>) => {
      setStatuses((current) => ({
        ...current,
        [channel]: { ...current[channel], ...status },
      }));
    },
    [],
  );

  const runChannelAction = useCallback(
    async (
      channel: ChannelId,
      connected: boolean,
      action: () => Promise<void>,
    ) => {
      const name = channelConfigs[channel].name;
      setChannelStatus(channel, { loading: true, error: undefined });
      const toastId = toast.loading(
        `${connected ? "Connecting to" : "Disconnecting"} ${name}...`,
      );
      try {
        await action();
        setChannelStatus(channel, { connected, loading: false });
        toast.success(
          `${name} ${connected ? "connected" : "disconnected"} successfully!`,
          { id: toastId },
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Action failed";
        setChannelStatus(channel, { loading: false, error: message });
        toast.error(message, { id: toastId });
      }
    },
    [setChannelStatus],
  );

  const persistAccount = useCallback(
    async (channel: ChannelId) => {
      if (!userId) return;
      const config = channelConfigs[channel];
      await connectAccount({
        userId,
        platform: config.platform,
        accountName: `${config.name} Account`,
        accountHandle: userId,
      });
    },
    [connectAccount, userId],
  );

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;
    void getFreshToken()
      .then((token) => getSessionStatus(userId, token))
      .then((data) => {
        if (!cancelled) {
          setChannelStatus("facebook", {
            connected: data.connected,
            loading: false,
          });
        }
      })
      .catch((error) => {
        if (cancelled) return;
        setChannelStatus("facebook", {
          connected: false,
          loading: false,
          error: error instanceof Error ? error.message : "Status check failed",
        });
        toast.error("Failed to check connection status");
      });

    return () => {
      cancelled = true;
    };
  }, [getFreshToken, setChannelStatus, userId]);

  const connectInstagram = useCallback(async () => {
    if (!userId) return;
    await refreshInstagramSession(userId, await getFreshToken());
    await wait(3000);
    for (let attempt = 0; attempt < 30; attempt += 1) {
      await wait(2000);
      const status = await getInstagramSessionStatus(
        userId,
        await getFreshToken(),
      );
      if (status.connected) {
        await persistAccount("instagram");
        return;
      }
    }
    throw new Error("Instagram login not detected within 60 seconds.");
  }, [getFreshToken, persistAccount, userId]);

  const connectFacebook = useCallback(async () => {
    if (!userId) return;
    await refreshSession(userId, await getFreshToken());
    const status = await getSessionStatus(userId, await getFreshToken());
    if (!status.connected)
      throw new Error("Session not stored in Script Server");
    await persistAccount("facebook");
  }, [getFreshToken, persistAccount, userId]);

  const handleConnect = useCallback(
    async (channelValue: string) => {
      if (!userId) return toast.error("You must be logged in.");
      if (!(channelValue in channelConfigs)) return;
      const channel = channelValue as ChannelId;
      setIsConnectDialogOpen(false);
      if (channel === "instagram") {
        await runChannelAction(channel, true, connectInstagram);
      } else if (channel === "facebook") {
        await runChannelAction(channel, true, connectFacebook);
      }
    },
    [connectFacebook, connectInstagram, runChannelAction, userId],
  );

  const handleDisconnect = useCallback(
    async (channel: ChannelId) => {
      if (!userId) return toast.error("You must be logged in.");
      if (channel !== "facebook" && channel !== "instagram") return;
      const platform = channelConfigs[channel].platform;
      await runChannelAction(channel, false, async () => {
        const token = await getFreshToken();
        if (channel === "facebook") await disconnectSession(userId, token);
        else await disconnectInstagramSession(userId, token);
        await disconnectAccount({ userId, platform });
      });
    },
    [disconnectAccount, getFreshToken, runChannelAction, userId],
  );

  const instagramConnected =
    storedAccounts?.some(
      (account) =>
        account.platform === "Instagram" && account.status === "Connected",
    ) ?? statuses.instagram.connected;
  const resolvedStatuses: ChannelStatuses = {
    ...statuses,
    facebook: userId ? statuses.facebook : { connected: false, loading: false },
    instagram: {
      ...statuses.instagram,
      connected: instagramConnected,
      loading: statuses.instagram.loading || Boolean(userId && !storedAccounts),
    },
  };
  const connectedChannels = Object.entries(resolvedStatuses)
    .filter(([, status]) => status.connected)
    .map(([id]) => id as ChannelId);

  return {
    statuses: resolvedStatuses,
    connectedChannels,
    isConnectDialogOpen,
    setIsConnectDialogOpen,
    handleConnect,
    handleDisconnect,
  };
}
