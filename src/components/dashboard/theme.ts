// Shared design tokens for the dashboard app shell. Kept separate from the
// marketing site's `lib/theme.ts` (`PANEL`) deliberately — the dashboard has its
// own, slightly more conservative visual language (neutral bg, tighter shadows,
// smaller radii) that shouldn't bleed into the landing page or signup wizard.

export const DASH_CARD =
  "rounded-[20px] border border-[#E5E7EB] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)]";

export const DASH_CARD_HOVER =
  "transition-all duration-200 ease-in-out hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:border-[#D1D5DB]";

export const DASH_SHADOW_SM = "shadow-[0_2px_8px_rgba(0,0,0,0.05)]";
export const DASH_SHADOW_MD = "shadow-[0_8px_24px_rgba(0,0,0,0.08)]";

export const DASH_FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2";
