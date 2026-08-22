import { useEffect } from 'react';
import { usePostAnalytics } from '@/hooks/usePostAnalytics';


interface PostAnalyticsProps {
  postId: string;
  userId: string;
  onClose?: () => void;
}

export function PostAnalytics({ postId, userId, onClose }: PostAnalyticsProps) {
  const { analytics, loading, error, cached, refresh } = usePostAnalytics(postId, userId);

  // Auto-refresh when the component mounts
  useEffect(() => {
    refresh();
  }, [postId, userId]);

  console.log("userId",userId)
  if (loading) return <div>Loading analytics...</div>;
  if (error) return <div>Error: {error} <button onClick={refresh}>Retry</button></div>;
  if (!analytics) return <div>No analytics yet. <button onClick={refresh}>Fetch</button></div>;

  return (
    <div className="analytics-panel">
      <div className="flex justify-between">
        <h3>Post Analytics</h3>
        <button onClick={onClose}>×</button>
      </div>
      {cached && <span className="text-xs text-gray-500">(cached)</span>}
      <div className="grid grid-cols-3 gap-4 mt-2">
        <div><span className="font-bold">{analytics.likes}</span> Likes</div>
        <div><span className="font-bold">{analytics.comments}</span> Comments</div>
        <div><span className="font-bold">{analytics.shares || 0}</span> Shares</div>
      </div>
      <div className="text-xs text-gray-400 mt-2">
        Scraped: {new Date(analytics.scrapedAt).toLocaleString()}
      </div>
      <button onClick={refresh} className="mt-2 text-blue-500 text-sm">↻ Refresh</button>
    </div>
  );
}