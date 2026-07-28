import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "../lib/supportChat";

const TAWK_SRC = "https://embed.tawk.to/6a687f504e35e01d476b498d/1juk32lba";

// Loads the Tawk.to widget lazily on first entry into the signed-in dashboard area,
// then just shows/hides it as the user navigates — never loaded at all for anonymous
// visitors on the landing/login/signup pages or in /vaultadmin.
export function SupportChat() {
  const location = useLocation();
  const loadedRef = useRef(false);
  const shouldShow = location.pathname.startsWith("/dashboard") && !!localStorage.getItem("authToken");
  const shouldShowRef = useRef(shouldShow);
  shouldShowRef.current = shouldShow;

  useEffect(() => {
    if (!loadedRef.current) {
      if (!shouldShow) return;
      loadedRef.current = true;

      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_API.onLoad = function () {
        if (!shouldShowRef.current) window.Tawk_API?.hideWidget?.();
      };
      window.Tawk_LoadStart = new Date();

      const script = document.createElement("script");
      script.async = true;
      script.src = TAWK_SRC;
      script.charset = "UTF-8";
      script.setAttribute("crossorigin", "*");
      document.body.appendChild(script);
      return;
    }

    if (shouldShow) {
      window.Tawk_API?.showWidget?.();
    } else {
      window.Tawk_API?.hideWidget?.();
    }
  }, [shouldShow]);

  return null;
}
