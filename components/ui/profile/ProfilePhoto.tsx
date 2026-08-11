import { Upload } from 'lucide-react';

export function ProfilePhoto({ 
    avatarUrl, 
    onClick 
}: { 
    avatarUrl: string;
    onClick?: () => void;
}) {
    return (
        <div className="flex items-center gap-4">
            <div 
                className="relative group cursor-pointer"
                onClick={onClick}
            >
                <img
                    src={avatarUrl}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                />
                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Upload size={20} className="text-white" />
                </div>
            </div>
            <div>
                <p className="font-medium text-gray-800">Photo</p>
            </div>
        </div>
    );
}