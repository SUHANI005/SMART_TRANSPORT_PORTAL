import Link from "next/link";
import { Bus, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-ink-900 text-slate-300 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="flex items-center gap-2 font-bold text-white text-lg mb-3">
            <span className="bg-signal-400 text-ink-800 rounded-lg p-1.5">
              <Bus size={18} />
            </span>
            Smart Transport
          </div>
          <p className="text-slate-400 leading-relaxed">A friendly digital transport assistant — driving licences, vehicle services, permits, and challan payments, all in one place.</p>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Quick Links</h4>
          <ul className="space-y-2 text-slate-400">
            <li><Link href="/services" className="hover:text-white">All Services</Link></li>
            <li><Link href="/track" className="hover:text-white">Track Application</Link></li>
            <li><Link href="/faq" className="hover:text-white">FAQs</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Policies</h4>
          <ul className="space-y-2 text-slate-400">
            <li><Link href="/faq" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/faq" className="hover:text-white">Terms of Use</Link></li>
            <li><Link href="/faq" className="hover:text-white">Refund Policy</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Contact</h4>
          <ul className="space-y-2 text-slate-400">
            <li className="flex items-center gap-2"><Phone size={14} /> 1800-000-0000 (toll free)</li>
            <li className="flex items-center gap-2"><Mail size={14} /> help@smarttransport.demo</li>
            <li className="flex items-center gap-2"><MapPin size={14} /> Demo Project — Not a government website</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-700 text-center text-xs text-slate-500 py-4">
        © {new Date().getFullYear()} Smart Transport Services Portal. Demo project inspired by public transport services — original branding &amp; sample data only.
      </div>
    </footer>
  );
}
