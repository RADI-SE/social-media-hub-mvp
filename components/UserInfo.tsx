"use client";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

export default function UserInfo() {
  const user = useQuery(api.users.current);

  if (user === undefined) {
    return <p>Loading...</p>;
  }

  if (user === null) {
    return <p>Not authenticated</p>;
  }

  return (
    <div>
      <p>{user.name}</p>
      <p>{user.email}</p>
    </div>
  );
}
