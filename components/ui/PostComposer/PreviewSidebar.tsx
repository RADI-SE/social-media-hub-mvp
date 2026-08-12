"use client";

import { useState } from "react";
import { Eye, FileText, Heart, Image as ImageIcon, Info, MessageCircle, MoreHorizontal, Share2 } from "lucide-react";
import { FacebookIcon, TwitterIcon } from "../ChannelIcons";

type Channel = "facebook" | "twitter" | "default";

interface PreviewSidebarProps {
  content?: string;
  initialChannel?: Channel;
}

export function PreviewSidebar({ content = "Start writing your post...", initialChannel = "default" }: PreviewSidebarProps) {
  const [activeChannel, setActiveChannel] = useState<Channel>(initialChannel);
  const tabs: { id: Channel; label: string; icon: React.ReactNode }[] = [
    { id: "default", label: "General preview", icon: <Eye className="h-4 w-4" /> },
    { id: "facebook", label: "Facebook preview", icon: <FacebookIcon className="h-4 w-4" /> },
    { id: "twitter", label: "X preview", icon: <TwitterIcon className="h-4 w-4" /> },
  ];

  return (
    <aside className="flex w-80 flex-col overflow-y-auto border-l border-gray-200 bg-gray-50 p-4">
      <div className="mb-4 flex items-center justify-between"><h2 className="text-sm font-semibold text-gray-700">Preview</h2><Info size={16} className="text-gray-400" /></div>
      <div className="mb-4 flex rounded-md bg-gray-200 p-1">
        {tabs.map(({ id, label, icon }) => (
          <button key={id} type="button" aria-label={label} onClick={() => setActiveChannel(id)} className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${activeChannel === id ? "bg-white text-gray-800 shadow-sm" : "text-gray-600 hover:text-gray-800"}`}>{icon}</button>
        ))}
      </div>
      <div className="flex-1">
        {activeChannel === "default" && <ByDefault />}
        {activeChannel === "facebook" && <SocialPreview content={content} network="facebook" />}
        {activeChannel === "twitter" && <SocialPreview content={content} network="twitter" />}
      </div>
    </aside>
  );
}

function SocialPreview({ content, network }: { content: string; network: "facebook" | "twitter" }) {
  const user = network === "facebook" ? { name: "Spiders AI", handle: "" } : { name: "Spiders AI", handle: "spiders_ai" };
  const actions = network === "facebook" ? ["Like", "Comment", "Share"] : ["Like", "Reply", "Retweet"];
  const icons = [Heart, MessageCircle, Share2];

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="flex items-start gap-3 p-3">
        <PreviewAvatar name={user.name} />
        <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-gray-800">{user.name}{user.handle && <span className="ml-1 font-normal text-gray-500">@{user.handle}</span>}</p><p className="text-xs text-gray-500">Just now</p></div>
        <MoreHorizontal size={16} className="flex-shrink-0 text-gray-400" />
      </div>
      <div className="px-3 pb-2"><p className="whitespace-pre-wrap break-words text-sm text-gray-800">{content}</p></div>
      <div className="flex items-center justify-around border-t border-gray-100 px-2 py-1">
        {actions.map((action, index) => {
          const Icon = icons[index];
          return <span key={action} className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500"><Icon size={16} strokeWidth={1.5} /><span>{action}</span></span>;
        })}
      </div>
    </div>
  );
}

function PreviewAvatar({ name }: { name: string }) {
  const initials = name.split(/\s+/).filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  return <span aria-label={name} className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#c4ffe6] to-[#7590ff] text-xs font-bold text-[#09276b]">{initials || "S"}</span>;
}

function ByDefault() {
  return (
    <aside className="flex w-80 flex-col items-center justify-center border-l border-gray-200 bg-gray-50 p-6">
      <div className="space-y-4 text-center">
        <div className="relative inline-block"><div className="mx-auto flex h-24 w-24 items-center justify-center rounded-lg bg-gray-200"><ImageIcon size={40} className="text-gray-400" strokeWidth={1.5} /></div><div className="absolute -bottom-2 -right-2 rounded-full border border-gray-200 bg-white p-1 shadow-sm"><FileText size={16} className="text-gray-500" /></div></div>
        <p className="mx-auto max-w-xs text-sm text-gray-500">See your post preview here</p>
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400"><Eye size={14} strokeWidth={1.5} /><span>Live preview</span></div>
      </div>
    </aside>
  );
}
