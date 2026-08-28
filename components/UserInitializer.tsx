"use client";

import { useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";

import { api } from "@/convex/_generated/api";

export default function UserInitializer() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  const getOrCreateUser = useMutation(api.users.getOrCreate);
  const saveFromClerk = useMutation(api.users.saveFromClerk);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    getOrCreateUser()
      .then(() => {

        return saveFromClerk({
          clerkUserId: user.id,
          name: user.fullName ?? undefined,
          email: user.primaryEmailAddress?.emailAddress ?? undefined,
        });
      })
      .catch((error) => {
        console.error("Failed to initialize user:", error);
      });
  }, [isLoaded, isSignedIn, user, getOrCreateUser, saveFromClerk]);

  return null;
}