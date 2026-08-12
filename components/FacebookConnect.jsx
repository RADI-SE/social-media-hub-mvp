// components/FacebookConnect.jsx
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs'; // or wherever you get user

const SCRIPT_URL = process.env.NEXT_PUBLIC_SCRIPT_SERVER_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export default function FacebookConnect() {
  const { user } = useUser();
  const userId = user?.id; // or your custom ID
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [result, setResult] = useState(null);

  // Check session status
  useEffect(() => {
    if (!userId) return;
    const checkStatus = async () => {
      try {
        const res = await fetch(`${SCRIPT_URL}/api/session-status?userId=${userId}`, {
          headers: { 'x-api-key': API_KEY },
        });
        const data = await res.json();
        setConnected(data.connected);
      } catch (err) {
        console.error('Status check failed', err);
      }
    };
    checkStatus();
  }, [userId]);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${SCRIPT_URL}/api/refresh-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
        },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      setResult(data);
      if (data.success) setConnected(true);
    } catch (err) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    if (!message.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${SCRIPT_URL}/api/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
        },
        body: JSON.stringify({ userId, message }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Facebook Automation</h1>
      <div className="my-4">
        <span>Status: {connected ? '✅ Connected' : '❌ Not connected'}</span>
        <button
          onClick={handleConnect}
          disabled={loading}
          className="ml-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? '...' : 'Connect Facebook'}
        </button>
      </div>
      <div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full h-32 border p-2"
          placeholder="Write your post..."
        />
        <button
          onClick={handlePost}
          disabled={loading || !connected}
          className="bg-green-500 text-white px-4 py-2 rounded mt-2 disabled:opacity-50"
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>
      {result && <pre className="bg-gray-100 p-2 mt-4">{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}