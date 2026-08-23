import { NextRequest, NextResponse } from "next/server";

const SCRIPT_SERVER_URL = (
  process.env.NEXT_PUBLIC_SCRIPT_SERVER_URL || "http://localhost:3000"
).trim();
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const PROXY_TIMEOUT_MS = 150_000;

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "keep-alive",
  "transfer-encoding",
  "upgrade",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
]);

function buildUrl(request: NextRequest): string {
  const path = request.nextUrl.pathname.replace("/api/proxy/", "");
  return `${SCRIPT_SERVER_URL}/${path}${request.nextUrl.search}`;
}

function buildHeaders(authHeader: string | null, contentType?: string): HeadersInit {
  const headers: Record<string, string> = {
    "x-api-key": API_KEY as string,
  };
  if (contentType) {
    headers["Content-Type"] = contentType;
  }
  if (authHeader) {
    headers["Authorization"] = authHeader;
  }
  return headers;
}

function forwardResponse(response: Response): NextResponse {
  const headers = new Headers();
  response.headers.forEach((value, key) => {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });
  return new NextResponse(response.body, {
    status: response.status,
    headers,
  });
}

function errorResponse(error: unknown): NextResponse {
  const message =
    error instanceof Error ? error.message : "Unknown proxy error";
  return NextResponse.json(
    { error: `Proxy request failed: ${message}` },
    { status: 502 }
  );
}

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(buildUrl(request), {
      headers: buildHeaders(request.headers.get("authorization")),
      signal: AbortSignal.timeout(PROXY_TIMEOUT_MS),
      cache: "no-store",
    });
    return forwardResponse(response);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const response = await fetch(buildUrl(request), {
      method: "POST",
      headers: buildHeaders(
        request.headers.get("authorization"),
        "application/json"
      ),
      body,
      signal: AbortSignal.timeout(PROXY_TIMEOUT_MS),
      cache: "no-store",
    });
    return forwardResponse(response);
  } catch (error) {
    return errorResponse(error);
  }
}
