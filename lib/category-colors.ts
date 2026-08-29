// Maps each service category to a distinct color family, so the site reads
// as colorful and wayfinding-friendly rather than one flat brand color everywhere.
export type CategoryPalette = {
  chipBg: string;
  chipText: string;
  badgeBg: string;
  badgeText: string;
  ring: string;
  solidBg: string;
  gradientFrom: string;
  gradientTo: string;
};

const PALETTES: Record<string, CategoryPalette> = {
  "Driving Licence": {
    chipBg: "bg-signal-100",
    chipText: "text-ink-800",
    badgeBg: "bg-signal-50",
    badgeText: "text-signal-600",
    ring: "ring-signal-300",
    solidBg: "bg-signal-400",
    gradientFrom: "from-signal-400",
    gradientTo: "to-signal-600"
  },
  "Vehicle Services": {
    chipBg: "bg-sky-100",
    chipText: "text-sky-600",
    badgeBg: "bg-sky-50",
    badgeText: "text-sky-600",
    ring: "ring-sky-300",
    solidBg: "bg-sky-500",
    gradientFrom: "from-sky-400",
    gradientTo: "to-sky-600"
  },
  Payments: {
    chipBg: "bg-coral-100",
    chipText: "text-coral-600",
    badgeBg: "bg-coral-50",
    badgeText: "text-coral-600",
    ring: "ring-coral-300",
    solidBg: "bg-coral-500",
    gradientFrom: "from-coral-400",
    gradientTo: "to-coral-600"
  },
  Permits: {
    chipBg: "bg-violet-100",
    chipText: "text-violet-600",
    badgeBg: "bg-violet-50",
    badgeText: "text-violet-600",
    ring: "ring-violet-300",
    solidBg: "bg-violet-500",
    gradientFrom: "from-violet-400",
    gradientTo: "to-violet-600"
  }
};

const DEFAULT: CategoryPalette = {
  chipBg: "bg-route-100",
  chipText: "text-route-600",
  badgeBg: "bg-route-50",
  badgeText: "text-route-600",
  ring: "ring-route-300",
  solidBg: "bg-route-500",
  gradientFrom: "from-route-400",
  gradientTo: "to-route-600"
};

export function getCategoryPalette(category: string): CategoryPalette {
  return PALETTES[category] ?? DEFAULT;
}
