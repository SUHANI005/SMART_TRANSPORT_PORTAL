export function HeroIllustration() {
  return (
    <svg viewBox="0 0 400 260" className="w-full h-auto max-w-md mx-auto" role="img" aria-label="Illustration of a bus travelling on a road past hills and a rising sun">
      {/* Sky */}
      <rect width="400" height="260" rx="24" fill="#eaf6fb" />

      {/* Sun */}
      <circle cx="330" cy="60" r="34" fill="#ffb100" />
      <circle cx="330" cy="60" r="34" fill="url(#sunGlow)" opacity="0.5" />

      {/* Clouds */}
      <g fill="#ffffff" opacity="0.9">
        <ellipse cx="70" cy="55" rx="30" ry="14" />
        <ellipse cx="95" cy="48" rx="22" ry="12" />
        <ellipse cx="180" cy="35" rx="20" ry="10" />
      </g>

      {/* Hills */}
      <path d="M0 175 Q 60 120 130 170 T 260 165 T 400 175 V 260 H 0 Z" fill="#c3ebdd" />
      <path d="M0 195 Q 80 150 190 190 T 400 195 V 260 H 0 Z" fill="#0f7a5c" opacity="0.85" />

      {/* Road */}
      <path d="M0 235 L 160 235 L 190 260 L 0 260 Z" fill="#233c63" />
      <path d="M400 235 L 240 235 L 210 260 L 400 260 Z" fill="#233c63" />
      <rect x="160" y="235" width="80" height="25" fill="#14213d" />
      {/* Lane markings */}
      <g fill="#ffb100">
        <rect x="60" y="245" width="18" height="5" rx="2" />
        <rect x="110" y="245" width="18" height="5" rx="2" />
        <rect x="270" y="245" width="18" height="5" rx="2" />
        <rect x="320" y="245" width="18" height="5" rx="2" />
      </g>

      {/* Bus */}
      <g transform="translate(120,150)">
        <rect x="0" y="20" width="130" height="55" rx="14" fill="#14213d" />
        <rect x="0" y="20" width="130" height="30" rx="14" fill="#ffb100" />
        {/* windows */}
        <rect x="14" y="27" width="24" height="18" rx="4" fill="#eaf6fb" />
        <rect x="46" y="27" width="24" height="18" rx="4" fill="#eaf6fb" />
        <rect x="78" y="27" width="24" height="18" rx="4" fill="#eaf6fb" />
        {/* door */}
        <rect x="106" y="50" width="16" height="25" rx="2" fill="#0e94c4" />
        {/* stripe */}
        <rect x="0" y="55" width="130" height="6" fill="#e8433d" />
        {/* wheels */}
        <circle cx="28" cy="80" r="13" fill="#0a1122" />
        <circle cx="28" cy="80" r="5" fill="#c3e9f5" />
        <circle cx="100" cy="80" r="13" fill="#0a1122" />
        <circle cx="100" cy="80" r="5" fill="#c3e9f5" />
      </g>

      <defs>
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb100" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ffb100" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
