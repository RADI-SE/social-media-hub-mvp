"use client";

import { ImageAttachment } from "./ImageAttachment";
import { useTranslations } from "next-intl";

interface ContentEditorProps {
  value: string;
  onChange: (value: string) => void;
  image?: File | null;
  imagePreviewUrl?: string | null;
  onImageSelect?: (file: File) => void;
  onImageRemove?: () => void;
}

export function ContentEditor({
  value,
  onChange,
  image = null,
  imagePreviewUrl = null,
  onImageSelect,
  onImageRemove,
}: ContentEditorProps) {
  const t = useTranslations("composer");
  return (
    <section className="flex-1 mb-4">
      <div className="min-h-[200px] rounded-xl border border-gray-200 bg-white p-4 transition-shadow focus-within:ring-2 focus-within:ring-blue-500">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t("startWriting")}
          className="min-h-[150px] w-full resize-none bg-transparent text-gray-800 outline-none"
        />
        {onImageSelect && onImageRemove && (
          <ImageAttachment
            file={image}
            previewUrl={imagePreviewUrl}
            onSelect={onImageSelect}
            onRemove={onImageRemove}
          />
        )}
      </div>
    </section>
  );
}
