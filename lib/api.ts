 
const SCRIPT_URL = "/api/proxy";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
 
export async function publishPost(userId: string, content: string) {
  const response = await fetch(`https://life-calamity-idiom.ngrok-free.dev/api/post`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify({ userId, message: content }),
  });
  if (!response.ok) throw new Error(`Failed to publish post: ${response.statusText}`);
  return response.json();
}
 
export async function publishComment(userId: string, postUrl: string, content: string) {
  console.log("📌 publishComment called with:", { userId, postUrl, content });
  const response = await fetch(`${SCRIPT_URL}/api/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify({ userId, postUrl, message: content }),
  });
  // ...
}

// --- Schedule a post ---
export async function schedulePost(userId: string, content: string, scheduledAt: number) {
  const response = await fetch(`${SCRIPT_URL}/api/schedule`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify({ userId, type: "post", content, scheduledAt }),
  });
  if (!response.ok) throw new Error(`Failed to schedule post: ${response.statusText}`);
  return response.json();
}

// --- Schedule a comment ---
export async function scheduleComment(userId: string, postUrl: string, content: string, scheduledAt: number) {
  const response = await fetch(`${SCRIPT_URL}/api/schedule`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify({ userId, type: "comment", target: postUrl, content, scheduledAt }),
  });
  if (!response.ok) throw new Error(`Failed to schedule comment: ${response.statusText}`);
  return response.json();
}

// --- Get scheduled tasks for a user ---
export async function getScheduledTasks(userId: string) {
  const response = await fetch(`${SCRIPT_URL}/api/schedule?userId=${userId}`, {
    headers: { "x-api-key": API_KEY },
  });
  if (!response.ok) throw new Error(`Failed to fetch scheduled tasks: ${response.statusText}`);
  return response.json();
}

// --- Cancel a scheduled task ---
export async function cancelScheduledTask(taskId: string) {
  const response = await fetch(`${SCRIPT_URL}/api/schedule/${taskId}`, {
    method: "DELETE",
    headers: { "x-api-key": API_KEY },
  });
  if (!response.ok) throw new Error(`Failed to cancel task: ${response.statusText}`);
  return response.json();
}

// lib/api.ts


// --- Get session status (with cache busting) ---
export async function getSessionStatus(userId: string) {
  // Add timestamp to force a fresh request
  const url = `${SCRIPT_URL}/api/session-status?userId=${userId}&_=${Date.now()}`;
  const response = await fetch(url, {
    headers: { "x-api-key": API_KEY },
    cache: 'no-cache',
  });
  if (!response.ok) throw new Error("Failed to check session status");
  return response.json();
}

// --- Refresh session ---
export async function refreshSession(userId: string) {
  const response = await fetch(`${SCRIPT_URL}/api/refresh-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify({ userId }),
    cache: 'no-cache',
  });
  if (!response.ok) throw new Error("Failed to refresh session");
  return response.json();
}

// --- Get session status ---
// export async function getSessionStatus(userId: string) {
//   console.log("userId", userId)
//   const response = await fetch(`${SCRIPT_URL}/api/session-status?userId=${userId}`, {
//     headers: { "x-api-key": API_KEY },
//   });
//   if (!response.ok) throw new Error("Failed to check session status");
//   return response.json();
// }

// // --- Refresh session (connect) ---
// export async function refreshSession(userId: string) {
//   const response = await fetch(`${SCRIPT_URL}/api/refresh-session`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-api-key": API_KEY,
//     },
//     body: JSON.stringify({ userId }),
//   });
//   if (!response.ok) throw new Error("Failed to refresh session");
//   return response.json();
// }

// --- Disconnect session ---
export async function disconnectSession(userId: string) {
  const response = await fetch(`${SCRIPT_URL}/api/disconnect`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify({ userId }),
  });
  if (!response.ok) throw new Error("Failed to disconnect");
  return response.json();
}
