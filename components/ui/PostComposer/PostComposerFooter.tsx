'use client';

interface FooterProps {
  selectedCount: number;
}

export function PostComposerFooter({ selectedCount }: FooterProps) {
  return (
    <footer className="border-t border-gray-200 px-6 py-4 flex justify-end">
      <button
        disabled={selectedCount === 0}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {selectedCount === 0
          ? 'Connect a Channel to Post'
          : `Post to ${selectedCount} channel${selectedCount > 1 ? 's' : ''}`}
      </button>
    </footer>
  );
}