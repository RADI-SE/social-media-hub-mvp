import { Camera } from "lucide-react";

export function ProfilePhoto({ avatarUrl, onClick, disabled = false }: { avatarUrl: string; onClick?: () => void; disabled?: boolean }) {
  return <div className="flex items-center gap-4"><button type="button" onClick={onClick} disabled={disabled} aria-label="Upload a new profile photo" className="group relative h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-blue-100 bg-cover bg-center shadow-lg shadow-blue-900/10 disabled:cursor-wait" style={{ backgroundImage: `url(${avatarUrl})` }}><span className="absolute inset-0 grid place-items-center bg-[#071e55]/65 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"><Camera size={21} /></span></button><div><p className="font-semibold text-[#071e55]">Profile photo</p><p className="mt-1 text-xs leading-5 text-slate-500">JPEG, PNG, GIF, or WebP.<br />Maximum 5 MB.</p></div></div>;
}
