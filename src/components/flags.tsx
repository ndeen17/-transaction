import type { SVGProps } from "react";

type FlagProps = SVGProps<SVGSVGElement>;

function Flag({
  id,
  children,
  ...props
}: FlagProps & { id: string; children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 40 40" {...props}>
      <defs>
        <clipPath id={id}>
          <circle cx="20" cy="20" r="20" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>{children}</g>
    </svg>
  );
}

export function FlagChSaudi(props: FlagProps) {
  return (
    <Flag id="flag-ch" {...props}>
      <rect width="40" height="40" fill="#D80027" />
      <rect x="16" y="8" width="8" height="24" fill="#fff" />
      <rect x="8" y="16" width="24" height="8" fill="#fff" />
    </Flag>
  );
}

export function FlagSaudi(props: FlagProps) {
  return (
    <Flag id="flag-sa" {...props}>
      <rect width="40" height="40" fill="#0A6B3D" />
      <rect x="9" y="24" width="22" height="3" fill="#fff" />
      <circle cx="13" cy="16" r="2.4" fill="#fff" />
    </Flag>
  );
}

export function FlagNorway(props: FlagProps) {
  return (
    <Flag id="flag-no" {...props}>
      <rect width="40" height="40" fill="#EF2B2D" />
      <rect x="14" y="0" width="7" height="40" fill="#fff" />
      <rect x="0" y="16.5" width="40" height="7" fill="#fff" />
      <rect x="16" y="0" width="3" height="40" fill="#002868" />
      <rect x="0" y="18.5" width="40" height="3" fill="#002868" />
    </Flag>
  );
}

export function FlagSweden(props: FlagProps) {
  return (
    <Flag id="flag-se" {...props}>
      <rect width="40" height="40" fill="#006AA7" />
      <rect x="14" y="0" width="6" height="40" fill="#FECC02" />
      <rect x="0" y="17" width="40" height="6" fill="#FECC02" />
    </Flag>
  );
}

export function FlagUSA(props: FlagProps) {
  return (
    <Flag id="flag-us" {...props}>
      <rect width="40" height="40" fill="#fff" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} x="0" y={i * (40 / 13)} width="40" height={40 / 13} fill="#D80027" />
      ))}
      <rect x="0" y="0" width="20" height="21.5" fill="#002868" />
    </Flag>
  );
}

export function FlagLebanon(props: FlagProps) {
  return (
    <Flag id="flag-lb" {...props}>
      <rect width="40" height="40" fill="#EE161F" />
      <rect x="0" y="10" width="40" height="20" fill="#fff" />
      <path d="M20 15 L23 24 L15 18.5 H25 L17 24 Z" fill="#00A651" />
    </Flag>
  );
}

export function FlagTurkey(props: FlagProps) {
  return (
    <Flag id="flag-tr" {...props}>
      <rect width="40" height="40" fill="#E30A17" />
      <circle cx="17" cy="20" r="7" fill="#fff" />
      <circle cx="19" cy="20" r="5.6" fill="#E30A17" />
      <circle cx="26" cy="20" r="1.6" fill="#fff" />
    </Flag>
  );
}

export function FlagEU(props: FlagProps) {
  return (
    <Flag id="flag-eu" {...props}>
      <rect width="40" height="40" fill="#003399" />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const cx = 20 + Math.cos(angle) * 10;
        const cy = 20 + Math.sin(angle) * 10;
        return <circle key={i} cx={cx} cy={cy} r="1.3" fill="#FFCC00" />;
      })}
    </Flag>
  );
}

export function FlagGermany(props: FlagProps) {
  return (
    <Flag id="flag-de" {...props}>
      <rect width="40" height="40" fill="#FFCE00" />
      <rect x="0" y="0" width="40" height="13.3" fill="#000" />
      <rect x="0" y="13.3" width="40" height="13.3" fill="#D00" />
    </Flag>
  );
}

export function FlagSouthAfrica(props: FlagProps) {
  return (
    <Flag id="flag-za" {...props}>
      <rect width="40" height="40" fill="#fff" />
      <path d="M0 4 H40 V16 H0 Z" fill="#002395" />
      <path d="M0 24 H40 V36 H0 Z" fill="#DE3831" />
      <path d="M0 4 L18 20 L0 36 Z" fill="#007A4D" />
      <path d="M0 10 L14 20 L0 30 Z" fill="#FFB612" />
      <path d="M0 14 L10 20 L0 26 Z" fill="#000" />
    </Flag>
  );
}

export function FlagJapan(props: FlagProps) {
  return (
    <Flag id="flag-jp" {...props}>
      <rect width="40" height="40" fill="#fff" />
      <circle cx="20" cy="20" r="8" fill="#D80027" />
    </Flag>
  );
}

export function FlagUkraine(props: FlagProps) {
  return (
    <Flag id="flag-ua" {...props}>
      <rect width="40" height="20" fill="#005BBB" />
      <rect y="20" width="40" height="20" fill="#FFD500" />
    </Flag>
  );
}

export function FlagUK(props: FlagProps) {
  return (
    <Flag id="flag-gb" {...props}>
      <rect width="40" height="40" fill="#012169" />
      <path d="M0 0 40 40M40 0 0 40" stroke="#fff" strokeWidth="6" />
      <path d="M0 0 40 40M40 0 0 40" stroke="#C8102E" strokeWidth="2.4" />
      <path d="M20 0 V40 M0 20 H40" stroke="#fff" strokeWidth="10" />
      <path d="M20 0 V40 M0 20 H40" stroke="#C8102E" strokeWidth="4" />
    </Flag>
  );
}
