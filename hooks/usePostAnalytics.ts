import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { fetchPostAnalytics } from '@/lib/api';

export function usePostAnalytics(postId: string, userId: string) {
  const { getToken } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cached, setCached] = useState(false);

  const refresh = async () => {

    console.log("userId",userId)
    if (!postId || !userId) return;
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const result = await fetchPostAnalytics(postId, userId, token || undefined);
      if (result.success) {
        setAnalytics(result.data);
        setCached(result.cached || false);
      } else {
        setError(result.error || 'Unknown error');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  return { analytics, loading, error, cached, refresh };
}