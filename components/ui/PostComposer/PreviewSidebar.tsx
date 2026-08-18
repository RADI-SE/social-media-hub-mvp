"use client";

import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Bookmark,
  Info,
  Image as ImageIcon,
  FileText,
  Eye,
} from "lucide-react";

import { FacebookIcon, InstagramIcon } from "../ChannelIcons";
import { type ComposerChannelId } from "./ChannelSelector";

interface PreviewSidebarProps {
  content?: string;
  channel?: ComposerChannelId | null;
  imageUrl?: string | null;
}

export function PreviewSidebar({
  content = "Start writing your post...",
  channel,
  imageUrl,
}: PreviewSidebarProps) {
  const channelLabel = channel === "instagram" ? "Instagram" : "Facebook";
  const ChannelIcon = channel === "instagram" ? InstagramIcon : FacebookIcon;

  return (
    <aside className="flex min-h-0 w-80 flex-col overflow-y-auto border-l border-gray-200 bg-gray-50 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-700">Preview</h2>
        <Info size={16} className="text-gray-400" />
      </div>

      {channel && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-200">
          <ChannelIcon className="h-4 w-4 text-blue-600" />
          {channelLabel}
        </div>
      )}

      <div className="flex-1">
        {!channel && <ByDefault />}
        {channel === "facebook" && (
          <FacebookPreview content={content} imageUrl={imageUrl} />
        )}
        {channel === "instagram" && (
          <InstagramPreview content={content} imageUrl={imageUrl} />
        )}
      </div>
    </aside>
  );
}

interface SocialPreviewProps {
  content: string;
  imageUrl?: string | null;
}

function FacebookPreview({ content, imageUrl }: SocialPreviewProps) {
  const user = { name: "Spiders AI" };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex items-start gap-3 p-3">
        <Avatar name={user.name} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">
            {user.name}
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            Just Now ·
          </p>
        </div>
        <MoreHorizontal size={16} className="text-gray-400 flex-shrink-0" />
      </div>
      <div className="px-3 pb-2">
        <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">
          {content}
        </p>
      </div>
      {imageUrl && <PreviewImage src={imageUrl} />}
      <div className="flex items-center justify-around border-t border-gray-100 px-2 py-1">
        <span className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500">
          <Heart size={16} strokeWidth={1.5} /> <span>Like</span>
        </span>
        <span className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500">
          <MessageCircle size={16} strokeWidth={1.5} /> <span>Comment</span>
        </span>
        <span className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500">
          <Share2 size={16} strokeWidth={1.5} /> <span>Share</span>
        </span>
      </div>
    </div>
  );
}

function InstagramPreview({ content, imageUrl }: SocialPreviewProps) {
  const user = { name: "Spiders AI" };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 p-3">
        <Avatar name={user.name} />
        <p className="flex-1 truncate text-sm font-semibold text-gray-800">
          {user.name}
        </p>
        <MoreHorizontal size={16} className="text-gray-400" />
      </div>
      {imageUrl ? (
        <PreviewImage src={imageUrl} square />
      ) : (
        <div className="grid aspect-square place-items-center bg-gradient-to-br from-blue-50 via-white to-emerald-50 text-gray-400">
          <ImageIcon className="h-10 w-10" strokeWidth={1.4} />
        </div>
      )}
      <div className="flex items-center gap-4 px-3 py-3 text-gray-700">
        <Heart size={19} strokeWidth={1.7} />
        <MessageCircle size={19} strokeWidth={1.7} />
        <Share2 size={19} strokeWidth={1.7} />
        <Bookmark size={19} strokeWidth={1.7} className="ml-auto" />
      </div>
      <p className="px-3 pb-4 text-sm text-gray-800 whitespace-pre-wrap break-words">
        <span className="mr-1 font-semibold">spiders_ai</span>
        {content}
      </p>
    </div>
  );
}

function PreviewImage({
  src,
  square = false,
}: {
  src: string;
  square?: boolean;
}) {
  return (
    // A blob URL previews the local selection before the backend uploads it.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Post attachment preview"
      className={
        square
          ? "aspect-square w-full object-cover"
          : "max-h-72 w-full object-cover"
      }
    />
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
  return (
    <span
      aria-label={`${name} avatar`}
      className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#c4ffe6] to-[#7590ff] text-xs font-bold text-[#09276b]"
    >
      {initials}
    </span>
  );
}

function ByDefault() {
  return (
    <aside className="w-80 border-l border-gray-200 bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-4">
        <div className="relative inline-block">
          <div className="w-24 h-24 mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
            <ImageIcon size={40} className="text-gray-400" strokeWidth={1.5} />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-sm border border-gray-200">
            <FileText size={16} className="text-gray-500" />
          </div>
        </div>
        <p className="text-sm text-gray-500 max-w-xs mx-auto">
          See your posts preview here
        </p>

        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
          <Eye size={14} strokeWidth={1.5} />
          <span>Live preview</span>
        </div>
      </div>
    </aside>
  );
}
