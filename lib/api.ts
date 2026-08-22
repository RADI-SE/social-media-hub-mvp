const SCRIPT_URL = '/api/proxy';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

function buildHeaders(token?: string) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (API_KEY) {
    headers['x-api-key'] = API_KEY;
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log(`[buildHeaders] Adding Authorization header with token length: ${token.length}`);
  } else {
    console.log(`[buildHeaders] No token provided`);
  }
  return headers;
}

export async function getSessionStatus(userId: string, token?: string) {
  const url = `${SCRIPT_URL}/api/session-status?userId=${encodeURIComponent(userId)}&_=${Date.now()}`;
  const response = await fetch(url, { headers: buildHeaders(token), cache: 'no-cache' });
  if (!response.ok) throw new Error(`Failed to check session status: ${response.status}`);
  return response.json();
}

export async function publishInstagramPost(
  userId: string,
  caption: string,
  token?: string,
  imageBase64?: string
) {
  const response = await fetch(`${SCRIPT_URL}/api/instagram/post`, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify({
      userId,
      caption,
      imageBase64, 
    }),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to publish Instagram post: ${response.status} ${text}`);
  }
  return response.json();
}

export async function publishInstagramComment(
  userId: string,
  postUrl: string,
  comment: string,
  token?: string
) {
  const response = await fetch(`${SCRIPT_URL}/api/instagram/comment`, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify({ userId, postUrl, comment }),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to publish Instagram comment: ${response.status} ${text}`);
  }
  return response.json();
}

export async function getInstagramSessionStatus(userId: string, token?: string) {
  const url = `${SCRIPT_URL}/api/instagram/session-status?userId=${encodeURIComponent(userId)}&_=${Date.now()}`;
   
  const response = await fetch(url, {
    headers: buildHeaders(token),
    cache: 'no-cache',
  });

 
  if (!response.ok) {
    await response.text();
     throw new Error(`Failed to check Instagram session status: ${response.status}`);
  }

  const data = await response.json();
   return data;
}


export async function refreshSession(userId: string, token?: string) {
  const response = await fetch(`${SCRIPT_URL}/api/refresh-session`, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify({ userId }),
    cache: 'no-cache',
  });
  if (!response.ok) throw new Error("Failed to refresh Facebook session");
  return response.json();
}

export async function disconnectSession(userId: string, token?: string) {
  const response = await fetch(`${SCRIPT_URL}/api/disconnect`, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify({ userId }),
  });
  if (!response.ok) throw new Error("Failed to disconnect Facebook session");
  return response.json();
}

export async function refreshInstagramSession(userId: string, token?: string) {
  const response = await fetch(`${SCRIPT_URL}/api/instagram/refresh-session`, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify({ userId }),
    cache: 'no-cache',
  });
  if (!response.ok) throw new Error("Failed to refresh Instagram session");
  return response.json();
}

export async function disconnectInstagramSession(userId: string, token?: string) {
  const response = await fetch(`${SCRIPT_URL}/api/instagram/disconnect`, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify({ userId }),
  });
  if (!response.ok) throw new Error("Failed to disconnect Instagram session");
  return response.json();
}

export async function publishPost(
  userId: string,
  content: string,
  token?: string,
  imageBase64?: string 
) {
  const response = await fetch(`${SCRIPT_URL}/api/post`, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify({
      userId,
      message: content,
      imageBase64,
    }),
  });
  if (!response.ok) throw new Error(`Failed to publish post: ${response.statusText}`);
  return response.json();
}

export async function publishComment(userId: string, postUrl: string, content: string, token?: string) {
  const response = await fetch(`${SCRIPT_URL}/api/comment`, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify({ userId, postUrl, message: content }),
  });
  if (!response.ok) throw new Error(`Failed to publish comment: ${response.statusText}`);
  return response.json();
}


export async function schedulePost(params: {
  userId: string;
  content: string;
  scheduledAt: number;
  token?: string;
  platform?: string;
  mediaUrl?: string;
}) {
  const { userId, content, scheduledAt, token, platform, mediaUrl } = params;
  const response = await fetch(`${SCRIPT_URL}/api/schedule`, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify({
      userId,
      type: "post",
      content,
      scheduledAt,
      platform: platform || 'facebook',
      mediaUrl,
    }),
  });
  if (!response.ok) throw new Error(`Failed to schedule post: ${response.statusText}`);
  return response.json();
}

export async function scheduleComment(params: {
  userId: string;
  targetUrl: string;
  authorName: string;
  content: string;
  scheduledAt: number;
  platform: string;
  classification?: string;
  token?: string;
}) {
  const { userId, targetUrl, authorName, content, scheduledAt, platform, classification, token } = params;
  const response = await fetch(`${SCRIPT_URL}/api/schedule`, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify({
      userId,
      type: "comment",
      target: targetUrl,
      content,
      scheduledAt,
      platform,
      authorName,
      classification,
    }),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to schedule comment: ${response.status} ${text}`);
  }
  return response.json();
}

export async function getScheduledTasks(userId: string, token?: string) {
  const response = await fetch(`${SCRIPT_URL}/api/schedule?userId=${userId}`, {
    headers: buildHeaders(token),
  });
  if (!response.ok) throw new Error(`Failed to fetch scheduled tasks: ${response.statusText}`);
  return response.json();
}

export async function cancelScheduledTask(taskId: string, token?: string) {
  const response = await fetch(`${SCRIPT_URL}/api/schedule/${taskId}`, {
    method: "DELETE",
    headers: buildHeaders(token),
  });
  if (!response.ok) throw new Error(`Failed to cancel task: ${response.statusText}`);
  return response.json();
}
 
export async function uploadTempImage(
  imageBase64: string,
  userId: string,  
  token?: string
): Promise<string> {
  const response = await fetch(`${SCRIPT_URL}/api/upload-temp`, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify({ 
      imageBase64,
      userId, 
    }),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Image upload failed: ${text}`);
  }
  const data = await response.json();
  return data.path;
}


export async function fetchPostAnalytics(postId: string, userId: string, token?: string) {
  const url = `${SCRIPT_URL}/api/analytics/refresh/${postId}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: buildHeaders(token),
    body: JSON.stringify({ userId }), // 👈 send userId in body
    cache: 'no-cache',
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Failed to fetch analytics: ${response.status}`);
  }
  return response.json();
}