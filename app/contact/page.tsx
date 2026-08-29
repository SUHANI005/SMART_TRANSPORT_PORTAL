import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14 text-center">
      <h1 className="text-2xl sm:text-3xl font-display font-semibold text-ink-800 mb-2 uppercase tracking-wide">Get Help</h1>
      <p className="text-ink-400 mb-10">We're here to help you get things done — no confusing government language, promise.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="card p-6">
          <span className="inline-flex bg-sky-100 text-sky-600 rounded-xl p-3 mb-2">
            <Phone size={22} />
          </span>
          <p className="font-semibold text-ink-800 text-sm">Call Us</p>
          <p className="text-ink-400 text-xs mt-1">1800-000-0000 (toll free)</p>
        </div>
        <div className="card p-6">
          <span className="inline-flex bg-coral-100 text-coral-600 rounded-xl p-3 mb-2">
            <Mail size={22} />
          </span>
          <p className="font-semibold text-ink-800 text-sm">Email</p>
          <p className="text-ink-400 text-xs mt-1">help@smarttransport.demo</p>
        </div>
        <div className="card p-6">
          <span className="inline-flex bg-violet-100 text-violet-600 rounded-xl p-3 mb-2">
            <MapPin size={22} />
          </span>
          <p className="font-semibold text-ink-800 text-sm">Visit</p>
          <p className="text-ink-400 text-xs mt-1">Find your nearest RTO office listed in Book Appointment</p>
        </div>
      </div>

      <div className="card p-6 bg-gradient-to-r from-violet-50 to-sky-50 border-violet-100 flex items-center gap-3 text-left">
        <span className="bg-white rounded-full p-2.5 shrink-0">
          <MessageCircle size={22} className="text-violet-600" />
        </span>
        <p className="text-sm text-ink-700">
          For instant answers, click <strong>Ask Assistant</strong> in the bottom-right corner — our AI Transport Assistant can guide you in plain English or Hindi, any time.
        </p>
      </div>
    </div>
  );
}
