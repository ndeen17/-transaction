export function AboutIllustration() {
  return (
    <svg
      viewBox="0 0 600 620"
      className="h-full w-full"
      preserveAspectRatio="xMidYMax slice"
      role="img"
      aria-label="Illustration of a person sitting cross-legged using a phone and a payment card"
    >
      <defs>
        <linearGradient id="about-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#EAF3FF" />
          <stop offset="55%" stopColor="#9DC4FB" />
          <stop offset="100%" stopColor="#4F8CF0" />
        </linearGradient>
        <radialGradient id="about-glow" cx="50%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="600" height="620" fill="url(#about-bg)" />
      <rect width="600" height="620" fill="url(#about-glow)" />

      <ellipse cx="300" cy="520" rx="190" ry="26" fill="#3A6FD8" opacity="0.25" />

      {/* legs, crossed */}
      <path
        d="M170 470c10-55 60-70 110-64 30 4 45 26 80 22 45-5 75-30 100-14 18 12 8 46-18 56-55 22-140 26-190 12-45-12-88-6-82-12Z"
        fill="#DCE7FB"
      />
      <path
        d="M175 468c8-46 55-58 100-50 34 6 42 30 84 24 40-5 68-24 92-10"
        fill="none"
        stroke="#B9CCEE"
        strokeWidth="3"
        opacity="0.6"
      />

      {/* torso / shirt */}
      <path
        d="M232 250c-10 60-30 108-16 168 6 26 34 40 78 40s76-16 82-44c12-58-2-116-14-166-10-40-38-58-66-58s-54 20-64 60Z"
        fill="#FFFFFF"
      />

      {/* left arm to card */}
      <path
        d="M240 300c-30 18-52 46-58 78-4 22 2 40 18 44"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="34"
        strokeLinecap="round"
      />
      <g transform="translate(160 402) rotate(-18)">
        <rect x="0" y="0" width="54" height="36" rx="6" fill="#E3B978" />
        <rect x="0" y="9" width="54" height="7" fill="#C79B57" />
      </g>
      <circle cx="192" cy="404" r="17" fill="#E3B27C" />

      {/* right arm to phone */}
      <path
        d="M366 296c34 14 60 40 70 72 7 22 2 42-14 48"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="34"
        strokeLinecap="round"
      />
      <circle cx="418" cy="410" r="18" fill="#E3B27C" />
      <g transform="translate(398 372) rotate(10)">
        <rect x="0" y="0" width="40" height="70" rx="9" fill="#111318" />
        <rect x="4" y="8" width="32" height="48" rx="2" fill="#4F9BFF" />
      </g>

      {/* neck + head */}
      <rect x="278" y="176" width="44" height="40" rx="14" fill="#E3B27C" />
      <circle cx="300" cy="150" r="52" fill="#E9BB86" />
      <path
        d="M248 140c0-34 24-58 52-58s52 22 54 52c-10-10-24-16-30-8-6-10-20-14-32-8-14 6-18 2-24-8-6 12-16 20-20 30Z"
        fill="#2B211B"
      />
      <path d="M254 128c10-4 18 2 20 12" fill="none" stroke="#2B211B" strokeWidth="6" strokeLinecap="round" />

      {/* collar */}
      <path d="M282 214c8 10 28 10 36 0" fill="none" stroke="#DCE7FB" strokeWidth="5" strokeLinecap="round" />

      {/* floating chips echoing the mock */}
      <g transform="translate(420 120)">
        <rect width="150" height="46" rx="23" fill="#FFFFFF" opacity="0.9" />
        <circle cx="26" cy="23" r="12" fill="#EE4A4A" />
        <text x="48" y="20" fontSize="9" fill="#94A0B4" fontFamily="General Sans, sans-serif">
          Transaction fee
        </text>
        <text x="48" y="33" fontSize="11" fontWeight="600" fill="#EE4A4A" fontFamily="General Sans, sans-serif">
          -60.45$
        </text>
      </g>
      <g transform="translate(430 178)">
        <rect width="150" height="46" rx="23" fill="#FFFFFF" opacity="0.9" />
        <circle cx="26" cy="23" r="12" fill="#012169" />
        <text x="48" y="20" fontSize="9" fill="#94A0B4" fontFamily="General Sans, sans-serif">
          Bank transfer
        </text>
        <text x="48" y="33" fontSize="11" fontWeight="600" fill="#22C55E" fontFamily="General Sans, sans-serif">
          +350.85$
        </text>
      </g>
    </svg>
  );
}
