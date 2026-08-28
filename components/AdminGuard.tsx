"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const user = useQuery(api.users.current);
  const router = useRouter();

  useEffect(() => {
    if (!authLoaded) return;
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }
    if (user === undefined) return; // wait for user query
    if (!user || user.role !== "admin") {
      router.push("/home");
    }
  }, [authLoaded, isSignedIn, user, router]);

  // Loading state while Clerk or Convex query is loading
  if (!authLoaded || user === undefined) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Checking access…</div>
      </div>
    );
  }

  // If not admin or not signed in, render nothing (redirect will happen)
  if (!isSignedIn || !user || user.role !== "admin") {
    return null;
  }

  return <>{children}</>;
}