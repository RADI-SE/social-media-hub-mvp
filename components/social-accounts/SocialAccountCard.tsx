import { AtSign } from "lucide-react";
import type { SocialAccount } from "@/types/social-account";

export default function SocialAccountCard({ account, onDisconnect }: { account: SocialAccount; onDisconnect: () => void }) {
  return <article className="glass-card flex flex-col justify-between gap-6 rounded-3xl p-6"><div className="flex items-start justify-between gap-4"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-[#2854dc]"><AtSign size={19} /></span><span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[0.65rem] font-bold text-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Connected</span></div><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{account.platform}</p><h2 className="mt-2 text-lg font-semibold text-[#071e55]">{account.accountName}</h2></div><button type="button" onClick={onDisconnect} className="w-fit text-xs font-semibold text-slate-400 hover:text-rose-600">Disconnect from demo</button></article>;
}
