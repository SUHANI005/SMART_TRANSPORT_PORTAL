import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatINR } from "@/lib/utils";
import { Users, FileStack, IndianRupee, CheckCircle2, Layers } from "lucide-react";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const role = (session.user as any).role;
  if (role !== "ADMIN") redirect("/dashboard/citizen");

  const [userCount, applicationCount, services, payments, byStatus] = await Promise.all([
    prisma.user.count(),
    prisma.application.count(),
    prisma.service.findMany(),
    prisma.payment.findMany({ where: { status: "PAID" } }),
    prisma.application.groupBy({ by: ["status"], _count: true })
  ]);

  const revenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const statusMap = Object.fromEntries(byStatus.map((s) => [s.status, s._count]));

  const applicationsByService = await prisma.application.groupBy({
    by: ["serviceId"],
    _count: true
  });
  const serviceMap = Object.fromEntries(services.map((s) => [s.id, s.name]));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-extrabold text-ink-800 mb-1">Admin Dashboard</h1>
      <p className="text-slate-500 text-sm mb-6">Platform overview and basic analytics.</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="card p-4">
          <Users size={18} className="text-brand-600 mb-1" />
          <p className="text-xs text-slate-400">Users</p>
          <p className="text-2xl font-extrabold text-ink-800">{userCount}</p>
        </div>
        <div className="card p-4">
          <FileStack size={18} className="text-brand-600 mb-1" />
          <p className="text-xs text-slate-400">Applications</p>
          <p className="text-2xl font-extrabold text-ink-800">{applicationCount}</p>
        </div>
        <div className="card p-4">
          <IndianRupee size={18} className="text-brand-600 mb-1" />
          <p className="text-xs text-slate-400">Revenue Collected</p>
          <p className="text-2xl font-extrabold text-ink-800">{formatINR(revenue)}</p>
        </div>
        <div className="card p-4">
          <CheckCircle2 size={18} className="text-success-600 mb-1" />
          <p className="text-xs text-slate-400">Approved</p>
          <p className="text-2xl font-extrabold text-success-600">{statusMap.APPROVED ?? 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="card p-5">
          <h2 className="font-bold text-ink-800 mb-4 flex items-center gap-2">
            <Layers size={18} className="text-brand-600" /> Applications by Status
          </h2>
          <div className="space-y-2">
            {["DRAFT", "SUBMITTED", "DOCS_PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED"].map((s) => {
              const count = statusMap[s] ?? 0;
              const pct = applicationCount ? Math.round((count / applicationCount) * 100) : 0;
              return (
                <div key={s}>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>{s.replace("_", " ")}</span>
                    <span>{count}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-bold text-ink-800 mb-4">Services ({services.length})</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {applicationsByService
              .sort((a, b) => b._count - a._count)
              .map((row) => (
                <div key={row.serviceId} className="flex justify-between text-sm">
                  <span className="text-slate-600">{serviceMap[row.serviceId]}</span>
                  <span className="font-semibold text-slate-800">{row._count}</span>
                </div>
              ))}
            {applicationsByService.length === 0 && <p className="text-sm text-slate-400">No applications yet.</p>}
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-8">
        This demo admin panel covers reporting only. Managing services, fees, users, and content (as listed in the project brief) can be added as an extension of this page using the same Service/User models.
      </p>
    </div>
  );
}
