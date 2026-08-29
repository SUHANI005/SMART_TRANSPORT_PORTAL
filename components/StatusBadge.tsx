const STYLES: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-600",
  SUBMITTED: "bg-blue-100 text-blue-700",
  DOCS_PENDING: "bg-amber-100 text-amber-700",
  UNDER_REVIEW: "bg-brand-100 text-brand-700",
  APPROVED: "bg-success-500/10 text-success-600",
  REJECTED: "bg-red-100 text-red-600"
};

const LABELS: Record<string, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  DOCS_PENDING: "Documents Pending",
  UNDER_REVIEW: "Under Review",
  APPROVED: "Approved",
  REJECTED: "Rejected"
};

export function StatusBadge({ status }: { status: string }) {
  return <span className={`badge ${STYLES[status] ?? "bg-slate-100 text-slate-600"}`}>{LABELS[status] ?? status}</span>;
}
