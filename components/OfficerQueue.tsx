"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { StatusBadge } from "@/components/StatusBadge";
import { CheckCircle2, XCircle, FileWarning, ChevronDown, ChevronUp, ShieldAlert } from "lucide-react";

type AppRow = {
  id: string;
  referenceNo: string;
  status: string;
  fullName: string | null;
  createdAt: string;
  service: { name: string };
  user: { name: string; email: string };
  documents: { label: string; fileName: string; aiCheck: string | null }[];
};

export function OfficerQueue({ applications }: { applications: AppRow[] }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [remark, setRemark] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  async function act(id: string, status: string, officerRemark?: string) {
    setBusy(id);
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, officerRemark })
      });
      if (!res.ok) {
        const d = await res.json();
        toast.error(d.error ?? "Action failed.");
        return;
      }
      toast.success(`Application ${status.toLowerCase().replace("_", " ")}.`);
      setRemark("");
      setExpanded(null);
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  if (applications.length === 0) {
    return <div className="card p-8 text-center text-slate-500">No applications waiting for review right now.</div>;
  }

  return (
    <div className="space-y-3">
      {applications.map((a) => {
        const isOpen = expanded === a.id;
        return (
          <div key={a.id} className="card p-4">
            <button className="w-full flex items-center justify-between text-left" onClick={() => setExpanded(isOpen ? null : a.id)}>
              <div>
                <p className="font-semibold text-slate-800">{a.service.name}</p>
                <p className="text-xs text-slate-400">
                  {a.fullName ?? a.user.name} · <span className="font-mono">{a.referenceNo}</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={a.status} />
                {isOpen ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
              </div>
            </button>

            {isOpen && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-2">Documents</p>
                  {a.documents.length === 0 ? (
                    <p className="text-sm text-slate-400">No documents uploaded yet.</p>
                  ) : (
                    <ul className="space-y-1.5">
                      {a.documents.map((d, i) => {
                        const ai = d.aiCheck ? JSON.parse(d.aiCheck) : null;
                        return (
                          <li key={i} className="text-sm flex items-start gap-2">
                            {ai && !ai.ok ? <FileWarning size={14} className="text-amber-500 mt-0.5 shrink-0" /> : <CheckCircle2 size={14} className="text-success-500 mt-0.5 shrink-0" />}
                            <span>
                              <strong>{d.label}</strong> — {d.fileName}
                              {ai?.issues?.length > 0 && <span className="text-amber-600"> ({ai.issues.join("; ")})</span>}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                <div>
                  <label className="label">Remark (required to reject or request documents)</label>
                  <textarea className="input" rows={2} value={remark} onChange={(e) => setRemark(e.target.value)} placeholder="Explain why, or what's missing..." />
                </div>

                <div className="flex flex-wrap gap-2">
                  <button disabled={busy === a.id} onClick={() => act(a.id, "APPROVED", remark)} className="btn-success !py-2 text-sm">
                    <CheckCircle2 size={16} /> Approve
                  </button>
                  <button
                    disabled={busy === a.id || !remark.trim()}
                    onClick={() => act(a.id, "REJECTED", remark)}
                    className="!py-2 text-sm rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold px-5 inline-flex items-center gap-2 disabled:opacity-50"
                  >
                    <XCircle size={16} /> Reject
                  </button>
                  <button
                    disabled={busy === a.id || !remark.trim()}
                    onClick={() => act(a.id, "DOCS_PENDING", remark)}
                    className="!py-2 text-sm rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 inline-flex items-center gap-2 disabled:opacity-50"
                  >
                    <ShieldAlert size={16} /> Request Documents
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
