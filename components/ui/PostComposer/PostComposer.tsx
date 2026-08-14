"use client";

import { useState, useRef } from "react";
import { PostComposerHeader } from "./PostComposerHeader";
import { ChannelSelector } from "./ChannelSelector";
import { ContentEditor } from "./ContentEditor";
import { PreviewSidebar } from "./PreviewSidebar";
import { PostComposerFooter } from "./PostComposerFooter";
import { AIAssistantPanel } from "./AIAssistantPanel";
import { TwitterIcon, FacebookIcon } from "../ChannelIcons";
import { CalendarIcon, Link2 } from "lucide-react";
import { toast } from "sonner";
import { type Platform } from "@/types/social-account";

interface PostComposerProps {
  isOpen: boolean;
  onClose: () => void;
  onPost?: (content: string, platform: Platform, targetUrl?: string) => void;
  onSchedule?: (content: string, scheduledAt: number, platform: Platform, targetUrl?: string) => void;
  isPosting?: boolean;
  isScheduling?: boolean;
  mode?: "post" | "comment";
  initialTargetUrl?: string;
}

export function PostComposer({
  isOpen,
  onClose,
  onPost,
  onSchedule,
  isPosting = false,
  isScheduling = false,
  mode = "post",
  initialTargetUrl = "",
}: PostComposerProps) {
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [scheduledTime, setScheduledTime] = useState<string>("");
  const [showScheduler, setShowScheduler] = useState(false);
  const [targetUrl, setTargetUrl] = useState(initialTargetUrl);

  const backdropRef = useRef<HTMLDivElement>(null);

  const platformMap: Record<string, Platform> = {
    facebook: "Facebook",
    twitter: "X",
    instagram: "Instagram",
    linkedin: "LinkedIn",
    tiktok: "TikTok",
  };

  const getChannelIcon = (channelId: string) => {
    switch (channelId) {
      case "twitter":
        return <TwitterIcon className="w-4 h-4" />;
      case "facebook":
        return <FacebookIcon className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const toggleChannel = (id: string) => {
    setSelectedChannels((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  const handleTogglePreview = () => {
    if (previewOpen) {
      setPreviewOpen(false);
    } else {
      setPreviewOpen(true);
      setAiOpen(false);
    }
  };

  const handleToggleAI = () => {
    if (aiOpen) {
      setAiOpen(false);
    } else {
      setAiOpen(true);
      setPreviewOpen(false);
    }
  };
  const handlePost = () => {
    console.log("🔵 handlePost called, targetUrl:", targetUrl);

    if (mode === "comment") {
      const trimmedUrl = targetUrl.trim();
      if (!trimmedUrl) {
        toast.error("Please enter a post URL.");
        return;
      }
      try {
        new URL(trimmedUrl);
      } catch {
        toast.error("Please enter a valid URL (e.g., https://www.facebook.com/...)");
        return;
      }
    }
    if (onPost && content.trim()) {
      const platform = selectedChannels.length > 0
        ? platformMap[selectedChannels[0]]
        : "Facebook";
      onPost(content, platform, mode === "comment" ? targetUrl : undefined);
    }
  };

  const handleSchedule = () => {
    if (!scheduledTime) {
      toast.error("Please select a date and time.");
      return;
    }
    const timestamp = new Date(scheduledTime).getTime();
    if (timestamp <= Date.now()) {
      toast.error("Scheduled time must be in the future.");
      return;
    }
    if (mode === "comment") {
      const trimmedUrl = targetUrl.trim();
      if (!trimmedUrl) {
        toast.error("Please enter a post URL.");
        return;
      }
      try {
        new URL(trimmedUrl);
      } catch {
        toast.error("Please enter a valid URL.");
        return;
      }
    }
    if (onSchedule && content.trim()) {
      const platform = selectedChannels.length > 0
        ? platformMap[selectedChannels[0]]
        : "Facebook";
      onSchedule(content, timestamp, platform, mode === "comment" ? targetUrl : undefined);
      setShowScheduler(false);
      setScheduledTime("");
      if (mode === "comment") setTargetUrl("");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className={`relative bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden w-[90vw] transition-all duration-200 ${previewOpen ? "max-w-6xl" : "max-w-3xl"
          }`}
      >
        <PostComposerHeader
          previewOpen={previewOpen}
          onTogglePreview={handleTogglePreview}
          aiOpen={aiOpen}
          onToggleAI={handleToggleAI}
          onClose={onClose}
        />

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 flex flex-col overflow-y-auto p-6">
            <ChannelSelector
              selected={selectedChannels}
              onToggle={toggleChannel}
            />

            {mode === "comment" && (
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Facebook Post URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="https://www.facebook.com/share/p/..."
                    className="w-full border border-gray-200 rounded-md p-4 focus-within:ring-2 focus-within:ring-blue-500 px-4 py-3 pl-10"
                  />
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
                <p className="mt-1.5 text-xs text-gray-400">
                  Paste the full Facebook post link (e.g., https://www.facebook.com/share/p/1Up3sopZMV/)
                </p>
              </div>
            )}
            <ContentEditor value={content} onChange={setContent} />

            <div className="mt-4">
              <button
                onClick={() => setShowScheduler(!showScheduler)}
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                <CalendarIcon className="w-4 h-4" />
                {showScheduler ? "Cancel Schedule" : "Schedule for later"}
              </button>
              {showScheduler && (
                <div className="mt-2 p-3 border rounded-lg flex items-center gap-3">
                  <input
                    type="datetime-local"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  />
                  <button
                    onClick={handleSchedule}
                    disabled={!scheduledTime || isScheduling}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isScheduling ? "Scheduling..." : "Confirm Schedule"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {previewOpen && !aiOpen && <PreviewSidebar content={content} />}
          {aiOpen && !previewOpen && (
            <AIAssistantPanel
              isOpen={aiOpen}
              onClose={handleToggleAI}
              onApplyContent={setContent}
              channel={selectedChannels[0] || "Facebook"}
              channelIcon={getChannelIcon(selectedChannels[0] || "")}
              mode={mode} 
            />
          )}
        </div>

        <PostComposerFooter
          selectedCount={selectedChannels.length}
          onPost={handlePost}
          isPosting={isPosting}
          isDisabled={
            !content.trim() ||
            selectedChannels.length === 0 ||
            (mode === "comment" && !targetUrl.trim())
          }
        />
      </div>
    </div>
  );
}