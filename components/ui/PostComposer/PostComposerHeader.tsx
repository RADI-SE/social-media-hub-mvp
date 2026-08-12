"use client";

import { WandSparkles, ScanEye, X } from "lucide-react";

interface HeaderProps {
  previewOpen: boolean;
  onTogglePreview: () => void;
  aiOpen: boolean;
  onToggleAI: () => void;
  onClose: () => void;
}

export function PostComposerHeader({
  previewOpen,
  onTogglePreview,
  aiOpen,
  onToggleAI,
  onClose,
}: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Create Post</h3>
        <p className="text-sm text-gray-500">Create and edit posts</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleAI}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md ${
            aiOpen
              ? "bg-blue-50 text-blue-700"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <WandSparkles size={16} strokeWidth={2.2} />
          <span>AI Assistant</span>
        </button>

        <button
          onClick={onTogglePreview}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md ${
            previewOpen
              ? "bg-blue-50 text-blue-700"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <ScanEye size={16} strokeWidth={2.2} />
          <span>Preview</span>
        </button>

        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 rounded"
        >
          <X size={16} strokeWidth={2.2} />
        </button>
      </div>
    </header>
  );
}
