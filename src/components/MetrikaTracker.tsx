import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { initMetrika, trackPageView } from "@/lib/metrika";

export function MetrikaTracker() {
  const location = useLocation();
  const prev = useRef<string | null>(null);

  useEffect(() => {
    initMetrika();
  }, []);

  useEffect(() => {
    const url = location.pathname + location.search;
    if (prev.current === url) return;
    const referrer = prev.current
      ? window.location.origin + prev.current
      : document.referrer || undefined;
    if (prev.current !== null) trackPageView(window.location.origin + url, referrer);
    prev.current = url;
  }, [location.pathname, location.search]);

  return null;
}
