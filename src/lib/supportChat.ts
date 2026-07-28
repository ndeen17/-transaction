declare global {
  interface Window {
    Tawk_API?: {
      onLoad?: () => void;
      showWidget?: () => void;
      hideWidget?: () => void;
      maximize?: () => void;
    };
    Tawk_LoadStart?: Date;
  }
}

// Opens the chat widget in its expanded window — used by the "Support" nav item. Safe to
// call even if the widget hasn't finished loading yet (SupportChat only injects the script
// once the user is signed in and inside /dashboard, which is the only place this is called
// from); it just silently no-ops in that unlikely race rather than throwing.
export function openSupportChat() {
  window.Tawk_API?.maximize?.();
}
