'use client';

import { useState } from 'react';
import { WandSparkles, ArrowLeft } from 'lucide-react';

interface AIAssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyContent: (newContent: string) => void;
  channel?: string;
  channelIcon?: React.ReactNode;
}

export function AIAssistantPanel({
  isOpen,
  onClose,
  onApplyContent,
  channel,
  channelIcon,
}: AIAssistantPanelProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);

    setTimeout(() => {
      const generatedText = `[AI‑generated] Based on: "${prompt}". Here’s your post.`;
      onApplyContent(generatedText);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="w-80 border-l border-gray-200 bg-gray-50 flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={16} strokeWidth={2.2} />
          </button>
          <div className="flex items-center gap-1.5">
            <WandSparkles size={16} className="text-purple-600" />
            <h4 className="text-sm font-semibold text-gray-800">AI Assistant</h4>
          </div>
        </div>
        
        <div className="text-gray-400">{channelIcon}</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <form onSubmit={handleGenerate} className="space-y-3">
          <label htmlFor="prompt" className="text-sm font-medium text-gray-700 block">
            What do you want to write about?
          </label>
          <textarea
            id="prompt"
            name="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Eg. Promote my photography course to get new signups. Registration closes in 3 days."
            rows={6}
            className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <WandSparkles size={16} strokeWidth={2.2} />
            {isGenerating ? 'Generating...' : 'Generate'}
          </button>
        </form>
      </div>
    </div>
  );
}