// Lightweight EN/HI dictionary for core UI strings.
// Service-level bilingual content (name/summary) is stored per-record in the DB (nameHi/summaryHi).
export const dict = {
  en: {
    tagline: "Your friendly digital transport assistant",
    searchPlaceholder: "Search for a service e.g. 'renew licence'",
    quickActions: "Quick Actions",
    popularServices: "Popular Services",
    howItWorks: "How It Works",
    latestNotices: "Latest Notices",
    faqs: "Frequently Asked Questions",
    getHelp: "Get Help",
    applyNow: "Apply Now",
    trackApplication: "Track Application",
    login: "Login",
    logout: "Logout",
    register: "Register",
    dashboard: "Dashboard"
  },
  hi: {
    tagline: "आपका मित्रवत डिजिटल परिवहन सहायक",
    searchPlaceholder: "सेवा खोजें जैसे 'लाइसेंस नवीनीकरण'",
    quickActions: "त्वरित कार्य",
    popularServices: "लोकप्रिय सेवाएं",
    howItWorks: "यह कैसे काम करता है",
    latestNotices: "नवीनतम सूचनाएं",
    faqs: "अक्सर पूछे जाने वाले प्रश्न",
    getHelp: "सहायता प्राप्त करें",
    applyNow: "अभी आवेदन करें",
    trackApplication: "आवेदन ट्रैक करें",
    login: "लॉगिन",
    logout: "लॉगआउट",
    register: "पंजीकरण करें",
    dashboard: "डैशबोर्ड"
  }
} as const;

export type Lang = keyof typeof dict;
