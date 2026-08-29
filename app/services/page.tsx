import { prisma } from "@/lib/prisma";
import { ServiceCard } from "@/components/ServiceCard";
import { SearchBar } from "@/components/SearchBar";

// Reads from the database at request time; never prerender at build.
export const dynamic = "force-dynamic";

export default async function ServicesPage({ searchParams }: { searchParams: { q?: string; category?: string } }) {
  const q = searchParams.q?.trim();
  const category = searchParams.category;

  const services = await prisma.service.findMany({
    where: {
      AND: [
        category ? { category } : {},
        q
          ? {
              OR: [
                { name: { contains: q } },
                { summary: { contains: q } },
                { category: { contains: q } }
              ]
            }
          : {}
      ]
    },
    orderBy: { category: "asc" }
  });

  const allServices = await prisma.service.findMany();
  const categories: string[] = Array.from(new Set(allServices.map((s) => s.category)));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-800 mb-2">All Services</h1>
      <p className="text-ink-400 mb-6">Browse every service, or search by what you need to do.</p>

      <SearchBar />

      <div className="flex flex-wrap gap-2 mt-6 mb-8">
        <a href="/services" className={`badge ${!category ? "bg-ink-700 text-white" : "bg-ink-50 text-ink-500"}`}>
          All
        </a>
        {categories.map((c) => (
          <a key={c} href={`/services?category=${encodeURIComponent(c)}`} className={`badge ${category === c ? "bg-ink-700 text-white" : "bg-ink-50 text-ink-500"}`}>
            {c}
          </a>
        ))}
      </div>

      {services.length === 0 ? (
        <p className="text-ink-400">No services matched your search. Try the AI Assistant (bottom-right) for help finding the right one.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s) => (
            <ServiceCard key={s.id} slug={s.slug} name={s.name} summary={s.summary} category={s.category} fee={s.fee} icon={s.icon} />
          ))}
        </div>
      )}
    </div>
  );
}
