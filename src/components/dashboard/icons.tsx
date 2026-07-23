import type { SVGProps } from "react";

const base = { viewBox: "0 0 24 24", fill: "none" } as const;
const stroke = { stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export function TransferIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M7 17 17 7M17 7H9M17 7v8" {...stroke} />
    </svg>
  );
}

export function CryptoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" {...stroke} />
      <path
        d="M10.3 8.7h2.6c1 0 1.75.62 1.75 1.5 0 .65-.4 1.1-.95 1.32.72.2 1.2.7 1.2 1.45 0 1.02-.85 1.63-1.9 1.63h-2.7V8.7Zm.5 2.7h1.75c.6 0 .97-.3.97-.75 0-.46-.37-.75-.97-.75H10.8v1.5Zm0 2.7h1.9c.63 0 1.05-.32 1.05-.82s-.42-.8-1.05-.8H10.8v1.62Z"
        fill="currentColor"
      />
      <path d="M11.9 7.4v1.1M12.9 7.4v1.1M11.9 15.5v1.1M12.9 15.5v1.1" {...stroke} strokeWidth={1.4} />
    </svg>
  );
}

export function ReceiptIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M6 3.5h12v17l-2.2-1.4-2 1.4-1.8-1.4-1.8 1.4-2-1.4L6 20.5v-17Z" {...stroke} />
      <path d="M8.5 8h7M8.5 11h7M8.5 14h4.5" {...stroke} />
    </svg>
  );
}

export function PersonPlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="10" cy="8.5" r="3.2" {...stroke} />
      <path d="M4.3 19c.6-3 2.9-5 5.7-5s5.1 2 5.7 5" {...stroke} />
      <path d="M18 8.5v5M15.5 11h5" {...stroke} />
    </svg>
  );
}

export function CardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="6" width="17" height="12" rx="2.2" {...stroke} />
      <path d="M3.5 10h17" {...stroke} />
      <path d="M6.5 14.3h4" {...stroke} />
    </svg>
  );
}

export function CheckDocumentIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M6 3.7h9l3 3v13.6H6z" {...stroke} />
      <path d="M9 12.3l2 2 4-4.2" {...stroke} />
    </svg>
  );
}

export function ListIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M8 6.5h10M8 12h10M8 17.5h10" {...stroke} />
      <circle cx="4.7" cy="6.5" r="1" fill="currentColor" />
      <circle cx="4.7" cy="12" r="1" fill="currentColor" />
      <circle cx="4.7" cy="17.5" r="1" fill="currentColor" />
    </svg>
  );
}

export function BellIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M6.5 10.5a5.5 5.5 0 0 1 11 0c0 4 1.3 5.3 1.3 5.3H5.2s1.3-1.3 1.3-5.3Z" {...stroke} />
      <path d="M10.2 19a1.9 1.9 0 0 0 3.6 0" {...stroke} />
    </svg>
  );
}

export function CashIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="7" width="18" height="11" rx="2" {...stroke} />
      <circle cx="12" cy="12.5" r="2.6" {...stroke} />
      <path d="M6.5 7v11M17.5 7v11" {...stroke} strokeWidth={1.3} />
    </svg>
  );
}

export function ChartBarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M5 19.5V13M12 19.5V6M19 19.5v-8.5" {...stroke} />
      <path d="M3.5 19.5h17" {...stroke} />
    </svg>
  );
}

export function ChatIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path
        d="M4 12c0-4 3.8-7.2 8.5-7.2S21 8 21 12s-3.8 7.2-8.5 7.2c-1 0-1.96-.14-2.85-.4L4.5 20l1-3.4C4.6 15.3 4 13.7 4 12Z"
        {...stroke}
      />
    </svg>
  );
}

export function EyeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" {...stroke} />
      <circle cx="12" cy="12" r="2.7" {...stroke} />
    </svg>
  );
}

export function EyeOffIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path
        d="M4 4l16 16M9.6 9.7a2.7 2.7 0 0 0 3.8 3.8M6.8 6.9C4.3 8.4 2.5 12 2.5 12s3.5 6.5 9.5 6.5c1.7 0 3.2-.5 4.4-1.2M12 5.5c5.4 0 9.5 6.5 9.5 6.5s-.9 1.5-2.4 3"
        {...stroke}
      />
    </svg>
  );
}

export function CopyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="9" y="9" width="11" height="11" rx="2" {...stroke} />
      <path d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" {...stroke} />
    </svg>
  );
}

export function HomeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4 11.5 12 4l8 7.5" {...stroke} />
      <path d="M6 10v9.5h12V10" {...stroke} />
      <path d="M10 19.5v-5h4v5" {...stroke} />
    </svg>
  );
}

export function SettingsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="3" {...stroke} />
      <path
        d="M12 3.7v2M12 18.3v2M20.3 12h-2M5.7 12h-2M17.7 6.3l-1.4 1.4M7.7 16.3l-1.4 1.4M17.7 17.7l-1.4-1.4M7.7 7.7 6.3 6.3"
        {...stroke}
      />
    </svg>
  );
}

export function LogoutIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M15 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-2" {...stroke} />
      <path d="M9 12h11.5M17 8.5l3.5 3.5-3.5 3.5" {...stroke} />
    </svg>
  );
}

export function MenuGridIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" {...stroke} />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" {...stroke} />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" {...stroke} />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" {...stroke} />
    </svg>
  );
}

export function ShieldIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5 5 6v5.5c0 4.4 3 7.9 7 9 4-1.1 7-4.6 7-9V6l-7-2.5Z" {...stroke} />
      <path d="M9 12l2 2 4-4.2" {...stroke} />
    </svg>
  );
}

export function InboxIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 13 6 5h12l2.5 8" {...stroke} />
      <path d="M3.5 13v5a1.5 1.5 0 0 0 1.5 1.5h14A1.5 1.5 0 0 0 20.5 18v-5" {...stroke} />
      <path d="M3.5 13h5.2c.3 1.2 1.4 2 2.8 2s2.5-.8 2.8-2h5.2" {...stroke} />
    </svg>
  );
}

export function PlusCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" {...stroke} />
      <path d="M12 8.3v7.4M8.3 12h7.4" {...stroke} />
    </svg>
  );
}
