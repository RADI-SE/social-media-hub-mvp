import Link from "next/link";

export default function BrandMark({
  compact = false,
  href = "/home",
}: {
  compact?: boolean;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3"
      aria-label="Spiders AI Hub home"
    >
      <span className="brand-web" aria-hidden="true">
        <span />
      </span>
      {!compact && (
        <span className="leading-none">
          <strong className="block text-[1.05rem] font-semibold tracking-[-0.03em] text-[#09276b]">
            Spiders AI
          </strong>
          <span className="mt-1 block text-[0.58rem] tracking-[0.05em] text-slate-500">
            MARKETING HUB
          </span>
        </span>
      )}
    </Link>
  );
}
