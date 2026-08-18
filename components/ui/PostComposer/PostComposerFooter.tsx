interface PostComposerFooterProps {
  selectedCount: number;
  onPost: () => void;
  isPosting: boolean;
  isDisabled: boolean;
}

export function PostComposerFooter({
  selectedCount,
  onPost,
  isPosting,
  isDisabled,
}: PostComposerFooterProps) {
  return (
    <div className="flex flex-none items-center justify-between border-t border-gray-200 px-6 py-4">
      <span className="text-sm text-gray-500">
        {selectedCount} channel{selectedCount !== 1 ? "s" : ""} selected
      </span>
      <button
        onClick={onPost}
        disabled={isDisabled || isPosting}
        className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPosting ? "Posting..." : "Post"}
      </button>
    </div>
  );
}
