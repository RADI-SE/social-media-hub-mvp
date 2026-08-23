// hooks/usePostComments.ts
import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { fetchPostComments, classifyComments } from '@/lib/api';

export function usePostComments(postId: string, userId: string) {
  const { getToken } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [classifying, setClassifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async (refresh = false) => {
    if (!postId || !userId) return;
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const result = await fetchPostComments(postId, userId, token || undefined, refresh);
      if (result.success) {
        const rawComments = result.comments;
        setClassifying(true);
        const classifications = await classifyComments(
          rawComments.map((c: any) => c.content),
          token || undefined
        );
        const classified = rawComments.map((c: any, i: number) => ({
          ...c,
          classification: classifications[i] || 'Other',
        }));
        setComments(classified);
        // Optional: store classified comments back to Convex via a mutation
        // await storeClassifiedComments(postId, classified);
      } else {
        setError(result.error || 'Failed to fetch comments');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setClassifying(false);
    }
  };

  return { comments, loading, classifying, error, fetchComments };
}