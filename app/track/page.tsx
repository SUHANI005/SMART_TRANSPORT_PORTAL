"use client";

import { useState } from "react";
import { Search, Loader2, MapPin, IndianRupee, CalendarClock } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { formatINR } from "@/lib/utils";

export default function TrackPage() {
  const [ref, setRef] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  async function search(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`/api/track?ref=${encodeURIComponent(ref.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      setResult(data.application);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-14">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-800 text-center mb-2">Track Your Application</h1>
      <p className="text-slate-500 text-center mb-8">Enter the reference number you received after applying.</p>

      <form onSubmit={search} className="flex gap-2">
        <input value={ref} onChange={(e) => setRef(e.target.value)} placeholder="e.g. STP-482913-A7B2C1" className="input flex-1 font-mono" required />
        <button type="submit" disabled={loading} className="btn-primary shrink-0">
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
          Track
        </button>
      </form>

      {error && <p className="text-center text-red-600 text-sm mt-6">{error}</p>}

      {result && (
        <div className="card p-6 mt-8">
          <div className="flex items-center justify-between mb-1">
            <p className="font-mono text-sm text-slate-500">{result.referenceNo}</p>
            <StatusBadge status={result.status} />
          </div>
          <h2 className="font-bold text-lg text-ink-800 mb-4">{result.serviceName}</h2>

          {result.payment && (
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
              <IndianRupee size={15} className="text-brand-600" />
              Payment: <span className="font-semibold">{result.payment.status}</span> ({formatINR(result.payment.amount)})
            </div>
          )}
          {result.appointment && (
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
              <MapPin size={15} className="text-brand-600" />
              {result.appointment.officeName} — {result.appointment.slotDate} at {result.appointment.slotTime}
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <CalendarClock size={15} className="text-brand-600" />
            Last updated: {new Date(result.updatedAt).toLocaleString("en-IN")}
          </div>

          {result.officerRemark && (
            <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-3 text-sm text-amber-800">
              <strong>Officer note:</strong> {result.officerRemark}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
