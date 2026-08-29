import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ApplyWizard } from "@/components/ApplyWizard";

// Reads from the database at request time; never prerender at build.
export const dynamic = "force-dynamic";

export default async function ApplyPage({ params }: { params: { slug: string } }) {
  const service = await prisma.service.findUnique({ where: { slug: params.slug } });
  if (!service) notFound();

  return <ApplyWizard service={{ id: service.id, slug: service.slug, name: service.name, fee: service.fee, documents: service.documents }} />;
}
