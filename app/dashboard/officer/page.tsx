import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { OfficerQueue } from "@/components/OfficerQueue";

export default async function OfficerDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const role = (session.user as any).role;
  if (role !== "OFFICER" && role !== "ADMIN") redirect("/dashboard/citizen");

  const applications = await prisma.application.findMany({
    where: { status: { in: ["SUBMITTED", "DOCS_PENDING", "UNDER_REVIEW"] } },
    include: { service: true, user: true, documents: true },
    orderBy: { createdAt: "asc" }
  });

  const decided = await prisma.application.count({ where: { status: { in: ["APPROVED", "REJECTED"] } } });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-extrabold text-ink-800 mb-1">Officer Dashboard</h1>
      <p className="text-slate-500 text-sm mb-6">Review applications, check documents, and approve or reject requests.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card p-4">
          <p className="text-xs text-slate-400">Pending Review</p>
          <p className="text-2xl font-extrabold text-brand-600">{applications.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-400">Decided (All Time)</p>
          <p className="text-2xl font-extrabold text-ink-800">{decided}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-400">Reviewing As</p>
          <p className="text-lg font-bold text-ink-800">{session.user?.name}</p>
        </div>
      </div>

      <h2 className="font-bold text-lg text-ink-800 mb-4">Applications Queue</h2>
      <OfficerQueue
        applications={applications.map((a) => ({
          id: a.id,
          referenceNo: a.referenceNo,
          status: a.status,
          fullName: a.fullName,
          createdAt: a.createdAt.toISOString(),
          service: { name: a.service.name },
          user: { name: a.user.name, email: a.user.email },
          documents: a.documents.map((d) => ({ label: d.label, fileName: d.fileName, aiCheck: d.aiCheck }))
        }))}
      />
    </div>
  );
}
