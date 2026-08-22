"use client";

import { useState } from "react";
import { WandSparkles, ArrowLeft, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface AIAssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyContent: (newContent: string) => void;
  channel?: string;
  channelIcon?: React.ReactNode;
  mode?: "post" | "comment";
}

export function AIAssistantPanel({
  isOpen,
  onClose,
  onApplyContent,
  channel,
  channelIcon,
  mode = "post",
}: AIAssistantPanelProps) {
  const t = useTranslations("composer");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOptions, setGeneratedOptions] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGeneratedOptions([]);
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: prompt,
          tone: "engaging",
          platform: channel || "Facebook",
          length: "short",
          type: mode,
          variations: 3,
        }),
      });

      const data = await response.json();
      if (data.success && data.captions && data.captions.length > 0) {
        setGeneratedOptions(data.captions);
        toast.success(t("optionsGenerated", { count: data.captions.length }));
      } else {
        toast.error(data.error || t("generateFailed"));
      }
    } catch (error) {
      toast.error(t("generateFailed"));
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = (content: string) => {
    onApplyContent(content);
    toast.success(
      mode === "comment" ? t("replyInserted") : t("captionInserted"),
    );
    setGeneratedOptions([]);
    setPrompt("");
  };

  return (
    <div className="w-80 border-l border-gray-200 bg-gray-50 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <button
          onClick={onClose}
          className="p-1 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={16} strokeWidth={2.2} />
        </button>
        <div className="flex items-center gap-1.5">
          <WandSparkles size={16} className="text-purple-600" />
          <h4 className="text-sm font-semibold text-gray-800">{t("ai")}</h4>
        </div>
        <div className="text-gray-400">{channelIcon}</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Input form */}
        <form onSubmit={handleGenerate} className="space-y-3 mb-4">
          <label
            htmlFor="prompt"
            className="text-sm font-medium text-gray-700 block"
          >
            {t("aiPrompt")}
          </label>
          <textarea
            id="prompt"
            name="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              mode === "comment"
                ? t("aiCommentPlaceholder")
                : t("aiPostPlaceholder")
            }
            rows={4}
            className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <WandSparkles size={16} strokeWidth={2.2} />
            {isGenerating ? t("generating") : t("generateOptions")}
          </button>
        </form>

        {/* Generated options */}
        {generatedOptions.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("chooseOption")}
            </p>
            {generatedOptions.map((option, index) => (
              <div
                key={index}
                className="border rounded-md bg-white p-3 hover:shadow-md transition-shadow"
              >
                <p className="text-sm text-gray-700 mb-2">{option}</p>
                <button
                  onClick={() => handleApply(option)}
                  className="text-xs text-purple-600 hover:underline font-medium flex items-center gap-1"
                >
                  <Sparkles size={12} />
                  {t("apply")}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
