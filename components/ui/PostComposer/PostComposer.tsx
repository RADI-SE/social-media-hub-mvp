"use client";

import { useState, useRef } from "react";
import { PostComposerHeader } from "./PostComposerHeader";
import { ChannelSelector } from "./ChannelSelector";
import { ContentEditor } from "./ContentEditor";
import { PreviewSidebar } from "./PreviewSidebar";
import { PostComposerFooter } from "./PostComposerFooter";
import { AIAssistantPanel } from "./AIAssistantPanel";
import { TwitterIcon, FacebookIcon } from "../ChannelIcons";
import { CalendarIcon } from "lucide-react";

interface PostComposerProps {
  isOpen: boolean;
  onClose: () => void;
  onPost?: (content: string) => void;
  onSchedule?: (content: string, scheduledAt: number) => void;
  isPosting?: boolean;
  isScheduling?: boolean; 
}

export function PostComposer({
  isOpen,
  onClose,
  onPost,
  onSchedule,
  isPosting = false,
  isScheduling = false, 
}: PostComposerProps) {
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [scheduledTime, setScheduledTime] = useState<string>("");
  const [showScheduler, setShowScheduler] = useState(false);

  const backdropRef = useRef<HTMLDivElement>(null);

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
    if (onPost && content.trim()) {
      onPost(content);
    }
  };

  const handleSchedule = () => {
    if (!scheduledTime) {
      alert("Please select a date and time.");
      return;
    }
    const timestamp = new Date(scheduledTime).getTime();
    if (timestamp <= Date.now()) {
      alert("Scheduled time must be in the future.");
      return;
    }
    if (onSchedule && content.trim()) {
      onSchedule(content, timestamp);
      setShowScheduler(false);
      setScheduledTime("");
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
        className={`relative bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden w-[90vw] transition-all duration-200 ${
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

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 flex flex-col overflow-y-auto p-6">
            <ChannelSelector
              selected={selectedChannels}
              onToggle={toggleChannel}
            />
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
                    min={new Date().toISOString().slice(0, 16)}
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
              onApplyContent={setContent}
              channelIcon={getChannelIcon(selectedChannels[0] || "")}
              onClose={() => setAiOpen(false)}
            />
          )}
        </div>

        <PostComposerFooter
          selectedCount={selectedChannels.length}
          onPost={handlePost}
          isPosting={isPosting}
          isDisabled={!content.trim() || selectedChannels.length === 0}
        />
      </div>
    </div>
  );
}