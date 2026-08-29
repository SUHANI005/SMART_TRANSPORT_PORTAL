import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import { formatINR } from "@/lib/utils";
import { FileText, MapPin, ArrowRight, PlusCircle } from "lucide-react";

export default async function CitizenDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const applications = await prisma.application.findMany({
    where: { userId: (session.user as any).id },
    include: { service: true, payment: true, appointment: true, documents: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-ink-800">My Dashboard</h1>
          <p className="text-slate-500 text-sm">Welcome back, {session.user?.name}</p>
        </div>
        <Link href="/services" className="btn-primary">
          <PlusCircle size={18} /> New Application
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card p-4">
          <p className="text-xs text-slate-400">Total Applications</p>
          <p className="text-2xl font-extrabold text-ink-800">{applications.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-400">Approved</p>
          <p className="text-2xl font-extrabold text-success-600">{applications.filter((a) => a.status === "APPROVED").length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-400">Under Review</p>
          <p className="text-2xl font-extrabold text-brand-600">{applications.filter((a) => a.status === "UNDER_REVIEW" || a.status === "SUBMITTED").length}</p>
        </div>
      </div>

      <h2 className="font-bold text-lg text-ink-800 mb-4">My Applications</h2>
      {applications.length === 0 ? (
        <div className="card p-8 text-center text-slate-500">
          <FileText className="mx-auto mb-2 text-slate-300" size={32} />
          You haven't applied for any services yet.
          <div className="mt-4">
            <Link href="/services" className="btn-primary">
              Browse Services <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((a) => (
            <div key={a.id} className="card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-800">{a.service.name}</p>
                <p className="text-xs text-slate-400 font-mono">{a.referenceNo}</p>
                {a.appointment && (
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin size={12} /> {a.appointment.officeName} — {a.appointment.slotDate} at {a.appointment.slotTime}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                {a.payment && <span className="text-xs text-slate-500">{formatINR(a.payment.amount)} · {a.payment.status}</span>}
                <StatusBadge status={a.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
