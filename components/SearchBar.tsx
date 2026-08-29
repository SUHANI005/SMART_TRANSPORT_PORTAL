"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Mic, MicOff } from "lucide-react";
import { useLang } from "@/lib/lang-context";
import toast from "react-hot-toast";

export function SearchBar() {
  const router = useRouter();
  const { t } = useLang();
  const [query, setQuery] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  function submit(q?: string) {
    const value = (q ?? query).trim();
    if (!value) return;
    router.push(`/services?q=${encodeURIComponent(value)}`);
  }

  function startVoiceSearch() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Voice search isn't supported in this browser. Try Chrome, or type your search instead.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => {
      setListening(false);
      toast.error("Couldn't hear that. Please try again.");
    };
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      submit(transcript);
    };

    recognition.start();
  }

  function stopVoiceSearch() {
    recognitionRef.current?.stop();
    setListening(false);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="flex items-center gap-2 bg-white rounded-2xl shadow-lg shadow-brand-900/5 border border-slate-100 p-2 pl-4">
        <Search size={20} className="text-slate-400 shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="flex-1 outline-none text-slate-800 placeholder:text-slate-400 py-2.5 bg-transparent min-w-0"
        />
        <button
          type="button"
          onClick={listening ? stopVoiceSearch : startVoiceSearch}
          title="Search by voice"
          className={`shrink-0 rounded-xl p-2.5 transition-colors ${listening ? "bg-red-500 text-white animate-pulse" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
        >
          {listening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>
        <button type="submit" className="btn-primary !py-2.5 shrink-0">
          Search
        </button>
      </div>
      {listening && <p className="text-center text-xs text-brand-600 font-medium mt-2">Listening... speak now</p>}
    </form>
  );
}
