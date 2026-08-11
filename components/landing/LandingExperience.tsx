import { CheckCircle2, Sparkles } from "lucide-react";
import BrandMark from "@/components/hub/BrandMark";
import SignalMap from "./SignalMap";
import WorkflowRail from "./WorkflowRail";
import SessionActions from "./SessionActions";

export default function LandingExperience({ signedIn }: { signedIn: boolean }) {
  return (
    <main className="landing-shell soft-grid min-h-screen overflow-hidden">
      <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-10 lg:px-16">
        <div className="landing-brand-mobile"><BrandMark href="/" /></div>
        <SessionActions signedIn={signedIn} placement="nav" />
      </nav>

      <section className="relative mx-auto grid min-h-[calc(100vh-5.8rem)] max-w-7xl items-center gap-10 px-5 pb-20 pt-8 sm:px-10 lg:grid-cols-[0.92fr_1.08fr] lg:px-16 lg:pb-24 lg:pt-4">
        <div className="relative z-10">
          <div className="landing-kicker"><Sparkles size={14} />CONTENT → SIGNAL → ACTION</div>
          <h1 className="landing-title">Catch every signal.<span>Turn it into motion.</span></h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">Spiders AI brings publishing, customer conversations, demo analytics, and follow-up into one intelligent marketing workspace.</p>
          <SessionActions signedIn={signedIn} placement="hero" />
          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-slate-500"><span className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-500" />English + Arabic captions</span><span className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-500" />Clearly labeled demo data</span><span className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-500" />Lead-to-task flow</span></div>
        </div>

        <div className="relative z-10 lg:scale-[1.03]"><SignalMap /></div>
        <div className="landing-glow landing-glow-mint" /><div className="landing-glow landing-glow-blue" />
      </section>

      <WorkflowRail />
      <footer className="border-t border-white/70 bg-white/35 px-5 py-6 backdrop-blur-xl sm:px-10 lg:px-16"><div className="mx-auto flex max-w-7xl flex-col gap-2 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between"><span>Spiders AI · Social Media Marketing Hub MVP</span><span>Your new way of working</span></div></footer>
    </main>
  );
}
