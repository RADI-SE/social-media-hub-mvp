// hooks/useSocialAccounts.ts
import { useState, useEffect, useCallback } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import {
  getSessionStatus,
  refreshSession,
  disconnectSession,
  getInstagramSessionStatus,
  refreshInstagramSession,
  disconnectInstagramSession,
} from '@/lib/api';
import type { SocialAccount } from '@/types/social-account';
import type { ChannelId, ChannelStatuses } from '@/types/social';
import { channelConfigs } from '@/config/channels';

const initialStatuses: ChannelStatuses = {
  facebook: { connected: false, loading: true },
  instagram: { connected: false, loading: true },
  twitter: { connected: false, loading: false },
};

export function useSocialAccounts() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const userId = user?.id;

  const [statuses, setStatuses] = useState<ChannelStatuses>(initialStatuses);
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);

  const connectAccount = useMutation(api.socialAccounts.connectAccount);
  const disconnectAccount = useMutation(api.socialAccounts.disconnectAccount);
  const storedAccounts = useQuery(
    api.socialAccounts.getAccountsForUser,
    userId ? { userId } : 'skip'
  ) as SocialAccount[] | undefined;

  const getFreshToken = useCallback(async () => {
    return (await getToken({ force: true })) ?? undefined;
  }, [getToken]);

  useEffect(() => {
    if (!storedAccounts) return;
    const instagramConnected = storedAccounts.some(
      (account) => account.platform === 'Instagram' && account.status === 'Connected'
    );
    setStatuses((prev) => ({
      ...prev,
      instagram: { connected: instagramConnected, loading: false },
    }));
  }, [storedAccounts]);

  const checkFacebookStatus = useCallback(async () => {
    if (!userId) {
      setStatuses((prev) => ({
        ...prev,
        facebook: { connected: false, loading: false },
      }));
      return;
    }

    try {
      const token = await getFreshToken();
      const data = await getSessionStatus(userId, token);
      setStatuses((prev) => ({
        ...prev,
        facebook: { connected: data.connected, loading: false },
      }));
    } catch (error) {
      console.error('Status check failed:', error);
      setStatuses((prev) => ({
        ...prev,
        facebook: {
          connected: false,
          loading: false,
          error: (error as Error).message,
        },
      }));
      toast.error('Failed to check connection status');
    }
  }, [userId, getFreshToken]);

  useEffect(() => {
    checkFacebookStatus();
  }, [checkFacebookStatus]);

  const handleConnect = useCallback(
    async (channelId: ChannelId) => {
      if (!userId) {
        toast.error('You must be logged in.');
        return;
      }

      const config = channelConfigs[channelId];

      if (channelId === 'instagram') {
        setStatuses((prev) => ({
          ...prev,
          instagram: { ...prev.instagram, loading: true },
        }));
        setIsConnectDialogOpen(false);
        const loadingToast = toast.loading(`Connecting to ${config.name}...`);

        try {
          const token = await getFreshToken();
          await refreshInstagramSession(userId, token);
          console.log(`✅ ${config.name} login script launched.`);

          await new Promise((resolve) => setTimeout(resolve, 3000));

          let connected = false;
          let attempts = 0;
          const maxAttempts = 30;

          while (attempts < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            attempts++;
            const freshToken = await getFreshToken();
            const statusData = await getInstagramSessionStatus(userId, freshToken);

            if (statusData.connected) {
              connected = true;
              break;
            }

            if (attempts % 5 === 0) {
              console.log(`⏳ Waiting for ${config.name} login... (${attempts * 2}s elapsed)`);
            }
          }

          if (!connected) {
            throw new Error(`${config.name} login not detected within 60 seconds.`);
          }

          await connectAccount({
            userId,
            platform: config.platform,
            accountName: `${config.name} Account`,
            accountHandle: userId,
          });

          setStatuses((prev) => ({
            ...prev,
            instagram: { connected: true, loading: false },
          }));
          toast.dismiss(loadingToast);
          toast.success(`${config.name} connected successfully!`);
        } catch (error) {
          console.error(`${config.name} connect error:`, error);
          setStatuses((prev) => ({
            ...prev,
            instagram: {
              ...prev.instagram,
              loading: false,
              error: (error as Error).message,
            },
          }));
          toast.dismiss(loadingToast);
          toast.error((error as Error).message);
        }
        return;
      }

      if (channelId === 'facebook') {
        setStatuses((prev) => ({
          ...prev,
          facebook: { ...prev.facebook, loading: true },
        }));
        setIsConnectDialogOpen(false);
        const loadingToast = toast.loading(`Connecting to ${config.name}...`);

        try {
          const token = await getFreshToken();
          await refreshSession(userId, token);

          const freshToken = await getFreshToken();
          const statusData = await getSessionStatus(userId, freshToken);

          if (statusData.connected) {
            try {
              await connectAccount({
                userId,
                platform: config.platform,
                accountName: `${config.name} Account`,
                accountHandle: userId,
              });
            } catch (err) {
              console.error(`❌ Failed to update Team DB:`, err);
            }

            setStatuses((prev) => ({
              ...prev,
              facebook: { connected: true, loading: false },
            }));
            toast.dismiss(loadingToast);
            toast.success(`${config.name} connected successfully!`);
          } else {
            throw new Error('Session not stored in Script Server');
          }
        } catch (error) {
          console.error(`${config.name} connect error:`, error);
          setStatuses((prev) => ({
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
        return;
      }

      console.log(`Connecting to ${channelId}...`);
      setIsConnectDialogOpen(false);
    },
    [userId, getFreshToken, connectAccount]
  );

  const handleDisconnectFacebook = useCallback(async () => {
    if (!userId) {
      toast.error('You must be logged in.');
      return;
    }

    setStatuses((prev) => ({
      ...prev,
      facebook: { ...prev.facebook, loading: true },
    }));
    const loadingToast = toast.loading('Disconnecting...');

    try {
      const token = await getFreshToken();
      await disconnectSession(userId, token);
      await disconnectAccount({ userId, platform: 'Facebook' });

      setStatuses((prev) => ({
        ...prev,
        facebook: { connected: false, loading: false },
      }));
      toast.dismiss(loadingToast);
      toast.success('Facebook disconnected successfully!');
    } catch (error) {
      console.error('Disconnect error:', error);
      setStatuses((prev) => ({
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
  }, [userId, getFreshToken, disconnectAccount]);

  const handleDisconnectInstagram = useCallback(async () => {
    if (!userId) {
      toast.error('You must be logged in.');
      return;
    }

    setStatuses((prev) => ({
      ...prev,
      instagram: { ...prev.instagram, loading: true },
    }));
    const loadingToast = toast.loading('Disconnecting...');

    try {
      const token = await getFreshToken();
      await disconnectInstagramSession(userId, token);
      await disconnectAccount({ userId, platform: 'Instagram' });

      setStatuses((prev) => ({
        ...prev,
        instagram: { connected: false, loading: false },
      }));
      toast.dismiss(loadingToast);
      toast.success('Instagram disconnected successfully!');
    } catch (error) {
      console.error('Instagram disconnect error:', error);
      setStatuses((prev) => ({
        ...prev,
        instagram: {
          ...prev.instagram,
          loading: false,
          error: (error as Error).message,
        },
      }));
      toast.dismiss(loadingToast);
      toast.error((error as Error).message);
    }
  }, [userId, getFreshToken, disconnectAccount]);

  const connectedChannels = Object.entries(statuses)
    .filter(([, status]) => status.connected)
    .map(([id]) => id as ChannelId);

  return {
    userId,
    statuses,
    connectedChannels,
    isConnectDialogOpen,
    setIsConnectDialogOpen,
    handleConnect,
    handleDisconnectFacebook,
    handleDisconnectInstagram,
  };
}