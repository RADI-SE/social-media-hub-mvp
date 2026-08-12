"use client";
import { useState } from "react";
import { Plus } from "lucide-react";

export default function SocialAccountForm({
  onConnect,
}: {
  onConnect: (platform: string, accountName: string) => void;
}) {
  const [platform, setPlatform] = useState("Instagram");
  const [accountName, setAccountName] = useState("");
  function submit(event: React.FormEvent) {
    event.preventDefault();
    onConnect(platform, accountName.trim());
    setAccountName("");
  }
  return (
    <form onSubmit={submit} className="glass-card rounded-3xl p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-violet-700">
          <Plus size={18} />
        </span>
        <div>
          <h2 className="font-semibold text-[#071e55]">Connect an account</h2>
          <p className="text-xs text-slate-500">
            Demo connection · no platform API call
          </p>
        </div>
      </div>
      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-semibold text-slate-700">
          Platform
          <select
            value={platform}
            onChange={(event) => setPlatform(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white/85 px-4 py-3 font-normal"
          >
            <option>Instagram</option>
            <option>LinkedIn</option>
            <option>X</option>
            <option>Facebook</option>
            <option>TikTok</option>
          </select>
        </label>
        <label className="text-sm font-semibold text-slate-700">
          Account name
          <input
            required
            value={accountName}
            onChange={(event) => setAccountName(event.target.value)}
            placeholder="@account or page name"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white/85 px-4 py-3 font-normal placeholder:text-slate-400"
          />
        </label>
      </div>
      <button
        type="submit"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#173b9a] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/15 hover:bg-[#0f2e7d]"
      >
        <Plus size={16} />
        Connect account
      </button>
    </form>
  );
}
