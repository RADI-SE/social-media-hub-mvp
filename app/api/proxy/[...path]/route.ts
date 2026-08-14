import { NextRequest, NextResponse } from "next/server";

const SCRIPT_SERVER_URL = process.env.NEXT_PUBLIC_SCRIPT_SERVER_URL || "http://localhost:3000";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export async function GET(request: NextRequest) {
  const path = request.nextUrl.pathname.replace("/api/proxy/", "");
  const url = `${SCRIPT_SERVER_URL}/${path}${request.nextUrl.search}`;
  const response = await fetch(url, {
    headers: { "x-api-key": API_KEY as string },
  });
  return new NextResponse(response.body, {
    status: response.status,
    headers: response.headers,
  });
}

export async function POST(request: NextRequest) {
  const path = request.nextUrl.pathname.replace("/api/proxy/", "");
  const url = `${SCRIPT_SERVER_URL}/${path}`;
  const body = await request.text();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY as string,
    },
    body,
  });
  return new NextResponse(response.body, {
    status: response.status,
    headers: response.headers,
  });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}