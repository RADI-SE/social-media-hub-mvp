import { Trash2 } from "lucide-react";

export function DangerZone({ onDelete }: { onDelete: () => void }) {
  return <section className="rounded-2xl border border-rose-200 bg-rose-50/70 p-5"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><div className="flex items-center gap-2 text-rose-700"><Trash2 size={17} /><h3 className="text-sm font-bold">Delete your account</h3></div><p className="mt-2 max-w-2xl text-xs leading-5 text-rose-700/75">Permanently removes your Spiders AI account and access. This action cannot be undone.</p></div><button type="button" onClick={onDelete} className="shrink-0 rounded-xl border border-rose-300 bg-white px-4 py-2.5 text-sm font-semibold text-rose-700 hover:bg-rose-600 hover:text-white">Delete account</button></div></section>;
}
