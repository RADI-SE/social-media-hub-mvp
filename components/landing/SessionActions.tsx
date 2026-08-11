"use client";

import { useState } from "react";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import { ArrowRight, LogOut, MoveUpRight, UserPlus } from "lucide-react";

export default function SessionActions({ signedIn, placement }: { signedIn: boolean; placement: "nav" | "hero" }) {
  const { signOut } = useClerk();
  const [leaving, setLeaving] = useState<"sign-in" | "sign-up" | null>(null);

  async function leaveSession(destination: "sign-in" | "sign-up") {
    setLeaving(destination);
    await signOut({ redirectUrl: `/${destination}` });
  }

  if (placement === "nav") {
    if (signedIn) {
      return <div className="flex items-center gap-2"><button type="button" disabled={Boolean(leaving)} onClick={() => leaveSession("sign-in")} className="landing-nav-secondary inline-flex items-center gap-1.5 disabled:opacity-60"><LogOut size={14} />{leaving ? "Signing out…" : "Switch account"}</button><Link href="/home" className="landing-nav-primary">Dashboard <MoveUpRight size={14} /></Link></div>;
    }
    return <div className="flex items-center gap-2"><Link href="/sign-in" className="landing-nav-secondary">Sign in</Link><Link href="/sign-up" className="landing-nav-primary">Sign up <ArrowRight size={15} /></Link></div>;
  }

  if (signedIn) {
    return <div className="mt-9"><div className="flex flex-wrap items-center gap-3"><Link href="/home" className="landing-hero-primary">Open dashboard <MoveUpRight size={17} /></Link><button type="button" disabled={Boolean(leaving)} onClick={() => leaveSession("sign-in")} className="landing-hero-secondary inline-flex items-center gap-2 disabled:opacity-60"><LogOut size={16} />{leaving === "sign-in" ? "Signing out…" : "Sign out & test sign in"}</button></div><button type="button" disabled={Boolean(leaving)} onClick={() => leaveSession("sign-up")} className="landing-dashboard-link mt-2"><UserPlus size={16} />{leaving === "sign-up" ? "Signing out…" : "Sign out & create another account"}</button></div>;
  }

  return <div className="mt-9 flex flex-wrap items-center gap-3"><Link href="/sign-up" className="landing-hero-primary">Sign up <ArrowRight size={17} /></Link><Link href="/sign-in" className="landing-hero-secondary">Sign in</Link></div>;
}

