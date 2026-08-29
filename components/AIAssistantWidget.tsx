"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles, Loader2 } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

const STARTER_PROMPTS = [
  "I lost my driving licence, what do I do?",
  "How do I transfer vehicle ownership?",
  "What documents do I need to register a new vehicle?"
];

export function AIAssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! I'm your Transport Assistant. Ask me which service you need, what documents to bring, or how much something costs — in plain English or Hindi." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    const next = [...messages, { role: "user", content } as Msg];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next })
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply ?? "Sorry, I couldn't respond right now." }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "I'm having trouble connecting right now. Please try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open Transport Assistant"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-signal-400 text-ink-800 shadow-lg shadow-ink-700/30 px-5 py-3.5 hover:bg-signal-500 transition-all hover:scale-105"
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
        <span className="font-semibold text-sm hidden sm:inline">{open ? "Close" : "Ask Assistant"}</span>
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-[92vw] max-w-sm h-[70vh] max-h-[560px] bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-[fadeIn_0.15s_ease-out]">
          <div className="bg-gradient-to-r from-violet-500 via-ink-700 to-sky-600 text-white px-4 py-3.5 flex items-center gap-2">
            <div className="bg-white/20 rounded-full p-1.5">
              <Sparkles size={16} />
            </div>
            <div>
              <p className="font-semibold text-sm leading-tight">AI Transport Assistant</p>
              <p className="text-[11px] text-white/80 leading-tight">Simple answers, no jargon</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user" ? "bg-brand-600 text-white rounded-br-sm" : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-3.5 py-2.5 flex items-center gap-1.5">
                  <Loader2 size={14} className="animate-spin text-brand-500" />
                  <span className="text-xs text-slate-500">Thinking...</span>
                </div>
              </div>
            )}
            {messages.length === 1 && (
              <div className="flex flex-col gap-1.5 pt-1">
                {STARTER_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => send(p)}
                    className="text-left text-xs bg-white border border-brand-200 text-brand-700 rounded-xl px-3 py-2 hover:bg-brand-50 transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="border-t border-slate-100 p-3 flex items-center gap-2 bg-white"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
            <button type="submit" disabled={loading || !input.trim()} className="rounded-xl bg-brand-600 text-white p-2.5 hover:bg-brand-700 disabled:opacity-40 transition-colors">
              <Send size={17} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
