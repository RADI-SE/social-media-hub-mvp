// lib/api.ts

const SCRIPT_URL = "/api/proxy"; // ✅ Use the proxy consistently
const API_KEY = process.env.NEXT_PUBLIC_API_KEY; // fallback (optional)

// Helper to build headers
function buildHeaders(token?: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (API_KEY) {
    headers["x-api-key"] = API_KEY;
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

// --- Publish a post (immediate) ---
export async function publishPost(userId: string, content: string, token?: string) {
  const response = await fetch(`${SCRIPT_URL}/api/post`, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify({ userId, message: content }),
  });
  if (!response.ok) throw new Error(`Failed to publish post: ${response.statusText}`);
  return response.json();
}

// --- Publish a comment (immediate) ---
export async function publishComment(userId: string, postUrl: string, content: string, token?: string) {
  const response = await fetch(`${SCRIPT_URL}/api/comment`, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify({ userId, postUrl, message: content }),
  });
  if (!response.ok) throw new Error(`Failed to publish comment: ${response.statusText}`);
  return response.json();
}

// --- Schedule a post ---
export async function schedulePost(userId: string, content: string, scheduledAt: number, token?: string) {
  const response = await fetch(`${SCRIPT_URL}/api/schedule`, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify({ userId, type: "post", content, scheduledAt }),
  });
  if (!response.ok) throw new Error(`Failed to schedule post: ${response.statusText}`);
  return response.json();
}

// --- Schedule a comment ---
export async function scheduleComment(userId: string, postUrl: string, content: string, scheduledAt: number, token?: string) {
  const response = await fetch(`${SCRIPT_URL}/api/schedule`, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify({ userId, type: "comment", target: postUrl, content, scheduledAt }),
  });
  if (!response.ok) throw new Error(`Failed to schedule comment: ${response.statusText}`);
  return response.json();
}

// --- Get scheduled tasks for a user ---
export async function getScheduledTasks(userId: string, token?: string) {
  const response = await fetch(`${SCRIPT_URL}/api/schedule?userId=${userId}`, {
    headers: buildHeaders(token),
  });
  if (!response.ok) throw new Error(`Failed to fetch scheduled tasks: ${response.statusText}`);
  return response.json();
}

// --- Cancel a scheduled task ---
export async function cancelScheduledTask(taskId: string, token?: string) {
  const response = await fetch(`${SCRIPT_URL}/api/schedule/${taskId}`, {
    method: "DELETE",
    headers: buildHeaders(token),
  });
  if (!response.ok) throw new Error(`Failed to cancel task: ${response.statusText}`);
  return response.json();
}

// --- Get session status (with cache busting) ---
export async function getSessionStatus(userId: string, token?: string) {
  const url = `${SCRIPT_URL}/api/session-status?userId=${userId}&_=${Date.now()}`;
  const response = await fetch(url, {
    headers: buildHeaders(token),
    cache: 'no-cache',
  });
  if (!response.ok) throw new Error("Failed to check session status");
  return response.json();
}

// --- Refresh session (connect) ---
export async function refreshSession(userId: string, token?: string) {
  const response = await fetch(`${SCRIPT_URL}/api/refresh-session`, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify({ userId }),
    cache: 'no-cache',
  });
  if (!response.ok) throw new Error("Failed to refresh session");
  return response.json();
}

// --- Disconnect session ---
export async function disconnectSession(userId: string, token?: string) {
  const response = await fetch(`${SCRIPT_URL}/api/disconnect`, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify({ userId }),
  });
  if (!response.ok) throw new Error("Failed to disconnect");
  return response.json();
}