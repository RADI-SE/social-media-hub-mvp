"use client";

import { useRef } from "react";
import { ImagePlus, X } from "lucide-react";

interface ImageAttachmentProps {
  file: File | null;
  previewUrl: string | null;
  onSelect: (file: File) => void;
  onRemove: () => void;
}

export function ImageAttachment({
  file,
  previewUrl,
  onSelect,
  onRemove,
}: ImageAttachmentProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="border-t border-gray-100 pt-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => {
          const selectedFile = event.target.files?.[0];
          if (selectedFile) onSelect(selectedFile);
          event.target.value = "";
        }}
      />

      {file && previewUrl ? (
        <div className="relative h-40 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 sm:h-44">
          {/* A local object URL is required here so the selected file can be previewed before upload. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Selected post attachment"
            className="h-full w-full object-contain"
          />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-8 text-white">
            <span className="truncate text-xs font-medium">{file.name}</span>
            <button
              type="button"
              onClick={onRemove}
              className="grid h-8 w-8 flex-none place-items-center rounded-full bg-black/45 transition-colors hover:bg-black/65"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left text-sm text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-700"
        >
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600">
            <ImagePlus className="h-4 w-4" />
          </span>
          <span>
            <span className="block font-medium text-gray-700">
              Add an image
            </span>
            <span className="block text-xs text-gray-400">
              Choose an image to include with this post
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
