"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ProgressSteps } from "@/components/ProgressSteps";
import { formatINR } from "@/lib/utils";
import {
  Upload,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  IndianRupee,
  CalendarCheck,
  PartyPopper,
  Download,
  ShieldCheck
} from "lucide-react";

type Service = {
  id: string;
  slug: string;
  name: string;
  fee: number;
  documents: string; // JSON string array
};

const STEP_LABELS = ["Personal Details", "Documents", "Payment", "Appointment", "Complete"];
const OFFICES = ["RTO Central Zone", "RTO North Zone", "RTO South Zone", "RTO East Zone"];
const TIME_SLOTS = ["10:00 AM", "11:30 AM", "1:00 PM", "3:00 PM", "4:30 PM"];

type DocState = { file?: File; dataUrl?: string; uploading?: boolean; checked?: boolean; ok?: boolean; issues?: string[]; summary?: string };

export function ApplyWizard({ service }: { service: Service }) {
  const { data: session, status } = useSession();
  const [step, setStep] = useState(1);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [referenceNo, setReferenceNo] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const documentLabels: string[] = JSON.parse(service.documents);
  const [docs, setDocs] = useState<Record<string, DocState>>(() => Object.fromEntries(documentLabels.map((l) => [l, {}])));

  const [form, setForm] = useState({ fullName: "", dob: "", address: "", vehicleOrLicenceNo: "" });
  const [office, setOffice] = useState(OFFICES[0]);
  const [slotDate, setSlotDate] = useState("");
  const [slotTime, setSlotTime] = useState(TIME_SLOTS[0]);

  if (status === "loading") {
    return <p className="text-center text-slate-400 py-16">Loading...</p>;
  }

  if (!session) {
    return (
      <div className="card p-8 text-center max-w-md mx-auto">
        <h2 className="font-bold text-lg text-ink-800 mb-2">Please log in to apply</h2>
        <p className="text-slate-500 text-sm mb-5">You need an account to submit and track applications.</p>
        <Link href={`/login`} className="btn-primary">
          Log In
        </Link>
      </div>
    );
  }

  async function submitPersonalDetails(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceSlug: service.slug, ...form })
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Something went wrong.");
        return;
      }
      setApplicationId(data.application.id);
      setReferenceNo(data.application.referenceNo);
      toast.success("Details saved.");
      setStep(2);
    } finally {
      setSaving(false);
    }
  }

  function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleDocSelect(label: string, file: File) {
    const dataUrl = await fileToDataUrl(file);
    setDocs((d) => ({ ...d, [label]: { file, dataUrl, uploading: true } }));

    // AI document check
    const checkRes = await fetch("/api/ai/document-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dataUrl, label })
    });
    const check = await checkRes.json();

    // Save document + AI result
    await fetch(`/api/applications/${applicationId}/documents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label, fileName: file.name, dataUrl, aiCheck: check })
    });

    setDocs((d) => ({ ...d, [label]: { file, dataUrl, uploading: false, checked: true, ok: check.ok, issues: check.issues, summary: check.summary } }));
  }

  const allUploaded = documentLabels.every((l) => docs[l]?.checked);

  async function payNow() {
    setSaving(true);
    try {
      await fetch(`/api/applications/${applicationId}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method: "Mock UPI" })
      });
      toast.success("Payment successful!");
      setStep(4);
    } finally {
      setSaving(false);
    }
  }

  async function bookAppointment(skip = false) {
    if (!skip) {
      if (!slotDate) {
        toast.error("Please choose a date.");
        return;
      }
      setSaving(true);
      try {
        await fetch(`/api/applications/${applicationId}/appointment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ officeName: office, slotDate, slotTime })
        });
        toast.success("Appointment booked!");
      } finally {
        setSaving(false);
      }
    }
    setStep(5);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-extrabold text-ink-800 mb-1">{service.name}</h1>
      {referenceNo && <p className="text-sm text-slate-500 mb-4">Reference: <span className="font-mono font-semibold text-brand-700">{referenceNo}</span></p>}
      {!referenceNo && <div className="mb-4" />}

      <ProgressSteps steps={STEP_LABELS} current={step} />

      {step === 1 && (
        <form onSubmit={submitPersonalDetails} className="card p-6 space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input className="input" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          </div>
          <div>
            <label className="label">Date of Birth</label>
            <input type="date" className="input" required value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} />
          </div>
          <div>
            <label className="label">Address</label>
            <textarea className="input" required rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <div>
            <label className="label">Existing Vehicle / Licence Number (if any)</label>
            <input className="input" value={form.vehicleOrLicenceNo} onChange={(e) => setForm({ ...form, vehicleOrLicenceNo: e.target.value })} placeholder="Optional" />
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving ? "Saving..." : "Save & Continue"}
          </button>
        </form>
      )}

      {step === 2 && applicationId && (
        <div className="card p-6 space-y-5">
          <p className="text-sm text-slate-500 -mt-1">Upload each document. Our AI checks it right away and flags anything you should fix before submitting.</p>
          {documentLabels.map((label) => {
            const d = docs[label];
            return (
              <div key={label} className="border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-slate-800 text-sm">{label}</p>
                  {d?.checked && (
                    <span className={`badge ${d.ok ? "bg-success-500/10 text-success-600" : "bg-amber-100 text-amber-700"}`}>
                      {d.ok ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}
                      {d.ok ? "Looks good" : "Needs review"}
                    </span>
                  )}
                </div>
                {!d?.file ? (
                  <label className="flex items-center gap-2 justify-center border-2 border-dashed border-slate-200 rounded-lg py-4 cursor-pointer text-slate-400 hover:border-brand-300 hover:text-brand-500 text-sm">
                    <Upload size={16} /> Click to upload (image or PDF)
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleDocSelect(label, e.target.files[0])}
                    />
                  </label>
                ) : d.uploading ? (
                  <p className="flex items-center gap-2 text-sm text-slate-500">
                    <Loader2 size={14} className="animate-spin" /> Checking document with AI...
                  </p>
                ) : (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{d.file.name}</p>
                    {d.summary && <p className="text-xs text-slate-600">{d.summary}</p>}
                    {d.issues && d.issues.length > 0 && (
                      <ul className="mt-1.5 space-y-1">
                        {d.issues.map((iss) => (
                          <li key={iss} className="text-xs text-amber-700 flex gap-1.5">
                            <AlertTriangle size={12} className="mt-0.5 shrink-0" /> {iss}
                          </li>
                        ))}
                      </ul>
                    )}
                    <label className="text-xs text-brand-600 font-semibold cursor-pointer mt-2 inline-block">
                      Replace file
                      <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => e.target.files?.[0] && handleDocSelect(label, e.target.files[0])} />
                    </label>
                  </div>
                )}
              </div>
            );
          })}
          <button disabled={!allUploaded} onClick={() => setStep(3)} className="btn-primary w-full">
            Continue to Payment
          </button>
        </div>
      )}

      {step === 3 && applicationId && (
        <div className="card p-6 text-center space-y-4">
          <IndianRupee size={32} className="mx-auto text-brand-600" />
          <p className="text-slate-500 text-sm">Application fee for {service.name}</p>
          <p className="text-3xl font-extrabold text-ink-800">{service.fee > 0 ? formatINR(service.fee) : "Free"}</p>
          <p className="text-xs text-slate-400">This is a mock payment for demo purposes — no real money is charged.</p>
          <button onClick={payNow} disabled={saving} className="btn-success w-full">
            {saving ? "Processing..." : `Pay ${service.fee > 0 ? formatINR(service.fee) : "Now"} (Mock)`}
          </button>
        </div>
      )}

      {step === 4 && applicationId && (
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-2 text-slate-800 font-semibold">
            <CalendarCheck size={18} className="text-brand-600" /> Book an appointment (optional)
          </div>
          <div>
            <label className="label">Transport Office</label>
            <select className="input" value={office} onChange={(e) => setOffice(e.target.value)}>
              {OFFICES.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Date</label>
            <input type="date" className="input" value={slotDate} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setSlotDate(e.target.value)} />
          </div>
          <div>
            <label className="label">Time Slot</label>
            <div className="flex flex-wrap gap-2">
              {TIME_SLOTS.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setSlotTime(t)}
                  className={`text-sm rounded-lg px-3 py-2 border ${slotTime === t ? "bg-brand-600 text-white border-brand-600" : "border-slate-200 text-slate-600"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => bookAppointment(false)} disabled={saving} className="btn-primary flex-1">
              Book Appointment
            </button>
            <button onClick={() => bookAppointment(true)} className="btn-outline flex-1">
              Skip
            </button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="card p-8 text-center space-y-3">
          <PartyPopper size={40} className="mx-auto text-accent-500" />
          <h2 className="text-xl font-bold text-ink-800">Application Submitted!</h2>
          <p className="text-slate-500 text-sm">
            Your reference number is <span className="font-mono font-bold text-brand-700">{referenceNo}</span>. Save it to track your application status.
          </p>
          <div className="flex items-center justify-center gap-1.5 text-success-600 text-sm font-medium">
            <ShieldCheck size={16} /> Documents received and under review
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-3">
            <Link href="/track" className="btn-primary">
              Track This Application
            </Link>
            <button onClick={() => window.print()} className="btn-outline">
              <Download size={16} /> Save Summary
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
