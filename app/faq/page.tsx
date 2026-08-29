const FAQS = [
  { q: "Is this a government website?", a: "No. This is a demo project inspired by government transport portals, using original branding and sample data. It's built to demonstrate a simpler, friendlier user experience." },
  { q: "Are the payments real?", a: "No — all payments in this portal are mock payments for demonstration purposes only. No real money is charged." },
  { q: "How do I check my application status?", a: "Use the Track Application page and enter the reference number you received after submitting your application." },
  { q: "What if my documents are rejected?", a: "The AI Document Checker flags likely issues before you submit. If an officer requests more documents after review, you'll see a note when you track your application." },
  { q: "Can I use this portal in Hindi?", a: "Yes — use the language toggle in the top navigation bar to switch between English and Hindi." },
  { q: "Who can I contact for help?", a: "Use the Contact page, or ask the AI Transport Assistant (bottom-right chat bubble) for instant guidance." }
];

export default function FaqPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-800 mb-2 text-center">Frequently Asked Questions</h1>
      <p className="text-ink-400 text-center mb-10">Can't find an answer? Ask our AI Assistant in the corner of the screen.</p>
      <div className="space-y-3">
        {FAQS.map((f) => (
          <details key={f.q} className="card p-5 group">
            <summary className="font-semibold text-ink-700 cursor-pointer list-none flex items-center justify-between">
              {f.q}
              <span className="text-signal-500 group-open:rotate-45 transition-transform text-xl leading-none">+</span>
            </summary>
            <p className="text-ink-400 text-sm mt-3 leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
