"use client";

import { useEffect, useRef, useState } from "react";
import { PostComposerHeader } from "./PostComposerHeader";
import {
  ChannelSelector,
  COMPOSER_CHANNELS,
  type ComposerChannelId,
} from "./ChannelSelector";
import { ContentEditor } from "./ContentEditor";
import { PreviewSidebar } from "./PreviewSidebar";
import { PostComposerFooter } from "./PostComposerFooter";
import { AIAssistantPanel } from "./AIAssistantPanel";
import { CalendarIcon, Link2 } from "lucide-react";
import { toast } from "sonner";
import { type Platform } from "@/types/social-account";

interface PostComposerProps {
  isOpen: boolean;
  onClose: () => void;
  onPost?: (
    content: string,
    platforms: Platform[],
    targetUrl?: string,
    image?: File,
  ) => void;
  onSchedule?: (
    content: string,
    scheduledAt: number,
    platforms: Platform[],
    targetUrl?: string,
    image?: File,
  ) => void;
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
  const [selectedChannels, setSelectedChannels] = useState<ComposerChannelId[]>(
    [],
  );
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [scheduledTime, setScheduledTime] = useState<string>("");
  const [showScheduler, setShowScheduler] = useState(false);
  const [targetUrl, setTargetUrl] = useState(initialTargetUrl);

  const backdropRef = useRef<HTMLDivElement>(null);
  const imagePreviewUrlRef = useRef<string | null>(null);

  const selectedChannelConfigs = COMPOSER_CHANNELS.filter((item) =>
    selectedChannels.includes(item.id),
  );
  const channel = selectedChannelConfigs[0];
  const ChannelIcon = channel?.icon;
  const targetChannelName = channel?.label ?? "Social media";
  const targetUrlPlaceholder =
    channel?.id === "instagram"
      ? "https://www.instagram.com/p/..."
      : channel?.id === "facebook"
        ? "https://www.facebook.com/share/p/..."
        : "https://...";

  const handleChannelToggle = (id: ComposerChannelId) => {
    setSelectedChannels((current) => {
      if (mode === "comment") return current.includes(id) ? [] : [id];
      return current.includes(id)
        ? current.filter((channelId) => channelId !== id)
        : [...current, id];
    });
  };

  useEffect(
    () => () => {
      if (imagePreviewUrlRef.current) {
        URL.revokeObjectURL(imagePreviewUrlRef.current);
      }
    },
    [],
  );

  const handleImageSelect = (selectedImage: File) => {
    if (imagePreviewUrlRef.current) {
      URL.revokeObjectURL(imagePreviewUrlRef.current);
    }
    const objectUrl = URL.createObjectURL(selectedImage);
    imagePreviewUrlRef.current = objectUrl;
    setImage(selectedImage);
    setImagePreviewUrl(objectUrl);
  };

  const handleImageRemove = () => {
    if (imagePreviewUrlRef.current) {
      URL.revokeObjectURL(imagePreviewUrlRef.current);
      imagePreviewUrlRef.current = null;
    }
    setImage(null);
    setImagePreviewUrl(null);
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
    if (onPost && content.trim()) {
      const platforms = selectedChannelConfigs.map((item) => item.platform);
      onPost(
        content,
        platforms,
        mode === "comment" ? targetUrl : undefined,
        image ?? undefined,
      );
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
    if (onSchedule && content.trim()) {
      const platforms = selectedChannelConfigs.map((item) => item.platform);
      onSchedule(
        content,
        timestamp,
        platforms,
        mode === "comment" ? targetUrl : undefined,
        image ?? undefined,
      );
      setShowScheduler(false);
      setScheduledTime("");
      if (mode === "comment") setTargetUrl("");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className={`relative flex max-h-[calc(100dvh-2rem)] min-h-0 w-[90vw] flex-col overflow-hidden rounded-lg bg-white shadow-2xl transition-all duration-200 ${
          previewOpen ? "max-w-6xl" : "max-w-3xl"
        }`}
      >
        <PostComposerHeader
          previewOpen={previewOpen}
          onTogglePreview={handleTogglePreview}
          aiOpen={aiOpen}
          onToggleAI={handleToggleAI}
          onClose={onClose}
        />

        <div className="flex min-h-0 flex-1 overflow-hidden">
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-6">
            <ChannelSelector
              selected={selectedChannels}
              onToggle={handleChannelToggle}
              multiple={mode === "post"}
            />

            {mode === "comment" && (
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  {targetChannelName} Post URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder={targetUrlPlaceholder}
                    className="w-full border border-gray-200 rounded-md p-4 focus-within:ring-2 focus-within:ring-blue-500 px-4 py-3 pl-10"
                  />
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
                <p className="mt-1.5 text-xs text-gray-400">
                  Paste the full post link from the selected channel.
                </p>
              </div>
            )}
            <ContentEditor
              value={content}
              onChange={setContent}
              image={image}
              imagePreviewUrl={imagePreviewUrl}
              onImageSelect={mode === "post" ? handleImageSelect : undefined}
              onImageRemove={mode === "post" ? handleImageRemove : undefined}
            />

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

          {previewOpen && !aiOpen && (
            <PreviewSidebar
              content={content}
              channels={selectedChannels}
              imageUrl={imagePreviewUrl}
            />
          )}
          {aiOpen && !previewOpen && (
            <AIAssistantPanel
              isOpen={aiOpen}
              onClose={handleToggleAI}
              onApplyContent={setContent}
              channel={
                selectedChannelConfigs.map((item) => item.label).join(" & ") ||
                "Facebook"
              }
              channelIcon={
                selectedChannelConfigs.length === 1 && ChannelIcon ? (
                  <ChannelIcon className="h-4 w-4" />
                ) : null
              }
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
