"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "convex/react";

import { api } from "@/convex/_generated/api";

export default function UserInitializer() {
  const { isSignedIn, isLoaded } = useAuth();

  const getOrCreateUser = useMutation(api.users.getOrCreate);
 
  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      return;
    }

    getOrCreateUser().catch((error) => {
      console.error("Failed to initialize user:", error);
    });
  }, [isLoaded, isSignedIn, getOrCreateUser]);

  return null;
}