'use client';

import { ImagePlus,} from 'lucide-react';

interface ContentEditorProps {
  value: string;
  onChange: (value: string) => void;
  charLimit?: number;
  channel?: 'twitter' | 'facebook' | 'instagram';
}

export function ContentEditor({
  value,
  onChange,
}: ContentEditorProps) {
 
  return (
    <section className="flex-1 mb-4">
      <div className="border border-gray-200 rounded-md p-4 min-h-[200px] focus-within:ring-2 focus-within:ring-blue-500">
         
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Start writing..."
          className="w-full min-h-[150px] resize-none outline-none text-gray-800 placeholder-gray-400"
        />

        <div className="mt-4 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6">
          <div className="text-center">
            <ImagePlus className="mx-auto h-12 w-12 text-gray-400" strokeWidth={1.5} />
            <p className="mt-2 text-sm text-gray-500">
              Drag &amp; drop or{' '}
              <button className="text-blue-600 hover:underline">select a file</button>
            </p>
          </div>
        </div>
      </div>

    </section>
  );
}