import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getIcon } from "@/lib/icon-map";
import { getCategoryPalette } from "@/lib/category-colors";
import { formatINR } from "@/lib/utils";
import { CheckCircle2, FileText, Clock, IndianRupee, ArrowRight } from "lucide-react";

// Reads from the database at request time; never prerender at build.
export const dynamic = "force-dynamic";

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = await prisma.service.findUnique({ where: { slug: params.slug } });
  if (!service) notFound();

  const Icon = getIcon(service.icon);
  const palette = getCategoryPalette(service.category);
  const documents: string[] = JSON.parse(service.documents);
  const steps: string[] = JSON.parse(service.steps);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className={`flex items-start gap-4 mb-2 rounded-2xl p-5 bg-gradient-to-br ${palette.gradientFrom} ${palette.gradientTo}`}>
        <span className="bg-white/90 text-ink-800 rounded-2xl p-3.5 shrink-0">
          <Icon size={28} />
        </span>
        <div>
          <span className="badge bg-white/25 text-white mb-1 uppercase tracking-wide text-[10px]">{service.category}</span>
          <h1 className="text-2xl sm:text-3xl font-display font-semibold text-white uppercase tracking-wide">{service.name}</h1>
          <p className="text-white/90 mt-1">{service.summary}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-8">
        <div className="card p-4 flex items-center gap-3">
          <IndianRupee size={18} className="text-signal-500" />
          <div>
            <p className="text-xs text-ink-400">Fee</p>
            <p className="font-bold text-ink-800">{service.fee > 0 ? formatINR(service.fee) : "Free"}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <Clock size={18} className="text-sky-500" />
          <div>
            <p className="text-xs text-ink-400">Estimated Time</p>
            <p className="font-bold text-ink-800">{service.estTime}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <FileText size={18} className="text-violet-500" />
          <div>
            <p className="text-xs text-ink-400">Documents Needed</p>
            <p className="font-bold text-ink-800">{documents.length} items</p>
          </div>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="font-bold text-lg text-ink-800 mb-2">What this service is for</h2>
        <p className="text-ink-500 leading-relaxed">{service.purpose}</p>
      </section>

      <section className="mb-8">
        <h2 className="font-bold text-lg text-ink-800 mb-2">Who can apply</h2>
        <p className="text-ink-500 leading-relaxed">{service.whoCanApply}</p>
      </section>

      <section className="mb-8">
        <h2 className="font-bold text-lg text-ink-800 mb-3">Required documents</h2>
        <ul className="space-y-2">
          {documents.map((d) => (
            <li key={d} className="flex items-center gap-2 text-ink-600">
              <CheckCircle2 size={17} className="text-success-500 shrink-0" /> {d}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="font-bold text-lg text-ink-800 mb-3">Steps to apply</h2>
        <ol className="space-y-2">
          {steps.map((s, i) => (
            <li key={s} className="flex items-start gap-3 text-ink-600">
              <span className="bg-signal-100 text-ink-800 font-bold text-xs rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>
      </section>

      <Link href={`/apply/${service.slug}`} className="btn-accent">
        Apply Now <ArrowRight size={18} />
      </Link>
    </div>
  );
}
