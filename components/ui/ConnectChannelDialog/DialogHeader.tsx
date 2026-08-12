'use client';

import { X } from 'lucide-react';

interface DialogHeaderProps {
  title: string;
  description: string;
  onClose: () => void;
}

export function DialogHeader({ title, description, onClose }: DialogHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
      <div>
        <h3 id="connect-dialog-title" className="text-lg font-semibold text-gray-900">
          {title}
        </h3>
        <p id="connect-dialog-desc" className="text-sm text-gray-500">
          {description}
        </p>
      </div>
      <button
        onClick={onClose}
        className="p-1 text-gray-400 hover:text-gray-600 rounded"
        aria-label="Close"
      >
        <X size={20} />
      </button>
    </div>
  );
}