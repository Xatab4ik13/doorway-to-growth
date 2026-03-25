import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { StorefrontSite } from "@/hooks/useSiteBySlug";
import { Phone, X } from "lucide-react";
import { CartButton } from "./CartButton";
import { motion, AnimatePresence } from "framer-motion";
import brandoorsLogo from "@/assets/logo.png";

interface Props {
  site: StorefrontSite;
}

const NAV_ITEMS = [
  { label: "Главная", href: "", isRoute: true },
  { label: "Каталог", href: "catalog", isRoute: true },
  { label: "Отзывы", href: "#about", isRoute: false },
  { label: "О бренде", href: "brand", isRoute: true },
  { label: "Контакты", href: "#contacts", isRoute: false },
];

const SOCIAL_LINKS = [
  { href: "https://vk.com", icon: "M12.77 19.15h1.33s.4-.04.61-.27c.19-.2.18-.59.18-.59s-.03-1.8.81-2.07c.83-.26 1.89 1.73 3.02 2.5.85.58 1.5.45 1.5.45l3.01-.04s1.57-.1.83-1.33c-.06-.1-.44-.92-2.26-2.61-1.9-1.77-1.65-1.48.64-4.54 1.4-1.86 1.96-3 1.78-3.49-.16-.46-1.16-.34-1.16-.34l-3.39.02s-.25-.03-.44.08c-.18.11-.3.36-.3.36s-.53 1.42-1.24 2.63c-1.5 2.55-2.1 2.69-2.34 2.53-.57-.37-.43-1.52-.43-2.33 0-2.53.39-3.59-.75-3.86-.38-.09-.65-.15-1.62-.16-1.24-.01-2.29 0-2.88.29-.39.2-.7.63-.51.65.23.03.75.14 1.03.52.36.49.35 1.59.35 1.59s.2 2.98-.48 3.35c-.47.25-1.12-.26-2.5-2.6-.67-1.19-1.18-2.51-1.18-2.51s-.1-.24-.27-.37c-.22-.16-.52-.21-.52-.21l-3.22.02s-.48.01-.66.22c-.16.19-.01.58-.01.58s2.51 5.87 5.35 8.83c2.6 2.71 5.55 2.53 5.55 2.53z" },
  { href: "https://t.me", icon: "M11.94 24c6.6 0 12-5.4 12-12s-5.4-12-12-12-12 5.4-12 12 5.4 12 12 12zm-3.85-8.4l.42-3.97 7.47-6.76c.33-.3-.07-.44-.51-.18l-9.22 5.81-3.56-1.11c-.77-.24-.78-.77.16-1.14l13.9-5.36c.64-.29 1.24.15 1 1.14l-2.37 11.16c-.17.8-.65.99-1.31.62l-3.62-2.67-1.75 1.69c-.19.2-.36.36-.71.36z" },
];

const EASE_SMOOTH: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function StorefrontHeader({ site }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavClick = useCallback((item: typeof NAV_ITEMS[0]) => {
    setMobileOpen(false);
    if (item.isRoute) {
      navigate(`/store/${site.slug}/${item.href}`);
    } else {
      // For hash links, check if we're on the main storefront page
      const isStorefrontMain = window.location.pathname === `/store/${site.slug}` || window.location.pathname === `/store/${site.slug}/`;
      if (isStorefrontMain) {
        const el = document.querySelector(item.href);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        navigate(`/store/${site.slug}`);
        setTimeout(() => {
          const el = document.querySelector(item.href);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }, 500);
      }
    }
  }, [site.slug, navigate]);

  return (
    <>
      {/* Mobile top bar — transparent, always visible */}
      <header className="fixed top-0 left-0 right-0 z-50 md:hidden">
        <div className="px-5 h-14 flex items-center justify-between bg-storefront-bg/80 backdrop-blur-md border-b border-white/5">
          {/* Burger left */}
          <button
            onClick={() => setMobileOpen(true)}
            className="w-8 h-8 flex flex-col items-center justify-center gap-[5px]"
          >
            <span className="block w-5 h-[1.5px] bg-storefront-gold" />
            <span className="block w-4 h-[1.5px] bg-storefront-gold" />
            <span className="block w-5 h-[1.5px] bg-storefront-gold" />
          </button>

          {/* Logo center */}
          <img
            src={brandoorsLogo}
            alt="Brandoors"
            className="h-6"
            style={{ filter: "brightness(0) invert(1)", opacity: 0.9 }}
          />

          {/* Cart right */}
          <CartButton />
        </div>
      </header>

      {/* Mobile slide-out panel — gold L-shape like desktop */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[60] bg-black/60 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Gold panel */}
            <motion.div
              className="fixed top-0 left-0 bottom-0 z-[70] md:hidden"
              style={{ width: "300px" }}
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.5, ease: EASE_SMOOTH }}
            >
              {/* Gold background SVG — L-shape */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 300 900"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="mobileGold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#cfbb96" />
                    <stop offset="10%" stopColor="#c2b08c" />
                    <stop offset="25%" stopColor="#b2a07c" />
                    <stop offset="40%" stopColor="#a59370" />
                    <stop offset="55%" stopColor="#9a8a69" />
                    <stop offset="70%" stopColor="#887555" />
                    <stop offset="85%" stopColor="#78674b" />
                    <stop offset="100%" stopColor="#6e5f40" />
                  </linearGradient>
                </defs>
                <rect width="300" height="900" fill="url(#mobileGold)" />
              </svg>

              {/* Close button — high z-index, above SVG */}
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center"
                aria-label="Закрыть меню"
              >
                <X className="w-6 h-6" style={{ color: "rgba(26,20,8,0.6)" }} />
              </button>

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full px-8 pt-16">
                {/* Navigation */}
                <nav className="flex flex-col gap-1 mb-10">
                  {NAV_ITEMS.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleNavClick(item)}
                      className="text-left text-[13px] font-semibold uppercase tracking-[0.25em] py-3 transition-colors duration-300"
                      style={{ fontFamily: "'Raleway', sans-serif", color: "rgba(26,20,8,0.55)" }}
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>

                {/* Divider */}
                <div className="w-12 h-px mb-8" style={{ background: "rgba(26,20,8,0.15)" }} />

                {/* Phone */}
                {site.phone && (
                  <a
                    href={`tel:${site.phone}`}
                    className="flex items-center gap-3 mb-8"
                  >
                    <Phone className="w-4 h-4" style={{ color: "rgba(26,20,8,0.4)" }} />
                    <span
                      className="text-sm font-medium"
                      style={{ fontFamily: "'Raleway', sans-serif", color: "rgba(26,20,8,0.7)" }}
                    >
                      {site.phone}
                    </span>
                  </a>
                )}

                {/* Spacer */}
                <div className="flex-1" />

                {/* Logo */}
                <div className="flex justify-center mb-10">
                  <img
                    src={brandoorsLogo}
                    alt="Brandoors"
                    style={{ filter: "brightness(0)", opacity: 0.7, width: "auto", height: "60px" }}
                  />
                </div>

                {/* Social links */}
                <div className="flex items-center justify-center gap-3 mb-10">
                  {SOCIAL_LINKS.map((s, i) => (
                    <a
                      key={i}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 flex items-center justify-center border transition-all duration-300"
                      style={{ borderColor: "rgba(26,20,8,0.15)" }}
                    >
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" style={{ fill: "rgba(26,20,8,0.4)" }}>
                        <path d={s.icon} />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
