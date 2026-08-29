import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ServiceCard } from "@/components/ServiceCard";
import { SearchBar } from "@/components/SearchBar";
import { RecommendQuiz } from "@/components/RecommendQuiz";
import { HeroIllustration } from "@/components/HeroIllustration";
import { IdCard, Car, Search, Receipt, ClipboardCheck, CalendarCheck, HelpCircle, MapPin, Bell } from "lucide-react";

// This page reads from the database at request time, so it must not be
// statically prerendered at build time (no DATABASE_URL during build).
export const dynamic = "force-dynamic";

const QUICK_ACTIONS = [
  { label: "Apply for Driving Licence", href: "/services/apply-driving-licence", icon: IdCard, color: "bg-signal-100 text-ink-800" },
  { label: "Vehicle Services", href: "/services?category=Vehicle%20Services", icon: Car, color: "bg-sky-100 text-sky-600" },
  { label: "Track Application", href: "/track", icon: Search, color: "bg-violet-100 text-violet-600" },
  { label: "Pay Challan", href: "/services/pay-traffic-challan", icon: Receipt, color: "bg-coral-100 text-coral-600" },
  { label: "Vehicle Permit", href: "/services/vehicle-permit", icon: ClipboardCheck, color: "bg-violet-100 text-violet-600" },
  { label: "Book Appointment", href: "/track", icon: CalendarCheck, color: "bg-route-100 text-route-600" },
  { label: "FAQs", href: "/faq", icon: HelpCircle, color: "bg-sky-100 text-sky-600" },
  { label: "Get Help", href: "/contact", icon: MapPin, color: "bg-signal-100 text-ink-800" }
];

const HOW_IT_WORKS = [
  { step: "1", title: "Choose a Service", desc: "Search or browse to find exactly what you need — explained in plain language.", color: "text-signal-600" },
  { step: "2", title: "Fill & Upload", desc: "Complete a simple form and upload your documents. Our AI checks them for issues.", color: "text-sky-500" },
  { step: "3", title: "Pay & Track", desc: "Pay the fee, book an appointment if needed, and track your application anytime.", color: "text-route-500" }
];

const NOTICE_COLORS = ["text-signal-500", "text-sky-500", "text-violet-500"];

export default async function HomePage() {
  const [services, notices] = await Promise.all([
    prisma.service.findMany({ take: 6, orderBy: { createdAt: "asc" } }),
    prisma.notice.findMany({ take: 3, orderBy: { createdAt: "desc" } })
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="border-b-2 border-ink-700 bg-white relative overflow-hidden">
        {/* Decorative color blobs */}
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-signal-300 rounded-full blur-3xl opacity-30 pointer-events-none" />
        <div className="absolute top-10 -right-20 w-72 h-72 bg-sky-300 rounded-full blur-3xl opacity-30 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-56 h-56 bg-violet-300 rounded-full blur-3xl opacity-20 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-12 relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="text-center lg:text-left">
            <span className="badge bg-signal-100 text-ink-700 mb-4 font-display uppercase tracking-wider text-[11px]">Simple. Guided. English &amp; Hindi.</span>
            <h1 className="text-3xl sm:text-5xl font-display font-semibold text-ink-800 leading-tight uppercase tracking-wide">
              Your route to <span className="text-signal-600">transport services</span>, made simple
            </h1>
            <p className="text-ink-400 mt-4 max-w-xl mx-auto lg:mx-0">Driving licences, vehicle registration, permits, and challan payments — guided step by step, with an AI assistant to help along the way.</p>

            {/* Route line motif */}
            <div className="max-w-lg mx-auto lg:mx-0 mt-9 mb-2 flex items-center">
              {["Apply", "Upload", "Pay", "Track"].map((s, i) => (
                <div key={s} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${["bg-signal-500", "bg-sky-500", "bg-coral-500", "bg-route-500"][i]}`} />
                    <span className="text-[10px] font-display uppercase tracking-wider text-ink-400">{s}</span>
                  </div>
                  {i < 3 && <div className="route-dash text-ink-300 h-[2px] flex-1 mx-1 mb-4" />}
                </div>
              ))}
            </div>

            <div className="mt-8">
              <SearchBar />
            </div>
          </div>

          <div className="hidden lg:block">
            <HeroIllustration />
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-2">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {QUICK_ACTIONS.map((qa) => (
            <Link key={qa.label} href={qa.href} className="card flex flex-col items-center text-center gap-2 p-4 hover:-translate-y-0.5">
              <span className={`rounded-xl p-3 ${qa.color}`}>
                <qa.icon size={22} />
              </span>
              <span className="text-xs sm:text-sm font-semibold text-ink-700 leading-tight">{qa.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* AI recommendation quiz */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-16">
        <RecommendQuiz />
      </section>

      {/* Popular services */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-16">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl sm:text-2xl font-bold text-ink-800">Popular Services</h2>
          <Link href="/services" className="text-brand-600 font-semibold text-sm">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s) => (
            <ServiceCard key={s.id} slug={s.slug} name={s.name} summary={s.summary} category={s.category} fee={s.fee} icon={s.icon} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-16">
        <h2 className="text-xl sm:text-2xl font-bold text-ink-800 mb-6">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {HOW_IT_WORKS.map((h) => (
            <div key={h.step} className="card p-6">
              <span className={`font-display font-bold text-3xl ${h.color}`}>{h.step}</span>
              <h3 className="font-bold text-ink-800 mt-2">{h.title}</h3>
              <p className="text-sm text-ink-400 mt-1.5 leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Notices */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-16 mb-20">
        <h2 className="text-xl sm:text-2xl font-bold text-ink-800 mb-6 flex items-center gap-2">
          <Bell size={20} className="text-signal-500" /> Latest Notices
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {notices.map((n, i) => (
            <div key={n.id} className="card p-5 border-t-4" style={{ borderTopColor: ["#ffb100", "#0e94c4", "#7c3aed"][i % 3] }}>
              <p className="font-semibold text-ink-800 text-sm">{n.title}</p>
              <p className="text-sm text-ink-400 mt-1.5 leading-relaxed">{n.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
