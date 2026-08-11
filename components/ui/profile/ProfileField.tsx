
import { TriangleAlert } from 'lucide-react';
export function ProfileField({
    label,
    value,
    onChange,
    onSave,
    type = 'text',
    placeholder = '',
    warning = false,
    disabled = false,
}: {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSave: () => void;
    type?: string;
    placeholder?: string;
    warning?: boolean;
    disabled?: boolean;
}) {
    return (
        <form className="flex items-end gap-3 w-full" onSubmit={(e) => { e.preventDefault(); onSave(); }}>
            <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <div className="relative">
                    <input
                        type={type}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {warning && (
                        <TriangleAlert size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-500" />
                    )}
                </div>
            </div>
            <button
                type="submit"
                disabled={disabled}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Save Changes
            </button>
        </form>
    );
}
