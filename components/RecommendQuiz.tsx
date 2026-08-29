"use client";

import { useState } from "react";
import Link from "next/link";
import { Wand2, Loader2, ArrowRight, RotateCcw } from "lucide-react";

const OPTIONS = [
  "I need a licence to drive for the first time",
  "My licence or registration has expired",
  "I lost my licence or registration papers",
  "I just bought or sold a vehicle",
  "I need to register a brand-new vehicle",
  "I have an unpaid traffic fine",
  "I want to run a commercial/goods vehicle"
];

type Result = { slug: string; name: string; reason: string } | null;

export function RecommendQuiz() {
  const [selected, setSelected] = useState<string | null>(null);
  const [custom, setCustom] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const [error, setError] = useState("");

  async function getRecommendation(text: string) {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/ai/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ need: text })
      });
      const data = await res.json();
      if (data.slug) {
        setResult(data);
      } else {
        setError("Couldn't find a close match — try browsing all services instead.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card p-6 sm:p-8 bg-gradient-to-br from-violet-500 via-ink-700 to-sky-600 text-white relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-signal-400 rounded-full blur-3xl opacity-20 pointer-events-none" />
      <div className="flex items-center gap-2 mb-1">
        <Wand2 size={20} />
        <h2 className="font-bold text-lg">Not sure which service you need?</h2>
      </div>
      <p className="text-white/80 text-sm mb-5">Tell us what's going on, and we'll point you to the right service — no government jargon required.</p>

      {!result && (
        <>
          <div className="flex flex-wrap gap-2 mb-4">
            {OPTIONS.map((o) => (
              <button
                key={o}
                onClick={() => {
                  setSelected(o);
                  getRecommendation(o);
                }}
                disabled={loading}
                className={`text-xs sm:text-sm rounded-xl px-3.5 py-2 font-medium transition-colors ${
                  selected === o ? "bg-white text-violet-600" : "bg-white/15 hover:bg-white/25 text-white"
                }`}
              >
                {o}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (custom.trim()) getRecommendation(custom);
            }}
            className="flex gap-2"
          >
            <input
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="Or describe it in your own words..."
              className="flex-1 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none"
            />
            <button type="submit" disabled={loading || !custom.trim()} className="bg-signal-400 hover:bg-signal-500 text-ink-800 rounded-xl px-4 py-2.5 font-display font-semibold uppercase tracking-wide text-sm disabled:opacity-50">
              Ask
            </button>
          </form>
        </>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-sm text-white/90 mt-2">
          <Loader2 size={16} className="animate-spin" /> Finding the right service...
        </div>
      )}

      {error && <p className="text-sm text-white/90 mt-2">{error}</p>}

      {result && (
        <div className="bg-white rounded-xl p-5 text-slate-800 mt-2">
          <p className="text-xs font-semibold text-violet-600 uppercase tracking-wide mb-1">Recommended for you</p>
          <h3 className="font-bold text-lg">{result.name}</h3>
          <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{result.reason}</p>
          <div className="flex items-center gap-3 mt-4">
            <Link href={`/services/${result.slug}`} className="btn-primary !py-2.5 text-sm">
              View Service <ArrowRight size={16} />
            </Link>
            <button
              onClick={() => {
                setResult(null);
                setSelected(null);
                setCustom("");
              }}
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-500"
            >
              <RotateCcw size={15} /> Try again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
