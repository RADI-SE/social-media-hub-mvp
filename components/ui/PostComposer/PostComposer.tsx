'use client';

import { useState, useRef } from 'react';
import { PostComposerHeader } from './PostComposerHeader';
import { ChannelSelector } from './ChannelSelector';
import { ContentEditor } from './ContentEditor';
import { PreviewSidebar } from './PreviewSidebar';
import { PostComposerFooter } from './PostComposerFooter';
import { AIAssistantPanel } from './AIAssistantPanel';
import { TwitterIcon, FacebookIcon } from '../ChannelIcons';

interface PostComposerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PostComposer({ isOpen, onClose }: PostComposerProps) {
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  const backdropRef = useRef<HTMLDivElement>(null);

  const getChannelIcon = (channelId: string) => {
    switch (channelId) {
      case 'twitter': return <TwitterIcon className="w-4 h-4" />;
      case 'facebook': return <FacebookIcon className="w-4 h-4" />;
      default: return null;
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

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className={`relative bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden w-[90vw] transition-all duration-200 ${
          previewOpen ? 'max-w-6xl' : 'max-w-3xl'
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
            <ChannelSelector selected={selectedChannels} onToggle={toggleChannel} />
            <ContentEditor value={content} onChange={setContent} />
          </div>

          {previewOpen && !aiOpen && <PreviewSidebar content={content} />}
          {aiOpen && !previewOpen && (
            <AIAssistantPanel
              isOpen={aiOpen}
              onApplyContent={setContent}
              channelIcon={getChannelIcon(selectedChannels[0] || '')}
              onClose={() => setAiOpen(false)} // 👈 pass onClose so "Go back" works
            />
          )}
        </div>

        <PostComposerFooter selectedCount={selectedChannels.length} />
      </div>
    </div>
  );
}
