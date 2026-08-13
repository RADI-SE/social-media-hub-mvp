"use client";

 
interface ContentEditorProps {
  value: string;
  onChange: (value: string) => void;
  charLimit?: number;
  channel?: "twitter" | "facebook" | "instagram";
}

export function ContentEditor({ value, onChange }: ContentEditorProps) {
  
  return (
    <section className="flex-1 mb-4">
      <div className="border  rounded-md p-4 min-h-[200px] focus-within:ring-2 focus-within:ring-blue-500">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Start writing..."
          className="w-full min-h-[150px] resize-none outline-none text-gray-800 "
        />
      </div>
    </section>
  );
}
