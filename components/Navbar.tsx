"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { useLang } from "@/lib/lang-context";
import { Bus, Menu, X, LogOut, LayoutDashboard, Languages } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();
  const { lang, setLang, t } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const role = (session?.user as any)?.role as string | undefined;

  const dashboardHref = role === "ADMIN" ? "/dashboard/admin" : role === "OFFICER" ? "/dashboard/officer" : "/dashboard/citizen";

  const navLinks = [
    { href: "/services", label: "Services" },
    { href: "/track", label: t.trackApplication },
    { href: "/faq", label: t.faqs },
    { href: "/contact", label: "Contact" }
  ];

  return (
    <header className="sticky top-0 z-40 bg-concrete-50/95 backdrop-blur border-b-2 border-ink-700">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2.5 font-display font-semibold text-ink-800 text-lg uppercase tracking-wide">
          <span className="bg-ink-700 text-signal-400 rounded-lg p-1.5">
            <Bus size={20} />
          </span>
          Smart Transport
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-ink-500">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-ink-800 transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
            className="flex items-center gap-1.5 text-xs font-semibold text-ink-600 border border-ink-200 rounded-lg px-3 py-2 hover:bg-white"
          >
            <Languages size={15} />
            {lang === "en" ? "हिंदी" : "English"}
          </button>

          {session ? (
            <>
              <Link href={dashboardHref} className="flex items-center gap-1.5 text-sm font-semibold text-ink-700 hover:text-ink-900">
                <LayoutDashboard size={16} />
                {t.dashboard}
              </Link>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-1.5 text-sm font-semibold text-ink-400 hover:text-rust-500">
                <LogOut size={16} />
                {t.logout}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold text-ink-700 hover:text-ink-900">
                {t.login}
              </Link>
              <Link href="/register" className="btn-primary !px-4 !py-2 text-xs">
                {t.register}
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden text-ink-700" onClick={() => setMenuOpen((o) => !o)} aria-label="Menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-ink-100 px-4 py-3 flex flex-col gap-3 bg-concrete-50">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="text-sm font-medium text-slate-700">
              {l.label}
            </Link>
          ))}
          <button
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg px-3 py-2 w-fit"
          >
            <Languages size={15} />
            {lang === "en" ? "हिंदी" : "English"}
          </button>
          {session ? (
            <>
              <Link href={dashboardHref} onClick={() => setMenuOpen(false)} className="text-sm font-semibold text-brand-700">
                {t.dashboard}
              </Link>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="text-sm font-semibold text-red-600 text-left">
                {t.logout}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)} className="text-sm font-semibold text-brand-700">
                {t.login}
              </Link>
              <Link href="/register" onClick={() => setMenuOpen(false)} className="text-sm font-semibold text-brand-700">
                {t.register}
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
