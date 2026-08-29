import Link from "next/link";
import { getIcon } from "@/lib/icon-map";
import { getCategoryPalette } from "@/lib/category-colors";
import { formatINR } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export function ServiceCard({ slug, name, summary, category, fee, icon }: { slug: string; name: string; summary: string; category: string; fee: number; icon?: string | null }) {
  const Icon = getIcon(icon);
  const palette = getCategoryPalette(category);
  return (
    <Link href={`/services/${slug}`} className="ticket-card flex group">
      {/* Main stub */}
      <div className="flex-1 p-5 flex flex-col gap-3 min-w-0 pr-6">
        <div className="flex items-start justify-between gap-2">
          <span className={`rounded-lg p-2.5 shrink-0 transition-transform group-hover:scale-105 ${palette.chipBg} ${palette.chipText}`}>
            <Icon size={20} />
          </span>
          <span className={`badge text-[10px] uppercase tracking-wide shrink-0 ${palette.badgeBg} ${palette.badgeText}`}>{category}</span>
        </div>
        <div>
          <h3 className="font-display font-semibold text-ink-800 leading-snug uppercase tracking-wide text-[15px]">{name}</h3>
          <p className="text-sm text-ink-400 mt-1 leading-relaxed line-clamp-2">{summary}</p>
        </div>
      </div>

      {/* Torn-off fee stub */}
      <div className="w-[84px] shrink-0 flex flex-col items-center justify-center gap-1.5 py-5 px-2 text-center">
        <span className="stub-fee text-[11px] text-ink-400 uppercase tracking-wider">Fee</span>
        <span className="stub-fee font-semibold text-ink-800 text-sm leading-tight">{fee > 0 ? formatINR(fee).replace("₹", "₹") : "Free"}</span>
        <ArrowRight size={14} className="text-signal-500 mt-1 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </Link>
  );
}
