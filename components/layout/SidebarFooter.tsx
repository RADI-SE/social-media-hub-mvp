"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SidebarFooter() {
  const { signOut } = useClerk();
  const { user, isLoaded } = useUser();
  const router = useRouter();

  if (!isLoaded) {
    return <footer className="mt-auto border-t border-[#173b9a]/10 pt-5"><div className="flex items-center gap-3 rounded-2xl bg-white/65 p-3"><div className="h-9 w-9 animate-pulse rounded-full bg-blue-100" /><div className="space-y-2"><div className="h-3 w-24 animate-pulse rounded bg-blue-100" /><div className="h-2.5 w-32 animate-pulse rounded bg-blue-50" /></div></div></footer>;
  }

  const displayName = user?.fullName ?? user?.firstName ?? "User";
  const initials = displayName.split(" ").map((part) => part[0]).join("").slice(0, 2);

  return (
    <footer className="mt-auto border-t border-[#173b9a]/10 pt-5">
      <div className="flex items-center gap-3 rounded-2xl bg-white/65 p-3">
        <span
          aria-label={`${displayName} profile photo`}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#c4ffe6] to-[#486bf5] bg-cover bg-center text-xs font-bold text-[#09276b]"
          style={user?.hasImage ? { backgroundImage: `url(${user.imageUrl})` } : undefined}
        >
          {!user?.hasImage && initials}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[#09276b]">{displayName}</p>
          <p className="truncate text-[0.68rem] text-slate-500">{user?.primaryEmailAddress?.emailAddress ?? "No email"}</p>
        </div>
        <div className="flex gap-1">
          <button type="button" onClick={() => router.push("/settings")} className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-[#173b9a]" aria-label="Profile settings" title="Profile settings"><Settings size={15} /></button>
          <button type="button" onClick={() => signOut({ redirectUrl: "/" })} className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Sign out" title="Sign out"><LogOut size={15} /></button>
        </div>
      </div>
      <p className="mt-3 text-center text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-slate-400">Functional MVP · Demo data</p>
    </footer>
  );
}

