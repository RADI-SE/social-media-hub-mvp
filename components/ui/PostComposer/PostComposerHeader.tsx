"use client";

import { WandSparkles, ScanEye, X } from "lucide-react";
import { useTranslations } from "next-intl";

interface HeaderProps {
  mode?: "post" | "comment";
  previewOpen: boolean;
  onTogglePreview: () => void;
  aiOpen: boolean;
  onToggleAI: () => void;
  onClose: () => void;
}

export function PostComposerHeader({
  mode = "post",
  previewOpen,
  onTogglePreview,
  aiOpen,
  onToggleAI,
  onClose,
}: HeaderProps) {
  const t = useTranslations("composer");
  const common = useTranslations("common");
  return (
    <header className="flex flex-none items-center justify-between border-b border-gray-200 px-6 py-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          {t(mode === "post" ? "createPost" : "createComment")}
        </h3>
        <p className="text-sm text-gray-500">{t("editorDescription")}</p>
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
          <span>{t("ai")}</span>
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
          <span>{t("preview")}</span>
        </button>

        <button
          aria-label={common("close")}
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 rounded"
        >
          <X size={16} strokeWidth={2.2} />
        </button>
      </div>
    </header>
  );
}
